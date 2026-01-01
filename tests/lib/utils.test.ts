import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
    it('should merge class names correctly', () => {
        const result = cn('px-2', 'py-1');
        expect(result).toBe('px-2 py-1');
    });

    it('should handle conditional classes', () => {
        const isActive = true;
        const result = cn('base-class', isActive && 'active');
        expect(result).toBe('base-class active');
    });

    it('should filter out falsy values', () => {
        const result = cn('base', false, null, undefined, 'end');
        expect(result).toBe('base end');
    });

    it('should merge conflicting Tailwind classes correctly', () => {
        // twMerge should keep the last conflicting class
        const result = cn('px-2', 'px-4');
        expect(result).toBe('px-4');
    });

    it('should handle arrays of classes', () => {
        const result = cn(['class1', 'class2']);
        expect(result).toBe('class1 class2');
    });

    it('should handle object notation', () => {
        const result = cn({
            'active': true,
            'disabled': false,
        });
        expect(result).toBe('active');
    });

    it('should handle empty input', () => {
        const result = cn();
        expect(result).toBe('');
    });

    it('should merge complex Tailwind utilities', () => {
        const result = cn(
            'bg-red-500',
            'hover:bg-blue-500',
            'bg-green-500' // Should override bg-red-500
        );
        expect(result).toBe('hover:bg-blue-500 bg-green-500');
    });
});
