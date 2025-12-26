-- Migration: Replace Stripe with Razorpay
-- Run this after applying 001_initial_schema.sql

-- Option 1: If payments table is empty (recommended for fresh start)
-- Drop and recreate the payments table with Razorpay fields

DROP TABLE IF EXISTS payments;

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_order_id VARCHAR(255) NOT NULL,
  razorpay_payment_id VARCHAR(255) UNIQUE NOT NULL,
  amount_inr DECIMAL(10, 2) NOT NULL,
  product_type VARCHAR(50) NOT NULL, -- 'promotion_package'
  status VARCHAR(50) NOT NULL, -- 'succeeded', 'failed', 'pending'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id, created_at DESC);
CREATE INDEX idx_payments_razorpay ON payments(razorpay_payment_id);

-- Re-enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policy
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert payments (for server-side operations)
CREATE POLICY "Service can insert payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
