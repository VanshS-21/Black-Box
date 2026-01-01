import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Tests for AI response parsing logic extracted from gemini.ts
 * These tests don't call the actual Gemini API but verify the parsing/normalization logic
 */

// Helper function that mirrors the parsing logic in structureDecision
function parseAIResponse(text: string) {
    // Clean up response (remove markdown code blocks if present)
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    // Validate the response structure
    if (!parsed.title || !parsed.decision_made || !parsed.context) {
        throw new Error('Incomplete AI response');
    }

    // Ensure coaching object exists with defaults
    const coaching = parsed.coaching || {};

    return {
        title: String(parsed.title).slice(0, 200),
        decision_made: String(parsed.decision_made),
        context: String(parsed.context),
        trade_offs: String(parsed.trade_offs || ''),
        biggest_risk: String(parsed.biggest_risk || ''),
        stakeholders: parsed.stakeholders ? String(parsed.stakeholders) : null,
        confidence_level: Math.min(10, Math.max(1, Number(parsed.confidence_level) || 5)),
        tags: Array.isArray(parsed.tags)
            ? parsed.tags.slice(0, 5).map((t: unknown) => String(t).toLowerCase().slice(0, 50))
            : [],
        coaching: {
            impact_reframe: String(coaching.impact_reframe || parsed.decision_made),
            weak_phrases: Array.isArray(coaching.weak_phrases)
                ? coaching.weak_phrases.slice(0, 5).map((p: unknown) => String(p))
                : [],
            power_phrases: Array.isArray(coaching.power_phrases)
                ? coaching.power_phrases.slice(0, 5).map((p: unknown) => String(p))
                : [],
            promotion_readiness: Math.min(10, Math.max(1, Number(coaching.promotion_readiness) || 5)),
            coaching_tip: String(coaching.coaching_tip || 'Add specific metrics to strengthen your impact.'),
        },
    };
}

// Helper function for quick reframe parsing
function parseQuickReframeResponse(text: string, original: string) {
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    return {
        original,
        reframed: String(parsed.reframed || original),
        weak_phrases: Array.isArray(parsed.weak_phrases)
            ? parsed.weak_phrases.slice(0, 3).map((p: unknown) => String(p))
            : [],
        power_phrases: Array.isArray(parsed.power_phrases)
            ? parsed.power_phrases.slice(0, 3).map((p: unknown) => String(p))
            : [],
        tip: String(parsed.tip || 'Add specific metrics to strengthen your impact.'),
    };
}

describe('AI Response Parsing', () => {
    describe('parseAIResponse', () => {
        const validAIResponse = JSON.stringify({
            title: 'Implemented Caching Layer',
            decision_made: 'Added Redis caching to reduce database load',
            context: 'Database queries were causing high latency',
            trade_offs: 'Increased infrastructure complexity',
            biggest_risk: 'Cache invalidation bugs',
            stakeholders: 'Backend team',
            confidence_level: 8,
            tags: ['architecture', 'performance', 'Redis'],
            coaching: {
                impact_reframe: 'Reduced API latency by 60% through strategic caching implementation',
                weak_phrases: ['added caching'],
                power_phrases: ['reduced latency by 60%'],
                promotion_readiness: 7,
                coaching_tip: 'Quantify the impact on user experience.',
            },
        });

        it('should parse valid JSON response', () => {
            const result = parseAIResponse(validAIResponse);
            expect(result.title).toBe('Implemented Caching Layer');
            expect(result.decision_made).toBe('Added Redis caching to reduce database load');
            expect(result.confidence_level).toBe(8);
            expect(result.tags).toEqual(['architecture', 'performance', 'redis']);
        });

        it('should remove markdown code blocks', () => {
            const wrappedResponse = '```json\n' + validAIResponse + '\n```';
            const result = parseAIResponse(wrappedResponse);
            expect(result.title).toBe('Implemented Caching Layer');
        });

        it('should handle code blocks without json label', () => {
            const wrappedResponse = '```\n' + validAIResponse + '\n```';
            const result = parseAIResponse(wrappedResponse);
            expect(result.title).toBe('Implemented Caching Layer');
        });

        it('should truncate title to 200 characters', () => {
            const longTitle = 'a'.repeat(250);
            const response = JSON.stringify({
                title: longTitle,
                decision_made: 'Test decision',
                context: 'Test context',
            });
            const result = parseAIResponse(response);
            expect(result.title.length).toBe(200);
        });

        it('should lowercase and limit tags to 5', () => {
            const response = JSON.stringify({
                title: 'Test',
                decision_made: 'Test decision',
                context: 'Test context',
                tags: ['TAG1', 'TAG2', 'TAG3', 'TAG4', 'TAG5', 'TAG6', 'TAG7'],
            });
            const result = parseAIResponse(response);
            expect(result.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4', 'tag5']);
        });

        it('should clamp confidence_level to 1-10 range', () => {
            const lowResponse = JSON.stringify({
                title: 'Test',
                decision_made: 'Test decision',
                context: 'Test context',
                confidence_level: -5,
            });
            expect(parseAIResponse(lowResponse).confidence_level).toBe(1);

            const highResponse = JSON.stringify({
                title: 'Test',
                decision_made: 'Test decision',
                context: 'Test context',
                confidence_level: 15,
            });
            expect(parseAIResponse(highResponse).confidence_level).toBe(10);
        });

        it('should default confidence_level to 5 if invalid', () => {
            const response = JSON.stringify({
                title: 'Test',
                decision_made: 'Test decision',
                context: 'Test context',
                confidence_level: 'not a number',
            });
            const result = parseAIResponse(response);
            expect(result.confidence_level).toBe(5);
        });

        it('should provide default coaching values when missing', () => {
            const response = JSON.stringify({
                title: 'Test',
                decision_made: 'Test decision',
                context: 'Test context',
            });
            const result = parseAIResponse(response);
            expect(result.coaching.impact_reframe).toBe('Test decision');
            expect(result.coaching.weak_phrases).toEqual([]);
            expect(result.coaching.power_phrases).toEqual([]);
            expect(result.coaching.promotion_readiness).toBe(5);
            expect(result.coaching.coaching_tip).toBe('Add specific metrics to strengthen your impact.');
        });

        it('should throw error for incomplete response', () => {
            const incompleteResponse = JSON.stringify({
                title: 'Test',
                // missing decision_made and context
            });
            expect(() => parseAIResponse(incompleteResponse)).toThrow('Incomplete AI response');
        });

        it('should throw error for invalid JSON', () => {
            expect(() => parseAIResponse('not valid json')).toThrow();
        });

        it('should handle null stakeholders', () => {
            const response = JSON.stringify({
                title: 'Test',
                decision_made: 'Test decision',
                context: 'Test context',
                stakeholders: null,
            });
            const result = parseAIResponse(response);
            expect(result.stakeholders).toBeNull();
        });

        it('should convert stakeholders to string if present', () => {
            const response = JSON.stringify({
                title: 'Test',
                decision_made: 'Test decision',
                context: 'Test context',
                stakeholders: 123, // Number should be converted to string
            });
            const result = parseAIResponse(response);
            expect(result.stakeholders).toBe('123');
        });
    });

    describe('parseQuickReframeResponse', () => {
        const original = 'Fixed a bug in the checkout flow';
        const validResponse = JSON.stringify({
            reframed: 'Eliminated checkout failures affecting 2,000+ daily users',
            weak_phrases: ['fixed a bug'],
            power_phrases: ['eliminated checkout failures'],
            tip: 'Add revenue impact metrics.',
        });

        it('should parse valid response', () => {
            const result = parseQuickReframeResponse(validResponse, original);
            expect(result.original).toBe(original);
            expect(result.reframed).toBe('Eliminated checkout failures affecting 2,000+ daily users');
            expect(result.weak_phrases).toEqual(['fixed a bug']);
            expect(result.power_phrases).toEqual(['eliminated checkout failures']);
            expect(result.tip).toBe('Add revenue impact metrics.');
        });

        it('should limit phrases to 3', () => {
            const response = JSON.stringify({
                reframed: 'Test',
                weak_phrases: ['a', 'b', 'c', 'd', 'e'],
                power_phrases: ['1', '2', '3', '4', '5'],
                tip: 'Test tip',
            });
            const result = parseQuickReframeResponse(response, original);
            expect(result.weak_phrases.length).toBe(3);
            expect(result.power_phrases.length).toBe(3);
        });

        it('should fallback to original text if reframed missing', () => {
            const response = JSON.stringify({
                tip: 'Test tip',
            });
            const result = parseQuickReframeResponse(response, original);
            expect(result.reframed).toBe(original);
        });

        it('should provide default tip if missing', () => {
            const response = JSON.stringify({
                reframed: 'Test reframed',
            });
            const result = parseQuickReframeResponse(response, original);
            expect(result.tip).toBe('Add specific metrics to strengthen your impact.');
        });

        it('should remove markdown code blocks', () => {
            const wrappedResponse = '```json\n' + validResponse + '\n```';
            const result = parseQuickReframeResponse(wrappedResponse, original);
            expect(result.reframed).toBe('Eliminated checkout failures affecting 2,000+ daily users');
        });
    });
});

describe('withTimeout helper', () => {
    // Simulating the timeout wrapper logic
    async function withTimeout<T>(
        promise: Promise<T>,
        timeoutMs: number = 30000,
        errorMessage: string = 'Request timed out'
    ): Promise<T> {
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
        );
        return Promise.race([promise, timeoutPromise]);
    }

    it('should return result if promise resolves before timeout', async () => {
        const fastPromise = Promise.resolve('success');
        const result = await withTimeout(fastPromise, 1000);
        expect(result).toBe('success');
    });

    it('should throw if promise takes longer than timeout', async () => {
        const slowPromise = new Promise((resolve) => setTimeout(resolve, 200));
        await expect(withTimeout(slowPromise, 50, 'Custom timeout message'))
            .rejects.toThrow('Custom timeout message');
    });

    it('should propagate errors from the original promise', async () => {
        const failingPromise = Promise.reject(new Error('Original error'));
        await expect(withTimeout(failingPromise, 1000)).rejects.toThrow('Original error');
    });
});
