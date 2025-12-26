'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
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
                            <h1 className="text-3xl font-bold text-white font-outfit">Reset Password</h1>
                            <p className="text-slate-400 mt-2">Enter your email to receive a reset link</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
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
                                {loading ? 'Sending...' : 'Send Reset Link'}
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
                        <h2 className="text-2xl font-bold text-white mb-4 font-outfit">Check Your Email</h2>
                        <p className="text-slate-400 mb-6">
                            We've sent a password reset link to <span className="text-white font-medium">{email}</span>
                        </p>
                        <p className="text-slate-500 text-sm">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                    </div>
                )}

                <p className="text-center text-sm text-slate-500 mt-6">
                    Remember your password?{' '}
                    <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
