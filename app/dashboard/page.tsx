'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, RefreshCw, Plus, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { Decision } from '@/lib/supabase/client';
import { DecisionCard } from '@/components/DecisionCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PromotionPackageGenerator } from '@/components/PromotionPackageGenerator';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/ui/FadeIn';

export default function DashboardPage() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [decisions, setDecisions] = useState<Decision[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchDecisions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchDecisions = async () => {
        setError(null);
        try {
            const response = await fetch(`/api/decisions?search=${encodeURIComponent(search)}`);

            if (response.ok) {
                const data = await response.json();
                setDecisions(data);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to load decisions');
            }
        } catch (err) {
            console.error('Error fetching decisions:', err);
            setError('Unable to connect. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchDecisions();
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/auth/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30 text-slate-200">
                {/* Background Effects */}
                <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />
                <div className="fixed bottom-0 right-0 w-full h-[500px] bg-violet-900/10 blur-[100px] pointer-events-none" />

                {/* Header Skeleton */}
                <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-md shadow-lg shadow-indigo-500/20" />
                            <h1 className="text-lg font-bold text-white tracking-tight font-outfit">Career Black Box</h1>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-2 font-outfit">Flight Recorder</h2>
                        <p className="text-slate-400">Loading your decision logs...</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <FadeIn>
                    <div className="text-center max-w-md px-4">
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2 font-outfit">Something went wrong</h2>
                        <p className="text-slate-400 mb-6">{error}</p>
                        <Button
                            onClick={() => {
                                setLoading(true);
                                fetchDecisions();
                            }}
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                        </Button>
                    </div>
                </FadeIn>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30 text-slate-200">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-full h-[500px] bg-violet-900/10 blur-[100px] pointer-events-none" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-md shadow-lg shadow-indigo-500/20" />
                        <h1 className="text-lg font-bold text-white tracking-tight font-outfit">Career Black Box</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-slate-500 hidden sm:block">USR: {user?.email}</span>
                        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
                        <Link href="/dashboard/settings">
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5">
                                <Settings className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Settings</span>
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={handleSignOut} className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
                            <LogOut className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Stats / Welcome Area */}
                <FadeIn>
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-2 font-outfit">Flight Recorder</h2>
                        <p className="text-slate-400">Review your decision logs and analyze patterns.</p>
                    </div>
                </FadeIn>

                {/* Search and Actions */}
                <FadeIn delay={0.1}>
                    <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                        <div className="flex-1 flex gap-2 w-full sm:max-w-md">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search logs (e.g. 'database migration')..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                            />
                            <Button onClick={handleSearch} variant="secondary" className="bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-white/5">
                                Search
                            </Button>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                onClick={() => router.push('/dashboard/new')}
                                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 border border-white/10"
                                size="lg"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Log Decision
                            </Button>
                        </motion.div>
                    </div>
                </FadeIn>

                {/* Promotion Package Generator */}
                <FadeIn delay={0.2}>
                    <div className="mb-12">
                        <PromotionPackageGenerator decisionCount={decisions.length} />
                    </div>
                </FadeIn>

                {/* Decision List or Empty State */}
                {decisions.length === 0 ? (
                    <FadeIn delay={0.3}>
                        <div className="text-center py-24 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02]">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/5">
                                <Package className="w-8 h-8 text-slate-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2 font-outfit">
                                No flight data recorded
                            </h2>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                Start documenting your professional decisions to build your evidence locker.
                            </p>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={() => router.push('/dashboard/new')}
                                    variant="primary"
                                    size="lg"
                                    className="bg-white text-slate-900 hover:bg-slate-100"
                                >
                                    Log First Decision
                                </Button>
                            </motion.div>
                        </div>
                    </FadeIn>
                ) : (
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {decisions.map((decision) => (
                            <StaggerItem key={decision.id}>
                                <DecisionCard decision={decision} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                )}
            </main>
        </div>
    );
}
