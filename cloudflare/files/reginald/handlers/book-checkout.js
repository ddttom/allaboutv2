/**
 * Book checkout handler — creates Stripe Checkout session for one-time book purchase.
 *
 * @mx:status active
 * @mx:contentType script
 * @mx:tags stripe, checkout, books, handbook
 */

import { json, error } from '../lib/responses.js';
import { createBookCheckoutSession } from '../stripe/client.js';
import * as audit from '../db/audit.js';

// The PDF is the only edition sold. The printed edition is promotional stock
// handed out at conferences and in person (decision record
// 2026-11-02-printed-handbook-stock-is-promotional); its former product ids
// (physical_uk, physical_world) are refused here with a plain message, while
// the webhook still completes any checkout session opened before the change.
const VALID_PRODUCTS = {
    pdf: {
        envKey: 'STRIPE_HANDBOOK_PDF_PRICE_ID',
        shippingCountries: null,
    },
};
const RETIRED_PRODUCTS = new Set(['physical_uk', 'physical_world']);

/**
 * Handle POST /api/v1/books/checkout
 * Creates a Stripe Checkout session for a handbook purchase.
 *
 * Body: { product: "pdf", email? }
 *   pdf — instant download, no shipping. The printed edition is not sold.
 */
export async function handleBookCheckout(request, env) {
    let body;
    try {
        body = await request.json();
    } catch {
        return error('Invalid JSON body', 400);
    }

    const product = body.product;
    if (RETIRED_PRODUCTS.has(product)) {
        return error('The printed edition is not sold online; copies are handed out at conferences. Choose "pdf".', 410);
    }
    if (!product || !VALID_PRODUCTS[product]) {
        return error('product must be "pdf"', 400);
    }

    const config = VALID_PRODUCTS[product];
    const priceId = env[config.envKey];

    if (!priceId || priceId === 'placeholder-set-in-dashboard') {
        return error('Product not yet configured', 503);
    }

    const baseUrl = 'https://mx.allabout.network';
    const successUrl = `https://reginald.allabout.network/api/v1/books/checkout/success?product=${product}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/books/handbook.html`;

    try {
        const session = await createBookCheckoutSession(env.STRIPE_SECRET_KEY, {
            priceId,
            email: body.email || null,
            bookId: 'handbook',
            productType: product,
            successUrl,
            cancelUrl,
            shippingCountries: config.shippingCountries,
        });

        await audit.log(env.DB, null, 'book_checkout_created', {
            product,
            email: body.email || null,
            session_id: session.id,
        });

        return json({
            checkout_url: session.url,
            session_id: session.id,
        });
    } catch (e) {
        return error(`Stripe error: ${e.message}`, 502);
    }
}
