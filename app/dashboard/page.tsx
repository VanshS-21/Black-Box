'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Filter, ChevronDown, X, ChevronUp } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { Decision } from '@/lib/supabase/client';
import { DecisionCard } from '@/components/DecisionCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PromotionPackageGenerator } from '@/components/PromotionPackageGenerator';
import { WeeklyUpdateGenerator } from '@/components/WeeklyUpdateGenerator';
import { QuickReframe } from '@/components/QuickReframe';
import { DemoDecisions } from '@/components/DemoDecisions';
import { SavedPackagesCard } from '@/components/SavedPackagesCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/ui/FadeIn';
import { DashboardAnalytics } from '@/components/DashboardAnalytics';
import { DashboardHeader } from '@/components/DashboardHeader';

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 6;

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [decisions, setDecisions] = useState<Decision[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    // Filter state
    const [showFilters, setShowFilters] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [minConfidence, setMinConfidence] = useState(0);

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
            // Build query params
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (dateFrom) params.set('date_from', dateFrom);
            if (dateTo) params.set('date_to', dateTo);
            if (minConfidence > 0) params.set('min_confidence', String(minConfidence));

            const response = await fetch(`/api/decisions?${params.toString()}`);

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

    // Clear all filters
    const clearFilters = () => {
        setSearch('');
        setDateFrom('');
        setDateTo('');
        setMinConfidence(0);
    };

    const handleSearch = () => {
        fetchDecisions();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30 text-slate-200">
                {/* Background Effects */}
                <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />
                <div className="fixed bottom-0 right-0 w-full h-[500px] bg-violet-900/10 blur-[100px] pointer-events-none" />

                <DashboardHeader />

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

            <DashboardHeader />

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
                    <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
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
                            <Button
                                onClick={() => setShowFilters(!showFilters)}
                                variant="ghost"
                                className={`text-slate-400 hover:text-white ${showFilters ? 'bg-white/10' : ''}`}
                            >
                                <Filter className="w-4 h-4" />
                                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </Button>
                        </div>
                    </div>

                    {/* Expandable Filters */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm"
                        >
                            <div className="flex flex-wrap gap-4 items-end">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">From Date</label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm focus:border-indigo-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">To Date</label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-sm focus:border-indigo-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Min Confidence</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            value={minConfidence}
                                            onChange={(e) => setMinConfidence(parseInt(e.target.value))}
                                            className="w-24 accent-indigo-500"
                                        />
                                        <span className="text-sm text-white w-8">{minConfidence > 0 ? `${minConfidence}+` : 'Any'}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleSearch} size="sm" className="bg-indigo-600 text-white hover:bg-indigo-500">
                                        Apply
                                    </Button>
                                    {(dateFrom || dateTo || minConfidence > 0) && (
                                        <Button onClick={() => { clearFilters(); fetchDecisions(); }} size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                                            <X className="w-4 h-4 mr-1" /> Clear
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </FadeIn>

                {/* Analytics Widget */}
                <FadeIn delay={0.15}>
                    <div className="mb-8">
                        <DashboardAnalytics />
                    </div>
                </FadeIn>

                {/* AI Tools Grid - Quick Reframe, Weekly Update, Promotion Package */}
                <FadeIn delay={0.2}>
                    <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Quick Reframe */}
                        <QuickReframe />

                        {/* Right: Weekly Update + Promotion Package stacked */}
                        <div className="space-y-6">
                            <WeeklyUpdateGenerator decisionCount={decisions.length} />
                            <PromotionPackageGenerator decisionCount={decisions.length} />
                        </div>
                    </div>
                </FadeIn>

                {/* Saved Packages */}
                <FadeIn delay={0.25}>
                    <div className="mb-12">
                        <SavedPackagesCard />
                    </div>
                </FadeIn>

                {/* Decision List or Demo Data for new users */}
                {decisions.length === 0 ? (
                    <FadeIn delay={0.3}>
                        <DemoDecisions />
                    </FadeIn>
                ) : (
                    <div>
                        {/* Section Header with count */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white font-outfit">
                                Your Decisions
                                <span className="text-sm font-normal text-slate-400 ml-2">
                                    ({decisions.length} total)
                                </span>
                            </h3>
                            {decisions.length > INITIAL_VISIBLE_COUNT && (
                                <span className="text-sm text-slate-400">
                                    Showing {Math.min(visibleCount, decisions.length)} of {decisions.length}
                                </span>
                            )}
                        </div>

                        {/* Decision Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {decisions.slice(0, visibleCount).map((decision, index) => (
                                <motion.div
                                    key={decision.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index >= INITIAL_VISIBLE_COUNT ? (index - INITIAL_VISIBLE_COUNT) * 0.05 : index * 0.05,
                                        ease: "easeOut"
                                    }}
                                >
                                    <DecisionCard decision={decision} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Show More / Show Less Controls */}
                        {decisions.length > INITIAL_VISIBLE_COUNT && (
                            <motion.div
                                className="mt-8 flex justify-center gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {visibleCount < decisions.length && (
                                    <Button
                                        onClick={() => setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, decisions.length))}
                                        variant="outline"
                                        className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                                    >
                                        <ChevronDown className="w-4 h-4 mr-2" />
                                        Show More ({Math.min(LOAD_MORE_COUNT, decisions.length - visibleCount)} more)
                                    </Button>
                                )}
                                {visibleCount > INITIAL_VISIBLE_COUNT && (
                                    <Button
                                        onClick={() => setVisibleCount(INITIAL_VISIBLE_COUNT)}
                                        variant="ghost"
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <ChevronUp className="w-4 h-4 mr-2" />
                                        Show Less
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
