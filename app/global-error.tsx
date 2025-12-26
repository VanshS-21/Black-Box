'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html lang="en">
            <body className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">💥</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Something went wrong!</h1>
                    <p className="text-slate-400 mb-6">
                        An unexpected error occurred. Our team has been notified and is working on a fix.
                    </p>
                    {error.digest && (
                        <p className="text-slate-600 text-sm font-mono mb-6">
                            Error ID: {error.digest}
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={reset}
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white"
                        >
                            🔄 Try Again
                        </Button>
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="border-white/10 text-slate-300 hover:bg-white/5"
                            >
                                ← Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
