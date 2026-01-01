import { describe, it, expect } from 'vitest';
import {
    createDecisionSchema,
    updateDecisionSchema,
    rawInputSchema,
    searchParamsSchema,
} from '@/lib/validations/decision';

describe('createDecisionSchema', () => {
    const validDecision = {
        title: 'Test Decision Title',
        decision_made: 'We decided to implement feature X because of reason Y.',
        context: 'The team needed to address performance issues in the API.',
        trade_offs: 'We accepted higher memory usage in exchange for faster response times.',
        biggest_risk: 'The main risk is that memory usage might exceed limits during peak load.',
    };

    describe('valid inputs', () => {
        it('should pass with all required fields', () => {
            const result = createDecisionSchema.safeParse(validDecision);
            expect(result.success).toBe(true);
        });

        it('should pass with optional fields', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                stakeholders: 'Engineering team, Product manager',
                confidence_level: 8,
                tags: ['architecture', 'performance'],
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.tags).toEqual(['architecture', 'performance']);
                expect(result.data.confidence_level).toBe(8);
            }
        });

        it('should default source to web', () => {
            const result = createDecisionSchema.safeParse(validDecision);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.source).toBe('web');
            }
        });

        it('should accept all valid source types', () => {
            const sources = ['web', 'chrome_extension', 'slack', 'github'] as const;
            sources.forEach((source) => {
                const result = createDecisionSchema.safeParse({ ...validDecision, source });
                expect(result.success).toBe(true);
            });
        });
    });

    describe('title validation', () => {
        it('should reject empty title', () => {
            const result = createDecisionSchema.safeParse({ ...validDecision, title: '' });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Title is required');
            }
        });

        it('should reject title over 200 characters', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                title: 'a'.repeat(201),
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Title must be 200 characters or less');
            }
        });

        it('should accept title exactly 200 characters', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                title: 'a'.repeat(200),
            });
            expect(result.success).toBe(true);
        });
    });

    describe('required fields validation', () => {
        it('should reject decision_made under 10 characters', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                decision_made: 'Short',
            });
            expect(result.success).toBe(false);
        });

        it('should reject context under 10 characters', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                context: 'Short',
            });
            expect(result.success).toBe(false);
        });

        it('should reject trade_offs under 10 characters', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                trade_offs: 'Short',
            });
            expect(result.success).toBe(false);
        });

        it('should reject biggest_risk under 10 characters', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                biggest_risk: 'Short',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('confidence_level validation', () => {
        it('should accept confidence level 1', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                confidence_level: 1,
            });
            expect(result.success).toBe(true);
        });

        it('should accept confidence level 10', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                confidence_level: 10,
            });
            expect(result.success).toBe(true);
        });

        it('should reject confidence level below 1', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                confidence_level: 0,
            });
            expect(result.success).toBe(false);
        });

        it('should reject confidence level above 10', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                confidence_level: 11,
            });
            expect(result.success).toBe(false);
        });

        it('should reject non-integer confidence level', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                confidence_level: 5.5,
            });
            expect(result.success).toBe(false);
        });
    });

    describe('tags validation', () => {
        it('should accept up to 5 tags', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
            });
            expect(result.success).toBe(true);
        });

        it('should reject more than 5 tags', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'],
            });
            expect(result.success).toBe(false);
        });

        it('should reject tags over 50 characters', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                tags: ['a'.repeat(51)],
            });
            expect(result.success).toBe(false);
        });
    });

    describe('source_url validation', () => {
        it('should accept valid URLs', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                source_url: 'https://github.com/org/repo/pull/123',
            });
            expect(result.success).toBe(true);
        });

        it('should reject invalid URLs', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                source_url: 'not-a-valid-url',
            });
            expect(result.success).toBe(false);
        });

        it('should accept null source_url', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                source_url: null,
            });
            expect(result.success).toBe(true);
        });
    });

    describe('team_id validation', () => {
        it('should accept valid UUID', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                team_id: '123e4567-e89b-12d3-a456-426614174000',
            });
            expect(result.success).toBe(true);
        });

        it('should reject invalid UUID', () => {
            const result = createDecisionSchema.safeParse({
                ...validDecision,
                team_id: 'not-a-uuid',
            });
            expect(result.success).toBe(false);
        });
    });
});

describe('updateDecisionSchema', () => {
    it('should allow partial updates', () => {
        const result = updateDecisionSchema.safeParse({
            title: 'Updated Title',
        });
        expect(result.success).toBe(true);
    });

    it('should still validate field constraints', () => {
        const result = updateDecisionSchema.safeParse({
            title: '', // Empty title should fail
        });
        expect(result.success).toBe(false);
    });
});

describe('rawInputSchema', () => {
    it('should accept input with at least 50 characters', () => {
        const result = rawInputSchema.safeParse({
            rawInput: 'a'.repeat(50),
        });
        expect(result.success).toBe(true);
    });

    it('should reject input under 50 characters', () => {
        const result = rawInputSchema.safeParse({
            rawInput: 'a'.repeat(49),
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('at least 50 characters');
        }
    });

    it('should reject input over 10000 characters', () => {
        const result = rawInputSchema.safeParse({
            rawInput: 'a'.repeat(10001),
        });
        expect(result.success).toBe(false);
    });
});

describe('searchParamsSchema', () => {
    it('should default to empty strings', () => {
        const result = searchParamsSchema.safeParse({});
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.search).toBe('');
            expect(result.data.tags).toBe('');
        }
    });

    it('should reject search over 200 characters', () => {
        const result = searchParamsSchema.safeParse({
            search: 'a'.repeat(201),
        });
        expect(result.success).toBe(false);
    });
});
