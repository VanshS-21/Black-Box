import { z } from 'zod';

// Decision creation/update validation
export const createDecisionSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(200, 'Title must be 200 characters or less'),
    decision_made: z.string()
        .min(10, 'Decision must be at least 10 characters')
        .max(5000, 'Decision must be 5000 characters or less'),
    context: z.string()
        .min(10, 'Context must be at least 10 characters')
        .max(5000, 'Context must be 5000 characters or less'),
    trade_offs: z.string()
        .min(10, 'Trade-offs must be at least 10 characters')
        .max(5000, 'Trade-offs must be 5000 characters or less'),
    biggest_risk: z.string()
        .min(10, 'Biggest risk must be at least 10 characters')
        .max(5000, 'Biggest risk must be 5000 characters or less'),
    stakeholders: z.string()
        .max(500, 'Stakeholders must be 500 characters or less')
        .nullable()
        .optional(),
    confidence_level: z.number()
        .int('Confidence level must be an integer')
        .min(1, 'Confidence level must be at least 1')
        .max(10, 'Confidence level must be 10 or less')
        .nullable()
        .optional(),
    tags: z.array(
        z.string().max(50, 'Each tag must be 50 characters or less')
    )
        .max(5, 'Maximum 5 tags allowed')
        .optional()
        .default([]),
    original_input: z.string()
        .max(10000, 'Original input must be 10000 characters or less')
        .nullable()
        .optional(),
    ai_structured: z.boolean().optional().default(false),
    // Source tracking for Chrome Extension and future integrations
    source: z.enum(['web', 'chrome_extension', 'slack', 'github'])
        .optional()
        .default('web'),
    source_url: z.string()
        .url('Invalid URL')
        .max(2000, 'URL must be 2000 characters or less')
        .nullable()
        .optional(),
    // Team visibility - optional team ID to share decision with
    team_id: z.string()
        .uuid('Invalid team ID')
        .nullable()
        .optional(),
});

// AI structure input validation
export const rawInputSchema = z.object({
    rawInput: z.string()
        .min(50, 'Please provide at least 50 characters to help the AI understand your decision')
        .max(10000, 'Input must be 10000 characters or less'),
});

// Update decision validation (all fields optional except what's being updated)
export const updateDecisionSchema = createDecisionSchema.partial();

// Search params validation
export const searchParamsSchema = z.object({
    search: z.string().max(200).optional().default(''),
    tags: z.string().optional().default(''),
});

// Inferred types for use in TypeScript
export type CreateDecisionInput = z.infer<typeof createDecisionSchema>;
export type UpdateDecisionInput = z.infer<typeof updateDecisionSchema>;
export type RawInputData = z.infer<typeof rawInputSchema>;
