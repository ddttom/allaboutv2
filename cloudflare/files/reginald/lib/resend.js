/**
 * Resend API client for transactional purchase emails.
 * Sends emails directly — no groups, automations, or subscriber management.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags resend, email, notifications, transactional
 */

const RESEND_API = 'https://api.resend.com/emails';

/**
 * Send a purchase notification email via Resend.
 *
 * @param {string} apiKey - Resend API key
 * @param {object} options
 * @param {string} options.from - Sender address (e.g. "CogNovaMX <info@cognovamx.com>")
 * @param {string} options.email - Buyer email
 * @param {string} options.name - Buyer name
 * @param {string} options.productType - "pdf", "physical_uk", or "physical_world"
 * @param {string} options.bookTitle - Book title
 * @param {string} options.downloadUrl - Download link (PDF only)
 * @param {string} options.orderId - Stripe session ID
 * @param {object|null} options.shippingAddress - Shipping address object (physical only)
 * @param {string|string[]} [options.bcc] - BCC address(es) for printworks/supplier notifications
 * @returns {Promise<object>} Resend API response
 */
export async function sendPurchaseEmail(apiKey, {
    from,
    email,
    name,
    productType,
    bookTitle,
    downloadUrl,
    orderId,
    shippingAddress,
    bcc,
}) {
    const isPdf = productType === 'pdf';
    const subject = isPdf
        ? `${bookTitle} — your download is ready`
        : `${bookTitle} — your printed copy is on its way`;

    const html = isPdf
        ? pdfEmailHtml({ name, bookTitle, downloadUrl, orderId })
        : physicalEmailHtml({ name, bookTitle, shippingAddress, orderId });

    const body = {
        from,
        to: email,
        subject,
        html,
    };

    if (bcc) {
        body.bcc = bcc;
    }

    const response = await fetch(RESEND_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        const msg = data.message || `Resend API error: ${response.status}`;
        throw new Error(msg);
    }

    return data;
}

/**
 * Build HTML for a PDF purchase confirmation email.
 */
function pdfEmailHtml({ name, bookTitle, downloadUrl, orderId }) {
    const greeting = name ? `Hello ${name},` : 'Hello,';
    return `
<h2>Thank you for purchasing ${bookTitle}</h2>
<p>${greeting}</p>
<p>Your PDF is ready to download:</p>
<p><a href="${downloadUrl}" style="display:inline-block;padding:12px 24px;background:#035fe6;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">Download Your PDF</a></p>
<p>This link is valid for 4 downloads over 14 days. If you have any trouble, reply to this email.</p>
<p style="color:#666;font-size:0.9em;">Order reference: ${orderId}</p>
<p>Best regards,<br>Tom Cranstoun<br>Digital Domain Technologies Ltd, trading as CogNovaMX</p>
`.trim();
}

/**
 * Build HTML for a physical purchase confirmation email.
 */
function physicalEmailHtml({ name, bookTitle, shippingAddress, orderId }) {
    const greeting = name ? `Hello ${name},` : 'Hello,';
    const addressStr = shippingAddress ? formatAddress(shippingAddress) : 'your provided address';
    return `
<h2>Thank you for purchasing ${bookTitle}</h2>
<p>${greeting}</p>
<p>Your printed copy of <strong>${bookTitle}</strong> will be dispatched to:</p>
<p><strong>${addressStr}</strong></p>
<p>You should receive your copy within 5–10 working days. We'll let you know if there are any issues.</p>
<p>If you have any questions about your order, reply to this email or contact us at <a href="mailto:info@cognovamx.com">info@cognovamx.com</a>.</p>
<p style="color:#666;font-size:0.9em;">Order reference: ${orderId}</p>
<p>Best regards,<br>Tom Cranstoun<br>Digital Domain Technologies Ltd, trading as CogNovaMX</p>
`.trim();
}

/**
 * Send a brief admin notification when a free book is downloaded.
 *
 * @param {string} apiKey - Resend API key
 * @param {object} options
 * @param {string} options.from - Sender address
 * @param {string} options.to - Admin notification address
 * @param {string} options.email - Downloader email
 * @param {string} options.name - Downloader name (may be empty)
 * @returns {Promise<object>} Resend API response
 */
export async function sendFreeBookNotification(apiKey, { from, to, email, name }) {
    const subject = `Free book download: ${name ? `${name} <${email}>` : email}`;
    const html = `<p>Someone just downloaded <strong>MX: The Introduction</strong>.</p>
<table style="border-collapse:collapse;font-size:0.95em;">
  <tr><td style="padding:4px 12px 4px 0;color:#555">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
  <tr><td style="padding:4px 12px 4px 0;color:#555">Name</td><td>${name || '<em>not provided</em>'}</td></tr>
</table>
<p style="color:#666;font-size:0.9em;margin-top:1em">Added to MailerLite &ldquo;Free Book Downloads&rdquo; group.</p>`;

    const response = await fetch(RESEND_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ from, to, subject, html }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `Resend API error: ${response.status}`);
    }
    return data;
}

/**
 * Format a Stripe shipping address object to a readable string.
 * @param {object} address
 * @returns {string}
 */
function formatAddress(address) {
    const parts = [
        address.name,
        address.line1,
        address.line2,
        address.city,
        address.state,
        address.postal_code,
        address.country,
    ].filter(Boolean);
    return parts.join(', ');
}
