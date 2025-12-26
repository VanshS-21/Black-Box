import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Decision {
    id: string;
    user_id: string;
    title: string;
    decision_made: string;
    context: string;
    trade_offs: string;
    biggest_risk: string;
    stakeholders?: string;
    confidence_level?: number;
    tags?: string[];
    created_at: string;
    updated_at: string;
    is_locked: boolean;
    locked_at?: string;
    original_input?: string;
    ai_structured: boolean;
}

export interface UserPreferences {
    user_id: string;
    current_role?: string;
    updated_at: string;
}

export interface AIGeneration {
    id: string;
    user_id: string;
    generation_type: 'structure' | 'promotion_package';
    input_tokens?: number;
    output_tokens?: number;
    cost_usd?: number;
    created_at: string;
}

export interface Payment {
    id: string;
    user_id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    amount_inr: number;
    product_type: string;
    status: 'succeeded' | 'failed' | 'pending';
    created_at: string;
}
