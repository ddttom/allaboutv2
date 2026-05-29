/**
 * Lead-capture pure functions and Resend wrapper.
 *
 * Backs the two forms on mx.allabout.network:
 *   POST /api/v1/lead/pdf-check                  (lead magnet on /learn/mx-for-pdfs.html)
 *   POST /api/v1/lead/certified-operator-waitlist (waitlist on /services/certified-operator.html)
 *
 * Per the two-file testing rule, everything testable in Node is a pure
 * function (string -> string, object -> object). The only side-effectful
 * function is sendLeadCaptureEmails, which posts to the Resend API.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags lead-capture, forms, resend, mx-site
 */

const RESEND_API = 'https://api.resend.com/emails';

const VALID_FORM_TYPES = new Set([
  'pdf-check',
  'certified-operator-waitlist',
  'general-enquiry',
]);

// Service options for the general-enquiry form. The first option in the
// list ('mx-printworks') is the only one that routes to Scott; every other
// service routes to Tom. Keep this list in lockstep with the <select>
// options in mx-outputs/mx-site/about/contact.html.
const VALID_GENERAL_ENQUIRY_SERVICES = new Set([
  'mx-printworks',
  'mx-audit',
  'pdf-eaa',
  'reginald',
  'certification',
  'training',
  'other',
]);

const VALID_GENERAL_ENQUIRY_BUDGET = new Set([
  '',
  'exploring',
  'allocated',
  'business-case',
]);

const VALID_TIERS = new Set([
  'tier-1',
  'tier-2',
  'tier-3',
  'undecided',
]);

const VALID_VOCABULARIES = new Set([
  'wcag-2-2',
  'eu-ai-act-13',
  'both',
  'other',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 500;

const FORM_LABELS = {
  'pdf-check': 'Free PDF check request',
  'certified-operator-waitlist': 'Certified Operator waitlist signup',
  'general-enquiry': 'General enquiry',
};

const REDIRECT_TARGETS = {
  'pdf-check': '/learn/mx-for-pdfs.html?submitted=pdf-check#free-check',
  'certified-operator-waitlist': '/services/certified-operator.html?submitted=certified-operator-waitlist#joining',
  'general-enquiry': '/about/contact.html?submitted=general-enquiry#thanks',
};

/**
 * Route-by-service rule for the general-enquiry form. The MX Printworks
 * line routes to Scott (it sits on his operating remit); every other
 * service routes to Tom. Returns the env-var key to read for the admin
 * recipient, or null to let the caller fall back to the default.
 *
 * Pure function. Caller does the env lookup to keep this testable.
 */
export function chooseGeneralEnquiryAdminKey(service) {
  if (service === 'mx-printworks') return 'MX_PRINTWORKS_NOTIFY_EMAIL';
  return null;
}

/**
 * Validate a parsed submission payload.
 * Pure function. Returns { valid, error }.
 */
export function validateLeadCapture(formType, data) {
  if (!VALID_FORM_TYPES.has(formType)) {
    return { valid: false, error: 'Unknown form type.' };
  }

  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Missing submission payload.' };
  }

  // Consent checkbox is required for the lead-magnet and waitlist forms;
  // the general-enquiry form treats submission itself as B2B legitimate-
  // interest consent under GDPR (the form clearly identifies the
  // recipient and the purpose, and the submitter is initiating contact).
  if (formType !== 'general-enquiry') {
    const consent = data.consent === true
      || data.consent === 'true'
      || data.consent === 'yes'
      || data.consent === 'on';
    if (!consent) {
      return { valid: false, error: 'Consent is required.' };
    }
  }

  const email = typeof data.email === 'string' ? data.email.trim() : '';
  if (!EMAIL_RE.test(email)) {
    return { valid: false, error: 'A valid email address is required.' };
  }

  if (formType === 'pdf-check') {
    const url = typeof data.url === 'string' ? data.url.trim() : '';
    if (!url) {
      return { valid: false, error: 'A PDF URL is required.' };
    }
    if (!/^https?:\/\//i.test(url)) {
      return { valid: false, error: 'The PDF URL must start with http:// or https://.' };
    }
    if (url.length > MAX_FIELD_LENGTH) {
      return { valid: false, error: 'PDF URL is too long.' };
    }
  }

  if (formType === 'certified-operator-waitlist') {
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name) {
      return { valid: false, error: 'Your name is required.' };
    }
    const tier = typeof data.tier === 'string' ? data.tier.trim() : '';
    if (!VALID_TIERS.has(tier)) {
      return { valid: false, error: 'Please choose a tier.' };
    }
    const vocab = typeof data.vocabulary === 'string' ? data.vocabulary.trim() : '';
    if (!VALID_VOCABULARIES.has(vocab)) {
      return { valid: false, error: 'Please choose a predicate vocabulary.' };
    }
  }

  if (formType === 'general-enquiry') {
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name) {
      return { valid: false, error: 'Your name is required.' };
    }
    const company = typeof data.company === 'string' ? data.company.trim() : '';
    if (!company) {
      return { valid: false, error: 'Your company is required.' };
    }
    const service = typeof data.service === 'string' ? data.service.trim() : '';
    if (!VALID_GENERAL_ENQUIRY_SERVICES.has(service)) {
      return { valid: false, error: 'Please choose a service.' };
    }
    const message = typeof data.message === 'string' ? data.message.trim() : '';
    if (!message) {
      return { valid: false, error: 'Please tell us about your needs.' };
    }
    if (message.length > 4000) {
      return { valid: false, error: 'Message is too long; please keep it under 4000 characters.' };
    }
    const budget = typeof data.budget === 'string' ? data.budget.trim() : '';
    if (budget && !VALID_GENERAL_ENQUIRY_BUDGET.has(budget)) {
      return { valid: false, error: 'Budget value is not recognised.' };
    }
  }

  return { valid: true, error: '' };
}

/**
 * Sanitise a string for inclusion in HTML email bodies.
 * Pure function. Escapes the five HTML-significant characters.
 */
export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build the admin notification email (sent to Tom / FREE_BOOK_NOTIFY_EMAIL).
 * Pure function. Returns { subject, html }.
 */
export function buildAdminEmail(formType, data) {
  const label = FORM_LABELS[formType] || 'Lead capture';
  const email = escapeHtml(data.email);
  const name = escapeHtml(data.name || '');

  let rows = '';
  rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Form</td><td>${escapeHtml(formType)}</td></tr>`;
  rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>`;
  if (data.name) rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Name</td><td>${name}</td></tr>`;

  if (formType === 'pdf-check') {
    const url = escapeHtml(data.url);
    rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">PDF URL</td><td><a href="${url}">${url}</a></td></tr>`;
  }

  if (formType === 'certified-operator-waitlist') {
    if (data.organisation) rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Organisation</td><td>${escapeHtml(data.organisation)}</td></tr>`;
    rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Tier</td><td>${escapeHtml(data.tier)}</td></tr>`;
    rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Vocabulary</td><td>${escapeHtml(data.vocabulary)}</td></tr>`;
    if (data.note) rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Note</td><td>${escapeHtml(data.note)}</td></tr>`;
  }

  if (formType === 'general-enquiry') {
    if (data.company) rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Company</td><td>${escapeHtml(data.company)}</td></tr>`;
    if (data.phone) rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Phone</td><td>${escapeHtml(data.phone)}</td></tr>`;
    if (data.website) {
      const w = escapeHtml(data.website);
      rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Website</td><td><a href="${w}">${w}</a></td></tr>`;
    }
    rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Service</td><td>${escapeHtml(data.service)}</td></tr>`;
    if (data.budget) rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Budget</td><td>${escapeHtml(data.budget)}</td></tr>`;
    if (data.message) rows += `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top">Message</td><td style="white-space:pre-wrap">${escapeHtml(data.message)}</td></tr>`;
    if (data.service === 'mx-printworks') {
      rows += `<tr><td style="padding:4px 12px 4px 0;color:#c95000">Routing</td><td><strong>MX Printworks line → Scott</strong></td></tr>`;
    }
  }

  if (data.pageUrl) rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Submitted from</td><td>${escapeHtml(data.pageUrl)}</td></tr>`;
  if (data.referrer) rows += `<tr><td style="padding:4px 12px 4px 0;color:#555">Referrer</td><td>${escapeHtml(data.referrer)}</td></tr>`;

  const subject = `${label}: ${data.name ? `${data.name} <${data.email}>` : data.email}`;
  const html = `<p>A new ${escapeHtml(label.toLowerCase())} just landed on mx.allabout.network.</p>
<table style="border-collapse:collapse;font-size:0.95em;">
${rows}
</table>`;

  return { subject, html };
}

/**
 * Build the acknowledgement email (sent back to the submitter).
 * Pure function. Returns { subject, html }.
 */
export function buildAcknowledgementEmail(formType, data) {
  const name = escapeHtml(data.name || '');
  const greeting = name ? `Hello ${name},` : 'Hello,';

  if (formType === 'pdf-check') {
    const url = escapeHtml(data.url);
    return {
      subject: 'Your free MX-readiness check is queued',
      html: `<p>${greeting}</p>
<p>Thank you for submitting your PDF for a free MX-readiness check. We have queued the following URL for review:</p>
<p><a href="${url}">${url}</a></p>
<p>You will receive a written report within two working days, covering ISO 14289-1 tagged structure, MX metadata presence, AI-governance provenance, and explicit eligibility for the MX Compatible badge.</p>
<p>If you have any questions in the meantime, reply to this email or contact <a href="mailto:mx-printworks@cognovamx.com">mx-printworks@cognovamx.com</a>.</p>
<p>Best regards,<br>Tom Cranstoun<br>Digital Domain Technologies Ltd, trading as CogNovaMX</p>`,
    };
  }

  if (formType === 'certified-operator-waitlist') {
    return {
      subject: 'You are on the Certified Operator waitlist',
      html: `<p>${greeting}</p>
<p>Thank you for joining the waitlist for the CogNovaMX Accreditation Programme. We have noted your interest in <strong>${escapeHtml(data.tier)}</strong> for the <strong>${escapeHtml(data.vocabulary)}</strong> vocabulary.</p>
<p>Stage 1 admissions are opening shortly; we will contact you when applications open for your tier and vocabulary. Joining the waitlist is not an application and does not commit you to anything.</p>
<p>In the meantime, the public programme overview is at <a href="https://mx.allabout.network/services/certified-operator.html">mx.allabout.network/services/certified-operator.html</a>. Reply to this email if you have any questions.</p>
<p>Best regards,<br>Tom Cranstoun<br>Digital Domain Technologies Ltd, trading as CogNovaMX</p>`,
    };
  }

  if (formType === 'general-enquiry') {
    return {
      subject: 'We received your enquiry',
      html: `<p>${greeting}</p>
<p>Thank you for getting in touch with CogNovaMX. We have received your enquiry and will reply within two working days.</p>
<p>For reference, this is the message you submitted:</p>
<blockquote style="border-left:3px solid #2D7DD2;padding:0.5rem 1rem;margin:1rem 0;color:#444;white-space:pre-wrap">${escapeHtml(data.message || '')}</blockquote>
<p>If you need to add anything to the enquiry, reply to this email; it threads back to the right person.</p>
<p>Best regards,<br>Tom Cranstoun<br>Digital Domain Technologies Ltd, trading as CogNovaMX</p>`,
    };
  }

  return {
    subject: 'We received your message',
    html: `<p>${greeting}</p><p>Thank you for getting in touch. We will reply shortly.</p>`,
  };
}

/**
 * Compute the redirect target for a non-JS form submission.
 * Pure function. Returns a relative URL on mx.allabout.network.
 */
export function buildSuccessRedirectUrl(formType) {
  return REDIRECT_TARGETS[formType] || '/';
}

/**
 * Compute the JSON success response body.
 * Pure function. Returns { ok, message }.
 */
export function buildSuccessResponseBody(formType) {
  if (formType === 'pdf-check') {
    return {
      ok: true,
      message: 'Thank you. Your PDF is queued. You will receive the report within two working days.',
    };
  }
  if (formType === 'certified-operator-waitlist') {
    return {
      ok: true,
      message: 'Thank you. You are on the waitlist. We will be in touch when Stage 1 admissions open for your tier and vocabulary.',
    };
  }
  return { ok: true, message: 'Thank you. We received your submission.' };
}

/**
 * Send the admin notification + the submitter acknowledgement.
 * Side-effectful: posts twice to the Resend API.
 *
 * @param {string} apiKey - Resend API key
 * @param {object} options
 * @param {string} options.from - Sender address
 * @param {string} options.adminTo - Admin notification address
 * @param {string} options.formType - 'pdf-check' or 'certified-operator-waitlist'
 * @param {object} options.data - Submitted form data (already validated)
 * @returns {Promise<object>} { adminMessageId, acknowledgementMessageId }
 */
export async function sendLeadCaptureEmails(apiKey, { from, adminTo, formType, data }) {
  const admin = buildAdminEmail(formType, data);
  const ack = buildAcknowledgementEmail(formType, data);

  const adminResult = await postResend(apiKey, {
    from, to: adminTo, subject: admin.subject, html: admin.html, reply_to: data.email,
  });
  const ackResult = await postResend(apiKey, {
    from, to: data.email, subject: ack.subject, html: ack.html,
  });

  return {
    adminMessageId: adminResult && adminResult.id,
    acknowledgementMessageId: ackResult && ackResult.id,
  };
}

async function postResend(apiKey, body) {
  const response = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error((result && result.message) || `Resend API error: ${response.status}`);
  }
  return result;
}
