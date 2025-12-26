/**
 * Save draft data to localStorage
 */
export function saveDraft(key: string, data: any): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving draft:', error);
    }
}

/**
 * Load draft data from localStorage
 */
export function loadDraft<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error loading draft:', error);
        return null;
    }
}

/**
 * Remove draft from localStorage
 */
export function clearDraft(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error clearing draft:', error);
    }
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (format === 'long') {
        return d.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }

    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}
