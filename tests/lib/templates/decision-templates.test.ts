import { describe, it, expect } from 'vitest';
import { DECISION_TEMPLATES, getTemplateById, type DecisionTemplate } from '@/lib/templates/decision-templates';

describe('Decision Templates', () => {
    describe('DECISION_TEMPLATES', () => {
        it('should have 4 templates defined', () => {
            expect(DECISION_TEMPLATES).toHaveLength(4);
        });

        it('should have unique IDs for all templates', () => {
            const ids = DECISION_TEMPLATES.map(t => t.id);
            const uniqueIds = new Set(ids);
            expect(ids.length).toBe(uniqueIds.size);
        });

        it('should include ADR template', () => {
            const adr = DECISION_TEMPLATES.find(t => t.id === 'adr');
            expect(adr).toBeDefined();
            expect(adr?.name).toBe('Architecture Decision Record (ADR)');
            expect(adr?.icon).toBe('Box');
        });

        it('should include Tech Debt template', () => {
            const techDebt = DECISION_TEMPLATES.find(t => t.id === 'tech-debt');
            expect(techDebt).toBeDefined();
            expect(techDebt?.name).toBe('Tech Debt Decision');
            expect(techDebt?.icon).toBe('AlertTriangle');
        });

        it('should include Feature Trade-off template', () => {
            const tradeoff = DECISION_TEMPLATES.find(t => t.id === 'feature-tradeoff');
            expect(tradeoff).toBeDefined();
            expect(tradeoff?.name).toBe('Feature Trade-off');
            expect(tradeoff?.icon).toBe('Scale');
        });

        it('should include Incident Postmortem template', () => {
            const incident = DECISION_TEMPLATES.find(t => t.id === 'incident');
            expect(incident).toBeDefined();
            expect(incident?.name).toBe('Incident Postmortem');
            expect(incident?.icon).toBe('Siren');
        });

        it('should have required fields in all templates', () => {
            DECISION_TEMPLATES.forEach((template) => {
                expect(template.id).toBeDefined();
                expect(template.name).toBeDefined();
                expect(template.description).toBeDefined();
                expect(template.icon).toBeDefined();
                expect(template.fields).toBeDefined();
                expect(template.fields.title).toBeDefined();
                expect(template.fields.context).toBeDefined();
                expect(template.fields.decision_made).toBeDefined();
                expect(template.fields.tags).toBeDefined();
                expect(Array.isArray(template.fields.tags)).toBe(true);
            });
        });

        it('should have non-empty tags arrays', () => {
            DECISION_TEMPLATES.forEach((template) => {
                expect(template.fields.tags.length).toBeGreaterThan(0);
            });
        });
    });

    describe('getTemplateById', () => {
        it('should return ADR template by id', () => {
            const template = getTemplateById('adr');
            expect(template).toBeDefined();
            expect(template?.id).toBe('adr');
            expect(template?.name).toBe('Architecture Decision Record (ADR)');
        });

        it('should return tech-debt template by id', () => {
            const template = getTemplateById('tech-debt');
            expect(template).toBeDefined();
            expect(template?.id).toBe('tech-debt');
        });

        it('should return feature-tradeoff template by id', () => {
            const template = getTemplateById('feature-tradeoff');
            expect(template).toBeDefined();
            expect(template?.id).toBe('feature-tradeoff');
        });

        it('should return incident template by id', () => {
            const template = getTemplateById('incident');
            expect(template).toBeDefined();
            expect(template?.id).toBe('incident');
        });

        it('should return undefined for non-existent template', () => {
            const template = getTemplateById('non-existent');
            expect(template).toBeUndefined();
        });

        it('should return undefined for empty string', () => {
            const template = getTemplateById('');
            expect(template).toBeUndefined();
        });

        it('should be case-sensitive', () => {
            const template = getTemplateById('ADR');
            expect(template).toBeUndefined(); // Should not find 'adr'
        });
    });

    describe('Template structure validation', () => {
        it('ADR template should have architecture tags', () => {
            const adr = getTemplateById('adr');
            expect(adr?.fields.tags).toContain('adr');
            expect(adr?.fields.tags).toContain('architecture');
        });

        it('Tech Debt template should have tech-debt tag', () => {
            const techDebt = getTemplateById('tech-debt');
            expect(techDebt?.fields.tags).toContain('tech-debt');
        });

        it('Feature Trade-off template should have product tag', () => {
            const tradeoff = getTemplateById('feature-tradeoff');
            expect(tradeoff?.fields.tags).toContain('product');
        });

        it('Incident template should have postmortem tag', () => {
            const incident = getTemplateById('incident');
            expect(incident?.fields.tags).toContain('postmortem');
        });

        it('All templates should have stakeholders defined', () => {
            DECISION_TEMPLATES.forEach((template) => {
                expect(template.fields.stakeholders).toBeDefined();
                expect(template.fields.stakeholders!.length).toBeGreaterThan(0);
            });
        });
    });
});
