'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center selection:bg-violet-500/30">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/10 blur-[100px] pointer-events-none" />

            <div className="text-center relative z-10 px-4">
                <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 mb-4 font-outfit">
                    404
                </div>
                <h1 className="text-3xl font-bold text-white mb-4 font-outfit">
                    Page Not Found
                </h1>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button
                            variant="primary"
                            size="lg"
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                        >
                            ← Back to Home
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white/10 text-slate-300 hover:bg-white/5"
                        >
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
