'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center selection:bg-violet-500/30">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/10 blur-[100px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/10 blur-[100px] pointer-events-none" />

            <div className="text-center relative z-10 px-4">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">⚠️</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4 font-outfit">
                    Something went wrong
                </h1>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    We encountered an unexpected error. Don't worry, your data is safe.
                    Try again or return to the homepage.
                </p>
                {error.digest && (
                    <p className="text-slate-600 text-sm mb-6 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={reset}
                        variant="primary"
                        size="lg"
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                    >
                        🔄 Try Again
                    </Button>
                    <Link href="/">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white/10 text-slate-300 hover:bg-white/5"
                        >
                            ← Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
