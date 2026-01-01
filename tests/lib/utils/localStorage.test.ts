import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveDraft, loadDraft, clearDraft, formatDate, truncate } from '@/lib/utils/localStorage';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

describe('localStorage utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('saveDraft', () => {
        it('should save data as JSON string', () => {
            const data = { title: 'Test', content: 'Hello' };
            saveDraft('test-key', data);

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'test-key',
                JSON.stringify(data)
            );
        });

        it('should handle complex objects', () => {
            const data = {
                title: 'Test',
                tags: ['a', 'b'],
                nested: { value: 123 },
            };
            saveDraft('complex-key', data);

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'complex-key',
                JSON.stringify(data)
            );
        });

        it('should not throw on error', () => {
            localStorageMock.setItem.mockImplementationOnce(() => {
                throw new Error('Storage full');
            });

            expect(() => saveDraft('key', { data: 'test' })).not.toThrow();
        });
    });

    describe('loadDraft', () => {
        it('should parse and return stored data', () => {
            const storedData = { title: 'Test' };
            localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(storedData));

            const result = loadDraft('test-key');

            expect(result).toEqual(storedData);
        });

        it('should return null when key does not exist', () => {
            localStorageMock.getItem.mockReturnValueOnce(null);

            const result = loadDraft('non-existent');

            expect(result).toBeNull();
        });

        it('should handle type generics correctly', () => {
            interface TestType {
                id: number;
                name: string;
            }

            localStorageMock.getItem.mockReturnValueOnce(
                JSON.stringify({ id: 1, name: 'Test' })
            );

            const result = loadDraft<TestType>('typed-key');

            expect(result?.id).toBe(1);
            expect(result?.name).toBe('Test');
        });

        it('should return null on parse error', () => {
            localStorageMock.getItem.mockReturnValueOnce('invalid json{');

            const result = loadDraft('bad-key');

            expect(result).toBeNull();
        });
    });

    describe('clearDraft', () => {
        it('should remove item from localStorage', () => {
            clearDraft('test-key');

            expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
        });

        it('should not throw on error', () => {
            localStorageMock.removeItem.mockImplementationOnce(() => {
                throw new Error('Storage error');
            });

            expect(() => clearDraft('key')).not.toThrow();
        });
    });
});

describe('formatDate', () => {
    it('should format date in short format by default', () => {
        const date = new Date('2024-12-28');
        const result = formatDate(date);

        expect(result).toMatch(/Dec/);
        expect(result).toMatch(/28/);
        expect(result).toMatch(/2024/);
    });

    it('should format date string in short format', () => {
        const result = formatDate('2024-06-15');

        expect(result).toMatch(/Jun/);
        expect(result).toMatch(/15/);
        expect(result).toMatch(/2024/);
    });

    it('should format date in long format when specified', () => {
        const date = new Date('2024-12-28');
        const result = formatDate(date, 'long');

        expect(result).toMatch(/December/);
        expect(result).toMatch(/28/);
        expect(result).toMatch(/2024/);
    });

    it('should handle string dates', () => {
        const result = formatDate('2024-01-01', 'long');

        expect(result).toMatch(/January/);
        expect(result).toMatch(/1/);
        expect(result).toMatch(/2024/);
    });

    it('should handle ISO date strings', () => {
        const result = formatDate('2024-12-28T10:30:00.000Z');

        expect(result).toMatch(/2024/);
    });
});

describe('truncate', () => {
    it('should return text unchanged if shorter than maxLength', () => {
        const result = truncate('Short text', 20);

        expect(result).toBe('Short text');
    });

    it('should return text unchanged if equal to maxLength', () => {
        const result = truncate('Exact', 5);

        expect(result).toBe('Exact');
    });

    it('should truncate and add ellipsis if longer than maxLength', () => {
        const result = truncate('This is a long text that needs truncation', 10);

        expect(result).toBe('This is a ...');
        expect(result.length).toBe(13); // 10 chars + '...'
    });

    it('should handle empty string', () => {
        const result = truncate('', 10);

        expect(result).toBe('');
    });

    it('should handle maxLength of 0', () => {
        const result = truncate('Test', 0);

        expect(result).toBe('...');
    });

    it('should handle single character maxLength', () => {
        const result = truncate('Hello', 1);

        expect(result).toBe('H...');
    });
});
