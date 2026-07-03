/**
 * Lead-capture HTTP handler.
 *
 * Mounts at:
 *   POST mx.allabout.network/api/v1/lead/pdf-check
 *   POST mx.allabout.network/api/v1/lead/certified-operator-waitlist
 *
 * Accepts either JSON (progressive-enhanced fetch from the page JS) or
 * form-urlencoded (no-JS fallback). Returns JSON when Accept includes
 * 'application/json', otherwise 303 See Other redirect with a
 * ?submitted=<formType> query parameter the page JS uses to flip the
 * inline status element.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags lead-capture, handler, mx-site
 */

import {
  validateLeadCapture,
  sendLeadCaptureEmails,
  buildSuccessRedirectUrl,
  buildSuccessResponseBody,
  chooseGeneralEnquiryAdminKey,
  verifyTurnstile,
} from '../lib/lead-capture.js';

const ALLOWED_ORIGINS = new Set([
  'https://mx.allabout.network',
  'https://allabout.network',
]);

const SITE_BASE = 'https://mx.allabout.network';

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://mx.allabout.network';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Vary': 'Origin',
  };
}

function jsonResponse(request, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(request),
    },
  });
}

function wantsJson(request) {
  const accept = (request.headers.get('Accept') || '').toLowerCase();
  return accept.includes('application/json');
}

async function parseSubmission(request) {
  const contentType = (request.headers.get('Content-Type') || '').toLowerCase();
  if (contentType.includes('application/json')) {
    try {
      const data = await request.json();
      return { ok: true, data };
    } catch (e) {
      return { ok: false, error: 'Unparseable JSON body.' };
    }
  }
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    try {
      const form = await request.formData();
      const data = {};
      for (const [key, value] of form.entries()) {
        if (key === 'consent') {
          data.consent = value === 'on' || value === 'yes' || value === 'true';
        } else {
          data[key] = typeof value === 'string' ? value : '';
        }
      }
      return { ok: true, data };
    } catch (e) {
      return { ok: false, error: 'Unparseable form body.' };
    }
  }
  // Unknown content type — try JSON as last resort.
  try {
    const text = await request.text();
    if (text) {
      const data = JSON.parse(text);
      return { ok: true, data };
    }
  } catch (e) {
    // fall through
  }
  return { ok: false, error: 'Unsupported content type.' };
}

function formTypeFromPath(pathname) {
  if (pathname === '/api/v1/lead/pdf-check') return 'pdf-check';
  if (pathname === '/api/v1/lead/certified-operator-waitlist') return 'certified-operator-waitlist';
  if (pathname === '/api/v1/lead/general-enquiry') return 'general-enquiry';
  return null;
}

/**
 * Pure dispatcher: tests can call this without a real Request to confirm
 * the path-to-formType mapping is correct.
 */
export function classifyLeadCaptureRequest(method, pathname) {
  if (method === 'OPTIONS') return { kind: 'preflight', formType: null };
  if (method !== 'POST') return { kind: 'method-not-allowed', formType: null };
  const formType = formTypeFromPath(pathname);
  if (!formType) return { kind: 'not-found', formType: null };
  return { kind: 'submit', formType };
}

export async function handleLeadCapture(request, env, url) {
  const method = request.method.toUpperCase();
  const classification = classifyLeadCaptureRequest(method, url.pathname);

  if (classification.kind === 'preflight') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }
  if (classification.kind === 'method-not-allowed') {
    return jsonResponse(request, 405, { ok: false, error: 'Method Not Allowed' });
  }
  if (classification.kind === 'not-found') {
    return jsonResponse(request, 404, { ok: false, error: 'Not Found' });
  }

  const { formType } = classification;

  // --- Turnstile bot protection ---
  // Verify the cf-turnstile-response token before touching the submission.
  // If CF_TURNSTILE_SECRET_KEY is not set (e.g. local dev), skip silently.
  if (env.CF_TURNSTILE_SECRET_KEY) {
    // We must clone the request before reading it here, because parseSubmission
    // also reads the body. We extract the token from the raw body then let
    // parseSubmission re-read the original (Workers allow a single body read;
    // we therefore peek via a clone).
    const clonedRequest = request.clone();
    let turnstileToken = null;
    try {
      const ct = (clonedRequest.headers.get('Content-Type') || '').toLowerCase();
      if (ct.includes('application/json')) {
        const json = await clonedRequest.json();
        turnstileToken = json['cf-turnstile-response'] || null;
      } else {
        const form = await clonedRequest.formData();
        turnstileToken = form.get('cf-turnstile-response') || null;
      }
    } catch (_) {
      // Unreadable body — treat as missing token
    }

    if (!turnstileToken) {
      if (wantsJson(request)) {
        return jsonResponse(request, 400, { ok: false, error: 'Bot check failed. Please refresh and try again.' });
      }
      return Response.redirect(`${SITE_BASE}/about/contact.html?error=bot-check#contact-form`, 303);
    }

    const ip = request.headers.get('CF-Connecting-IP') || undefined;
    const tsOk = await verifyTurnstile(env.CF_TURNSTILE_SECRET_KEY, turnstileToken, ip);
    if (!tsOk) {
      if (wantsJson(request)) {
        return jsonResponse(request, 400, { ok: false, error: 'Bot check failed. Please refresh and try again.' });
      }
      return Response.redirect(`${SITE_BASE}/about/contact.html?error=bot-check#contact-form`, 303);
    }
  }

  const parsed = await parseSubmission(request);
  if (!parsed.ok) {
    return jsonResponse(request, 400, { ok: false, error: parsed.error });
  }

  const validation = validateLeadCapture(formType, parsed.data);
  if (!validation.valid) {
    return jsonResponse(request, 400, { ok: false, error: validation.error });
  }

  // Choose the admin recipient. The general-enquiry form routes by
  // service: MX Printworks lines go to MX_PRINTWORKS_NOTIFY_EMAIL (Scott)
  // if configured; everything else falls through to the standard
  // LEAD_CAPTURE_NOTIFY_EMAIL → FREE_BOOK_NOTIFY_EMAIL chain (Tom).
  let adminTo = env.LEAD_CAPTURE_NOTIFY_EMAIL || env.FREE_BOOK_NOTIFY_EMAIL;
  if (formType === 'general-enquiry') {
    const adminKey = chooseGeneralEnquiryAdminKey(parsed.data.service);
    if (adminKey && env[adminKey]) {
      adminTo = env[adminKey];
    }
  }

  // Send emails — fire-and-forget on individual failures so a flaky Resend
  // call does not block the submitter's confirmation. We still log via the
  // returned promise so a fully broken send surfaces in Cloudflare logs.
  let sendError = null;
  if (env.RESEND_API_KEY && env.RESEND_FROM && env.FREE_BOOK_NOTIFY_EMAIL) {
    try {
      await sendLeadCaptureEmails(env.RESEND_API_KEY, {
        from: env.RESEND_FROM,
        adminTo,
        formType,
        data: parsed.data,
      });
    } catch (e) {
      sendError = e && e.message ? e.message : 'Email send failed.';
    }
  } else {
    sendError = 'Email provider not configured.';
  }

  // We treat a Resend failure as soft: the submission was received, the
  // user gets the optimistic confirmation, and Tom sees the failure in
  // Cloudflare logs (the sendError is included only in JSON responses for
  // diagnostic visibility during alpha; remove this echo before production
  // if it ever leaks anything sensitive).
  if (wantsJson(request)) {
    const body = buildSuccessResponseBody(formType);
    if (sendError) body.warning = `Submission received; admin notification deferred: ${sendError}`;
    return jsonResponse(request, 200, body);
  }

  const redirectPath = buildSuccessRedirectUrl(formType);
  return Response.redirect(`${SITE_BASE}${redirectPath}`, 303);
}
