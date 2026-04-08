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

const VALID_PRODUCTS = {
    pdf: {
        envKey: 'STRIPE_HANDBOOK_PDF_PRICE_ID',
        shippingRequired: false,
    },
    physical: {
        envKey: 'STRIPE_HANDBOOK_PHYSICAL_PRICE_ID',
        shippingRequired: true,
    },
};

/**
 * Handle POST /api/v1/books/checkout
 * Creates a Stripe Checkout session for a handbook purchase.
 *
 * Body: { product: "pdf" | "physical", email? }
 */
export async function handleBookCheckout(request, env) {
    let body;
    try {
        body = await request.json();
    } catch {
        return error('Invalid JSON body', 400);
    }

    const product = body.product;
    if (!product || !VALID_PRODUCTS[product]) {
        return error('product must be "pdf" or "physical"', 400);
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
            shippingRequired: config.shippingRequired,
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
