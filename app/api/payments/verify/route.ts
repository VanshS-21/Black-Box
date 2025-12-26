import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPaymentSignature, PRODUCTS } from '@/lib/payments/razorpay';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/upstash-rate-limit';
import { z } from 'zod';

const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string().min(1, 'Order ID is required'),
    razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
    razorpay_signature: z.string().min(1, 'Signature is required'),
});

/**
 * Verify Razorpay payment and record in database
 * POST /api/payments/verify
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting
        const rateLimit = await checkRateLimit(user.id, 'payments');

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429, headers: getRateLimitHeaders(rateLimit) }
            );
        }

        const body = await request.json();
        const validatedData = verifyPaymentSchema.parse(body);

        // Verify signature
        const isValid = verifyPaymentSignature({
            orderId: validatedData.razorpay_order_id,
            paymentId: validatedData.razorpay_payment_id,
            signature: validatedData.razorpay_signature,
        });

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature. Payment could not be verified.' },
                { status: 400 }
            );
        }

        // Record payment in database
        const product = PRODUCTS.PROMOTION_PACKAGE;
        const { error: insertError } = await supabase
            .from('payments')
            .insert({
                user_id: user.id,
                razorpay_order_id: validatedData.razorpay_order_id,
                razorpay_payment_id: validatedData.razorpay_payment_id,
                amount_inr: product.amount / 100, // Convert paise to rupees
                product_type: product.id,
                status: 'succeeded',
            });

        if (insertError) {
            console.error('Error recording payment:', insertError);
            // Payment was successful even if recording fails
            // Log this for manual reconciliation
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            payment_id: validatedData.razorpay_payment_id,
        });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            return NextResponse.json(
                { error: firstError?.message || 'Validation error' },
                { status: 400 }
            );
        }

        console.error('Error verifying payment:', error);
        const message = error instanceof Error ? error.message : 'Failed to verify payment';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
