import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy-loaded Razorpay instance
let razorpayInstance: Razorpay | null = null;

/**
 * Get Razorpay instance with lazy initialization
 * This prevents server crashes if API keys are missing at startup
 */
export function getRazorpayInstance(): Razorpay {
    if (!razorpayInstance) {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            throw new Error(
                'Razorpay credentials not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment variables.'
            );
        }

        razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    }
    return razorpayInstance;
}

/**
 * Create a Razorpay order
 */
export async function createOrder(options: {
    amount: number; // Amount in paise (e.g., 50000 for ₹500)
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
}): Promise<{
    id: string;
    amount: number;
    currency: string;
    receipt: string | null;
}> {
    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
        amount: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt || `receipt_${Date.now()}`,
        notes: options.notes || {},
    });

    return {
        id: order.id,
        amount: order.amount as number,
        currency: order.currency,
        receipt: order.receipt || null,
    };
}

/**
 * Verify Razorpay payment signature
 * This is critical for ensuring payment authenticity
 */
export function verifyPaymentSignature(options: {
    orderId: string;
    paymentId: string;
    signature: string;
}): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
        throw new Error('RAZORPAY_KEY_SECRET not configured');
    }

    const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${options.orderId}|${options.paymentId}`)
        .digest('hex');

    return expectedSignature === options.signature;
}

/**
 * Product pricing configuration
 */
export const PRODUCTS = {
    PROMOTION_PACKAGE: {
        id: 'promotion_package',
        name: 'AI Promotion Package',
        amount: 50000, // ₹500 in paise
        currency: 'INR',
        description: 'AI-generated promotion self-review document',
    },
} as const;
