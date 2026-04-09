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

// Worldwide shipping zones for the physical_world product.
const WORLD_SHIPPING_COUNTRIES = [
    'GB', 'US', 'CA', 'AU', 'NZ', 'IE', 'DE', 'FR', 'NL', 'BE',
    'AT', 'CH', 'SE', 'DK', 'NO', 'FI', 'ES', 'IT', 'PT',
];

const VALID_PRODUCTS = {
    pdf: {
        envKey: 'STRIPE_HANDBOOK_PDF_PRICE_ID',
        shippingCountries: null,
    },
    physical_uk: {
        envKey: 'STRIPE_HANDBOOK_PHYSICAL_UK_PRICE_ID',
        shippingCountries: ['GB'],
    },
    physical_world: {
        envKey: 'STRIPE_HANDBOOK_PHYSICAL_WORLD_PRICE_ID',
        shippingCountries: WORLD_SHIPPING_COUNTRIES,
    },
};

/**
 * Handle POST /api/v1/books/checkout
 * Creates a Stripe Checkout session for a handbook purchase.
 *
 * Body: { product: "pdf" | "physical_uk" | "physical_world", email? }
 *   pdf            — instant download, no shipping
 *   physical_uk    — printed copy, UK-only shipping
 *   physical_world — printed copy, worldwide shipping
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
        return error('product must be "pdf", "physical_uk", or "physical_world"', 400);
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
