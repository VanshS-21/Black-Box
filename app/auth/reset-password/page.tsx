'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if we have access token in URL (from email link)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        if (!hashParams.get('access_token')) {
            // No token, redirect to login
            router.push('/auth/login');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 selection:bg-violet-500/30">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/10 blur-[100px] pointer-events-none" />

            <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10 relative z-10">
                {!success ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-white font-outfit">New Password</h1>
                            <p className="text-slate-400 mt-2">Enter your new password below</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                                    New Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 border border-white/10"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4 font-outfit">Password Updated!</h2>
                        <p className="text-slate-400">
                            Your password has been updated successfully. Redirecting to login...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
