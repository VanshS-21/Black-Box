import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/lib/auth/context';
import { supabase } from '@/lib/supabase/client';

// Test component to access useAuth
function TestComponent() {
    const { user, session, loading, signIn, signUp, signOut } = useAuth();
    return (
        <div>
            <span data-testid="loading">{String(loading)}</span>
            <span data-testid="user">{user?.email || 'no-user'}</span>
            <span data-testid="session">{session ? 'has-session' : 'no-session'}</span>
            <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
            <button onClick={() => signUp('test@example.com', 'password')}>Sign Up</button>
            <button onClick={() => signOut()}>Sign Out</button>
        </div>
    );
}

// Component that uses useAuth outside of provider (should throw)
function InvalidComponent() {
    try {
        useAuth();
        return <div>Should not render</div>;
    } catch (error) {
        return <div data-testid="error">{(error as Error).message}</div>;
    }
}

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useAuth hook', () => {
        it('should throw error when used outside AuthProvider', () => {
            render(<InvalidComponent />);
            expect(screen.getByTestId('error').textContent).toBe(
                'useAuth must be used within an AuthProvider'
            );
        });
    });

    describe('AuthProvider', () => {
        it('should start in loading state', async () => {
            // Mock getSession to be slow
            vi.mocked(supabase.auth.getSession).mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve({ data: { session: null }, error: null }), 100))
            );

            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );

            // Initially loading should be true
            expect(screen.getByTestId('loading').textContent).toBe('true');
        });

        it('should set loading to false after fetching session', async () => {
            vi.mocked(supabase.auth.getSession).mockResolvedValue({
                data: { session: null },
                error: null,
            });

            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('loading').textContent).toBe('false');
            });
        });

        it('should set user when session exists', async () => {
            const mockUser = { id: '123', email: 'test@example.com' };
            const mockSession = { user: mockUser, access_token: 'token' };

            vi.mocked(supabase.auth.getSession).mockResolvedValue({
                data: { session: mockSession as any },
                error: null,
            });

            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('user').textContent).toBe('test@example.com');
                expect(screen.getByTestId('session').textContent).toBe('has-session');
            });
        });

        it('should have no user when no session', async () => {
            vi.mocked(supabase.auth.getSession).mockResolvedValue({
                data: { session: null },
                error: null,
            });

            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('user').textContent).toBe('no-user');
                expect(screen.getByTestId('session').textContent).toBe('no-session');
            });
        });

        it('should subscribe to auth state changes', async () => {
            vi.mocked(supabase.auth.getSession).mockResolvedValue({
                data: { session: null },
                error: null,
            });

            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
            });
        });
    });

    describe('Auth methods', () => {
        beforeEach(() => {
            vi.mocked(supabase.auth.getSession).mockResolvedValue({
                data: { session: null },
                error: null,
            });
        });

        it('should call signUp with email and password', async () => {
            vi.mocked(supabase.auth.signUp).mockResolvedValue({
                data: { user: null, session: null },
                error: null,
            });

            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('loading').textContent).toBe('false');
            });

            await act(async () => {
                screen.getByText('Sign Up').click();
            });

            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password',
            });
        });

        it('should call signInWithPassword with email and password', async () => {
            vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
                data: { user: null, session: null },
                error: null,
            } as any);

            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('loading').textContent).toBe('false');
            });

            await act(async () => {
                screen.getByText('Sign In').click();
            });

            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password',
            });
        });

        it('should call signOut', async () => {
            vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('loading').textContent).toBe('false');
            });

            await act(async () => {
                screen.getByText('Sign Out').click();
            });

            expect(supabase.auth.signOut).toHaveBeenCalled();
        });
    });
});
