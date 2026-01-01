import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        globals: true,
        include: ['tests/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'e2e'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['lib/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
            exclude: ['**/*.d.ts', 'node_modules', 'tests'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});
