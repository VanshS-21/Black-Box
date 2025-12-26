import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Lazy-loaded model instance
let geminiModel: GenerativeModel | null = null;

/**
 * Get Gemini model instance with lazy initialization
 * This prevents server crashes if API key is missing at startup
 */
function getGeminiModel(): GenerativeModel {
    if (!geminiModel) {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GOOGLE_GEMINI_API_KEY is not configured. Please add it to your environment variables.');
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        // Gemini 2.5 Flash - latest model with excellent performance
        // Free tier: high throughput, optimized for reasoning tasks
        geminiModel = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
        });
    }
    return geminiModel;
}

/**
 * Wrap a promise with a timeout
 */
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

export interface StructuredDecision {
    title: string;
    decision_made: string;
    context: string;
    trade_offs: string;
    biggest_risk: string;
    stakeholders: string | null;
    confidence_level: number;
    tags: string[];
}

/**
 * Structure a raw decision input using AI
 */
export async function structureDecision(rawInput: string): Promise<StructuredDecision> {
    const model = getGeminiModel();

    const prompt = `You are extracting structured information from a professional's decision log.

Input: ${rawInput}

Extract the following in JSON format:
{
  "title": "A concise title (max 100 chars)",
  "decision_made": "What was decided (1-2 sentences)",
  "context": "The situation and constraints (2-3 sentences)",
  "trade_offs": "What was given up (2-3 sentences)",
  "biggest_risk": "The main risk accepted (1-2 sentences)",
  "stakeholders": "Who was involved (1 sentence, or null)",
  "confidence_level": 1-10 integer,
  "tags": ["tag1", "tag2", "tag3"] (max 5, lowercase)
}

Be concise. Preserve the user's technical terms and specifics. Return ONLY valid JSON, no markdown formatting.`;

    try {
        const result = await withTimeout(
            model.generateContent(prompt),
            30000,
            'AI request timed out. Please try again.'
        );
        const response = await result.response;
        const text = response.text();

        // Clean up response (remove markdown code blocks if present)
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        try {
            const parsed = JSON.parse(cleanedText);

            // Validate the response structure
            if (!parsed.title || !parsed.decision_made || !parsed.context) {
                throw new Error('Incomplete AI response');
            }

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
            };
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', cleanedText);
            throw new Error('Failed to structure decision. The AI response was not valid. Please try again.');
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while structuring your decision.');
    }
}

/**
 * Generate a promotion package from user's decisions
 */
export async function generatePromotionPackage(decisions: Array<{
    title: string;
    decision_made: string;
    context: string;
    trade_offs: string;
    biggest_risk: string;
    confidence_level: number | null;
    created_at: string;
}>): Promise<string> {
    const model = getGeminiModel();

    const decisionData = decisions.map((d, idx) => `
Decision ${idx + 1}:
Title: ${d.title}
What Was Decided: ${d.decision_made}
Context: ${d.context}
Trade-offs: ${d.trade_offs}
Risk: ${d.biggest_risk}
Confidence: ${d.confidence_level || 'N/A'}/10
Date: ${new Date(d.created_at).toLocaleDateString()}
  `).join('\n---\n');

    const prompt = `You are a career advisor analyzing a professional's decision-making history to create a promotion self-review.

Here are their ${decisions.length} decisions:

${decisionData}

Create a professional self-review document with these sections:

1. Executive Summary (2-3 sentences of their decision-making quality)
2. Decision-Making Patterns (What they're good at, backed by specific examples)
3. Growth & Learning (How they've improved over time)
4. Impact & Outcomes (Quantifiable wins from their decisions)
5. Risk Management (How they handle trade-offs and uncertainty)

Format: Professional but not corporate-speak. Use specific examples.
Length: 800-1200 words.
Tone: Confident, data-driven, promotion-ready.`;

    try {
        const result = await withTimeout(
            model.generateContent(prompt),
            60000, // Longer timeout for promotion package (more content)
            'AI request timed out while generating your promotion package. Please try again.'
        );
        const response = await result.response;
        return response.text();
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while generating your promotion package.');
    }
}
