/**
 * Decision Templates for common decision types
 * These templates help engineers quickly log decisions with structured fields
 */

export interface DecisionTemplate {
    id: string;
    name: string;
    description: string;
    icon: string; // Lucide icon name
    fields: {
        title: string;
        context: string;
        decision_made: string;
        trade_offs?: string;
        biggest_risk?: string;
        stakeholders?: string;
        tags: string[];
    };
}

export const DECISION_TEMPLATES: DecisionTemplate[] = [
    {
        id: 'adr',
        name: 'Architecture Decision Record (ADR)',
        description: 'Document a significant architectural choice',
        icon: 'Box',
        fields: {
            title: 'ADR: [Technology/Architecture Choice]',
            context: `## Context
What is the situation that requires a decision? What are the constraints?

## Options Considered
1. Option A:
2. Option B:
3. Option C:`,
            decision_made: `We decided to go with [Option X] because:
- Reason 1
- Reason 2`,
            trade_offs: `## Accepted Trade-offs
- Trade-off 1 (we're okay with this because...)
- Trade-off 2

## Rejected alternatives
- Option Y was rejected because...`,
            biggest_risk: 'The main risk is... We mitigate this by...',
            stakeholders: 'Engineering, Product, DevOps',
            tags: ['architecture', 'adr'],
        },
    },
    {
        id: 'tech-debt',
        name: 'Tech Debt Decision',
        description: 'Log intentional technical debt with context',
        icon: 'AlertTriangle',
        fields: {
            title: 'Tech Debt: [What we deferred]',
            context: `## What we're deferring
Describe the ideal implementation we're postponing

## Why now isn't the right time
- Time constraints
- Priority trade-offs
- Dependencies not ready`,
            decision_made: `We're taking on this debt consciously:
- Shortcut: [What we're doing instead]
- Timeline: Plan to address by [date/milestone]`,
            trade_offs: `## Impact of this debt
- Maintenance burden: [Low/Medium/High]
- Performance impact: [Yes/No]
- Future work affected: [List]`,
            biggest_risk: 'If we don\'t address this by [milestone], we risk...',
            stakeholders: 'Engineering',
            tags: ['tech-debt', 'shortcut'],
        },
    },
    {
        id: 'feature-tradeoff',
        name: 'Feature Trade-off',
        description: 'Document a product/engineering trade-off',
        icon: 'Scale',
        fields: {
            title: 'Trade-off: [Feature/Scope Decision]',
            context: `## Feature goal
What we're trying to achieve

## Constraints
- Timeline: 
- Resources:
- Dependencies:`,
            decision_made: `We chose to [build X / cut Y / defer Z] because:
- User impact: 
- Engineering cost: 
- Time to market:`,
            trade_offs: `## What we gained
- 

## What we gave up
- `,
            biggest_risk: 'Users might expect... but we\'re accepting this because...',
            stakeholders: 'Product, Engineering, Design',
            tags: ['product', 'trade-off'],
        },
    },
    {
        id: 'incident',
        name: 'Incident Postmortem',
        description: 'Document incident findings and prevention',
        icon: 'Siren',
        fields: {
            title: 'Postmortem: [Incident Summary]',
            context: `## What happened
- Date/Time: 
- Duration: 
- Impact: [users affected, revenue impact]

## Timeline
- HH:MM - First alert
- HH:MM - Investigation started
- HH:MM - Root cause identified
- HH:MM - Fix deployed
- HH:MM - All clear`,
            decision_made: `## Root cause
[Describe the underlying cause]

## Fix applied
[What we did to resolve it]`,
            trade_offs: `## Prevention measures
1. Short-term: 
2. Long-term:

## Monitoring gaps identified
- `,
            biggest_risk: 'Without the long-term fix, this could happen again when...',
            stakeholders: 'Engineering, SRE, Product',
            tags: ['incident', 'postmortem'],
        },
    },
];

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): DecisionTemplate | undefined {
    return DECISION_TEMPLATES.find(t => t.id === id);
}
