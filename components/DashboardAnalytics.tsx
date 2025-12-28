'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Flame, Tag, BarChart3 } from 'lucide-react';

interface AnalyticsData {
    totalDecisions: number;
    thisMonth: number;
    lastMonth: number;
    monthChange: number;
    weekStreak: number;
    topTags: { tag: string; count: number }[];
    avgConfidence: number | null;
}

// Cache key and stale time for client-side caching
const CACHE_KEY = 'dashboard_analytics_cache';
const CACHE_STALE_TIME = 60 * 1000; // 60 seconds

interface CachedData {
    data: AnalyticsData;
    timestamp: number;
}

export function DashboardAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = useCallback(async (skipCache = false) => {
        // Check cache first
        if (!skipCache) {
            try {
                const cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data: cachedData, timestamp }: CachedData = JSON.parse(cached);
                    const isStale = Date.now() - timestamp > CACHE_STALE_TIME;

                    if (!isStale) {
                        setData(cachedData);
                        setLoading(false);
                        return;
                    }
                    // Use stale data while fetching fresh
                    setData(cachedData);
                }
            } catch {
                // Ignore cache errors
            }
        }

        try {
            const response = await fetch('/api/analytics/personal');
            if (response.ok) {
                const analytics = await response.json();
                setData(analytics);
                // Cache the result
                try {
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                        data: analytics,
                        timestamp: Date.now(),
                    }));
                } catch {
                    // Ignore storage errors
                }
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading) {
        return (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 animate-pulse">
                <div className="h-4 w-32 bg-slate-700 rounded mb-4" />
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 bg-slate-800 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (!data || data.totalDecisions === 0) {
        return null; // Don't show if no decisions yet
    }

    const statCards = [
        {
            label: 'This Month',
            value: data.thisMonth,
            change: data.monthChange,
            icon: data.monthChange >= 0 ? TrendingUp : TrendingDown,
            color: data.monthChange >= 0 ? 'text-emerald-400' : 'text-red-400',
            bgColor: data.monthChange >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10',
        },
        {
            label: 'Week Streak',
            value: data.weekStreak,
            suffix: data.weekStreak === 1 ? 'week' : 'weeks',
            icon: Flame,
            color: data.weekStreak >= 4 ? 'text-orange-400' : 'text-slate-400',
            bgColor: data.weekStreak >= 4 ? 'bg-orange-500/10' : 'bg-slate-500/10',
        },
        {
            label: 'Avg Confidence',
            value: data.avgConfidence ?? '-',
            suffix: '/10',
            icon: BarChart3,
            color: (data.avgConfidence ?? 0) >= 7 ? 'text-indigo-400' : 'text-yellow-400',
            bgColor: (data.avgConfidence ?? 0) >= 7 ? 'bg-indigo-500/10' : 'bg-yellow-500/10',
        },
        {
            label: 'Total Logged',
            value: data.totalDecisions,
            icon: Tag,
            color: 'text-violet-400',
            bgColor: 'bg-violet-500/10',
        },
    ];

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                    Your Stats
                </h3>
                {data.topTags.length > 0 && (
                    <div className="flex gap-1">
                        {data.topTags.slice(0, 3).map((t) => (
                            <span
                                key={t.tag}
                                className="px-2 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20"
                            >
                                {t.tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {statCards.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`${stat.bgColor} rounded-lg p-3 border border-white/5`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-[10px] uppercase tracking-wider text-slate-500">{stat.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                            {stat.suffix && <span className="text-xs text-slate-500">{stat.suffix}</span>}
                            {stat.change !== undefined && stat.change !== 0 && (
                                <span className={`text-xs ${stat.color}`}>
                                    {stat.change > 0 ? '+' : ''}{stat.change}%
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
