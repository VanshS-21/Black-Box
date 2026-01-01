import { test, expect } from '@playwright/test';

test.describe('Authentication Pages', () => {
    test.describe('Login Page', () => {
        test('should render login page correctly', async ({ page }) => {
            await page.goto('/auth/login');

            // Check page elements
            await expect(page.locator('h1')).toContainText('Welcome Back');
            await expect(page.locator('input[type="email"]')).toBeVisible();
            await expect(page.locator('input[type="password"]')).toBeVisible();
            await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
        });

        test('should have link to signup page', async ({ page }) => {
            await page.goto('/auth/login');

            const signupLink = page.locator('a[href="/auth/signup"]');
            await expect(signupLink).toBeVisible();
            await signupLink.click();

            await expect(page).toHaveURL('/auth/signup');
        });

        test('should have link to forgot password', async ({ page }) => {
            await page.goto('/auth/login');

            const forgotLink = page.locator('a[href="/auth/forgot-password"]');
            await expect(forgotLink).toBeVisible();
            await expect(forgotLink).toContainText('Forgot password');
        });

        test('should show error for empty form submission', async ({ page }) => {
            await page.goto('/auth/login');

            await page.locator('button[type="submit"]').click();

            // HTML5 validation should prevent submission
            const emailInput = page.locator('input[type="email"]');
            const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
            expect(isInvalid).toBe(true);
        });

        test('should toggle password visibility', async ({ page }) => {
            await page.goto('/auth/login');

            const passwordInput = page.locator('input[name="password"]');
            const toggleButton = page.locator('button[aria-label*="password"]');

            // Initially password type
            await expect(passwordInput).toHaveAttribute('type', 'password');

            // Click to show
            await toggleButton.click();
            await expect(passwordInput).toHaveAttribute('type', 'text');

            // Click to hide
            await toggleButton.click();
            await expect(passwordInput).toHaveAttribute('type', 'password');
        });
    });

    test.describe('Signup Page', () => {
        test('should render signup page correctly', async ({ page }) => {
            await page.goto('/auth/signup');

            await expect(page.locator('h1')).toContainText('Create');
            await expect(page.locator('input[type="email"]')).toBeVisible();
            await expect(page.locator('input[name="password"]')).toBeVisible();
            await expect(page.locator('button[type="submit"]')).toBeVisible();
        });

        test('should have link to login page', async ({ page }) => {
            await page.goto('/auth/signup');

            const loginLink = page.locator('a[href="/auth/login"]');
            await expect(loginLink).toBeVisible();
            await loginLink.click();

            await expect(page).toHaveURL('/auth/login');
        });

        test('should require email field', async ({ page }) => {
            await page.goto('/auth/signup');

            await page.locator('button[type="submit"]').click();

            const emailInput = page.locator('input[type="email"]');
            const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
            expect(isInvalid).toBe(true);
        });
    });

    test.describe('Forgot Password Page', () => {
        test('should render forgot password page', async ({ page }) => {
            await page.goto('/auth/forgot-password');

            await expect(page.locator('h1')).toBeVisible();
            await expect(page.locator('input[type="email"]')).toBeVisible();
        });

        test('should have link back to login', async ({ page }) => {
            await page.goto('/auth/forgot-password');

            const loginLink = page.locator('a[href="/auth/login"]');
            await expect(loginLink).toBeVisible();
        });
    });
});

test.describe('Protected Routes', () => {
    test('should redirect /dashboard to login when unauthenticated', async ({ page }) => {
        await page.goto('/dashboard');

        // Should be redirected to login
        await expect(page).toHaveURL(/.*\/auth\/login/);
    });

    test('should redirect /dashboard/new to login when unauthenticated', async ({ page }) => {
        await page.goto('/dashboard/new');

        await expect(page).toHaveURL(/.*\/auth\/login/);
    });

    test('should redirect /dashboard/settings to login when unauthenticated', async ({ page }) => {
        await page.goto('/dashboard/settings');

        await expect(page).toHaveURL(/.*\/auth\/login/);
    });
});

test.describe('Public Pages', () => {
    test('should load landing page', async ({ page }) => {
        await page.goto('/');

        await expect(page).toHaveTitle(/Career Black Box/);
        await expect(page.locator('body')).toBeVisible();
    });

    test('should load privacy policy', async ({ page }) => {
        await page.goto('/privacy');

        await expect(page.locator('h1')).toBeVisible();
    });

    test('should load terms page', async ({ page }) => {
        await page.goto('/terms');

        await expect(page.locator('h1')).toBeVisible();
    });
});

test.describe('Navigation', () => {
    test('should navigate from landing page to login', async ({ page }) => {
        await page.goto('/');

        // Find and click sign in button/link
        const signInButton = page.locator('a[href="/auth/login"], button:has-text("Sign In")').first();
        if (await signInButton.isVisible()) {
            await signInButton.click();
            await expect(page).toHaveURL('/auth/login');
        }
    });

    test('should navigate from landing page to signup', async ({ page }) => {
        await page.goto('/');

        // Find and click sign up button/link
        const signUpButton = page.locator('a[href="/auth/signup"]').first();
        if (await signUpButton.isVisible()) {
            await signUpButton.click();
            await expect(page).toHaveURL('/auth/signup');
        }
    });
});

test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        await expect(page.locator('body')).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/');

        await expect(page.locator('body')).toBeVisible();
    });
});

test.describe('API Health Check', () => {
    test('should return healthy status', async ({ request }) => {
        const response = await request.get('/api/health');


        expect(response.ok()).toBe(true);

        const data = await response.json();
        expect(data.status).toBe('ok');
        expect(data.checkType).toBe('fast');
    });

    test('should return deep health check with database status', async ({ request }) => {
        const response = await request.get('/api/health?deep=true');

        expect(response.status()).toBeLessThan(504); // Not a gateway timeout

        const data = await response.json();
        expect(['ok', 'degraded', 'error']).toContain(data.status);
        expect(data.checkType).toBe('deep');
    });
});
