import { describe, it, expect } from 'vitest';
import type { Decision, UserPreferences, AIGeneration, Payment } from '@/lib/supabase/client';

/**
 * Type tests for Supabase database types
 * These tests verify that our TypeScript interfaces match expected shapes
 */

describe('Supabase Database Types', () => {
    describe('Decision interface', () => {
        it('should have all required fields', () => {
            const decision: Decision = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                user_id: '123e4567-e89b-12d3-a456-426614174001',
                title: 'Test Decision',
                decision_made: 'We decided to do X',
                context: 'The context was Y',
                trade_offs: 'We traded off Z',
                biggest_risk: 'The biggest risk is W',
                created_at: '2024-12-28T00:00:00.000Z',
                updated_at: '2024-12-28T00:00:00.000Z',
                is_locked: false,
                ai_structured: false,
            };

            expect(decision.id).toBeDefined();
            expect(decision.user_id).toBeDefined();
            expect(decision.title).toBeDefined();
            expect(decision.decision_made).toBeDefined();
            expect(decision.context).toBeDefined();
            expect(decision.trade_offs).toBeDefined();
            expect(decision.biggest_risk).toBeDefined();
            expect(decision.created_at).toBeDefined();
            expect(decision.is_locked).toBe(false);
        });

        it('should accept optional fields', () => {
            const decision: Decision = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                user_id: '123e4567-e89b-12d3-a456-426614174001',
                title: 'Test Decision',
                decision_made: 'We decided to do X',
                context: 'The context was Y',
                trade_offs: 'We traded off Z',
                biggest_risk: 'The biggest risk is W',
                created_at: '2024-12-28T00:00:00.000Z',
                updated_at: '2024-12-28T00:00:00.000Z',
                is_locked: true,
                locked_at: '2024-12-28T00:00:00.000Z',
                ai_structured: true,
                stakeholders: 'Engineering team',
                confidence_level: 8,
                tags: ['architecture', 'decision'],
                original_input: 'Raw user input here',
            };

            expect(decision.stakeholders).toBe('Engineering team');
            expect(decision.confidence_level).toBe(8);
            expect(decision.tags).toHaveLength(2);
            expect(decision.original_input).toBeDefined();
            expect(decision.locked_at).toBeDefined();
        });
    });

    describe('UserPreferences interface', () => {
        it('should have required user_id', () => {
            const prefs: UserPreferences = {
                user_id: '123e4567-e89b-12d3-a456-426614174000',
                updated_at: '2024-12-28T00:00:00.000Z',
            };

            expect(prefs.user_id).toBeDefined();
            expect(prefs.updated_at).toBeDefined();
        });

        it('should accept optional current_role', () => {
            const prefs: UserPreferences = {
                user_id: '123e4567-e89b-12d3-a456-426614174000',
                current_role: 'Senior Engineer',
                updated_at: '2024-12-28T00:00:00.000Z',
            };

            expect(prefs.current_role).toBe('Senior Engineer');
        });
    });

    describe('AIGeneration interface', () => {
        it('should have required fields', () => {
            const generation: AIGeneration = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                user_id: '123e4567-e89b-12d3-a456-426614174001',
                generation_type: 'structure',
                created_at: '2024-12-28T00:00:00.000Z',
            };

            expect(generation.id).toBeDefined();
            expect(generation.user_id).toBeDefined();
            expect(generation.generation_type).toBe('structure');
        });

        it('should accept structure or promotion_package types', () => {
            const structureGen: AIGeneration = {
                id: '1',
                user_id: '2',
                generation_type: 'structure',
                created_at: '2024-12-28T00:00:00.000Z',
            };

            const promoGen: AIGeneration = {
                id: '1',
                user_id: '2',
                generation_type: 'promotion_package',
                created_at: '2024-12-28T00:00:00.000Z',
            };

            expect(structureGen.generation_type).toBe('structure');
            expect(promoGen.generation_type).toBe('promotion_package');
        });

        it('should accept optional token and cost fields', () => {
            const generation: AIGeneration = {
                id: '1',
                user_id: '2',
                generation_type: 'structure',
                input_tokens: 100,
                output_tokens: 500,
                cost_usd: 0.0001,
                created_at: '2024-12-28T00:00:00.000Z',
            };

            expect(generation.input_tokens).toBe(100);
            expect(generation.output_tokens).toBe(500);
            expect(generation.cost_usd).toBe(0.0001);
        });
    });

    describe('Payment interface', () => {
        it('should have all required fields', () => {
            const payment: Payment = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                user_id: '123e4567-e89b-12d3-a456-426614174001',
                razorpay_order_id: 'order_123456',
                razorpay_payment_id: 'pay_123456',
                amount_inr: 500,
                product_type: 'pro_monthly',
                status: 'succeeded',
                created_at: '2024-12-28T00:00:00.000Z',
            };

            expect(payment.id).toBeDefined();
            expect(payment.razorpay_order_id).toBe('order_123456');
            expect(payment.amount_inr).toBe(500);
        });

        it('should accept all valid status values', () => {
            const succeededPayment: Payment = {
                id: '1',
                user_id: '2',
                razorpay_order_id: 'order_1',
                razorpay_payment_id: 'pay_1',
                amount_inr: 500,
                product_type: 'pro',
                status: 'succeeded',
                created_at: '2024-12-28T00:00:00.000Z',
            };

            const failedPayment: Payment = {
                ...succeededPayment,
                status: 'failed',
            };

            const pendingPayment: Payment = {
                ...succeededPayment,
                status: 'pending',
            };

            expect(succeededPayment.status).toBe('succeeded');
            expect(failedPayment.status).toBe('failed');
            expect(pendingPayment.status).toBe('pending');
        });
    });
});
