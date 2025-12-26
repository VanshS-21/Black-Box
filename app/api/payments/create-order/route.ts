import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createOrder, PRODUCTS } from '@/lib/payments/razorpay';
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * Create a Razorpay order for the promotion package
 * POST /api/payments/create-order
 */
export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting
        const rateLimit = checkRateLimit(
            getRateLimitKey(user.id, 'payments:create'),
            RATE_LIMITS.api.limit,
            RATE_LIMITS.api.windowMs
        );

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Create Razorpay order
        const product = PRODUCTS.PROMOTION_PACKAGE;
        const order = await createOrder({
            amount: product.amount,
            currency: product.currency,
            receipt: `user_${user.id}_${Date.now()}`,
            notes: {
                user_id: user.id,
                product_id: product.id,
                user_email: user.email || '',
            },
        });

        return NextResponse.json({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID,
            product: {
                name: product.name,
                description: product.description,
            },
        });
    } catch (error: unknown) {
        console.error('Error creating Razorpay order:', error);
        const message = error instanceof Error ? error.message : 'Failed to create order';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
