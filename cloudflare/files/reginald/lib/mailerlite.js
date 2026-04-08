/**
 * MailerLite API client for transactional notifications.
 * Adds subscribers to groups to trigger automations.
 *
 * Strategy: Worker adds buyer as subscriber with custom fields
 * (download_url, order_type, book_title). MailerLite automations
 * handle the actual email delivery based on group membership.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags mailerlite, email, notifications
 */

const MAILERLITE_API = 'https://connect.mailerlite.com/api';

/**
 * Make an authenticated request to MailerLite API.
 * @param {string} apiKey - MailerLite API key
 * @param {string} method - HTTP method
 * @param {string} endpoint - API path
 * @param {object} body - JSON body
 * @returns {Promise<object>}
 */
async function mailerliteRequest(apiKey, method, endpoint, body = null) {
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${MAILERLITE_API}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
        const msg = data.message || `MailerLite API error: ${response.status}`;
        throw new Error(msg);
    }

    return data;
}

/**
 * Notify about a book purchase by adding/updating a subscriber
 * with purchase details and assigning to the appropriate group.
 *
 * @param {string} apiKey - MailerLite API key
 * @param {object} options
 * @param {string} options.email - Buyer email
 * @param {string} options.name - Buyer name
 * @param {string} options.productType - "pdf" or "physical"
 * @param {string} options.bookTitle - Book title
 * @param {string} options.downloadUrl - Download link (PDF only)
 * @param {string} options.orderId - Stripe session ID
 * @param {object} options.shippingAddress - Shipping address (physical only)
 * @param {string} options.groupId - MailerLite group ID for this product type
 * @returns {Promise<object>}
 */
export async function notifyPurchase(apiKey, {
    email,
    name,
    productType,
    bookTitle,
    downloadUrl,
    orderId,
    shippingAddress,
    groupId,
}) {
    // Upsert subscriber with purchase fields.
    const subscriber = await mailerliteRequest(apiKey, 'POST', '/subscribers', {
        email,
        fields: {
            name: name || '',
            last_name: '',
            book_title: bookTitle,
            order_type: productType,
            download_url: downloadUrl || '',
            order_id: orderId,
            shipping_address: shippingAddress
                ? formatAddress(shippingAddress)
                : '',
        },
        groups: groupId ? [groupId] : [],
        status: 'active',
    });

    return subscriber;
}

/**
 * Format a Stripe shipping address for the MailerLite field.
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
