'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    TrendingUp,
    Users,
    CheckCircle2,
    Clock,
    BarChart3,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface TeamPulseData {
    teamId: string;
    teamName: string;
    totalMembers: number;
    totalDecisions: number;
    activeMembers: { userId: string; decisionsThisWeek: number }[];
    silentMembers: { userId: string; daysSinceLastDecision: number | null }[];
    topRisks: { risk: string; count: number }[];
    weeklyTrend: { week: string; weekStart: string; decisionCount: number }[];
}

interface TeamPulseDashboardProps {
    teamId: string;
    onClose?: () => void;
}

export function TeamPulseDashboard({ teamId, onClose }: TeamPulseDashboardProps) {
    const [data, setData] = useState<TeamPulseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPulse = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/teams/${teamId}/pulse`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to fetch pulse');
            }
            const pulseData = await response.json();
            setData(pulseData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPulse();
    }, [teamId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <p className="text-red-300">{error}</p>
                <Button onClick={fetchPulse} variant="ghost" className="mt-3 text-red-400">
                    Try Again
                </Button>
            </div>
        );
    }

    if (!data) return null;

    const maxTrend = Math.max(...data.weeklyTrend.map(w => w.decisionCount), 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white font-outfit">{data.teamName} Pulse</h2>
                    <p className="text-sm text-slate-400">{data.totalMembers} members • {data.totalDecisions} total decisions</p>
                </div>
                <Button onClick={fetchPulse} variant="ghost" size="sm" className="text-slate-400">
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            {/* Activity Cards Row */}
            <div className="grid grid-cols-2 gap-4">
                {/* Active Members */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">Active This Week</span>
                    </div>
                    <div className="text-3xl font-bold text-white font-outfit">{data.activeMembers.length}</div>
                    <div className="text-xs text-emerald-400/70 mt-1">
                        {data.activeMembers.reduce((sum, m) => sum + m.decisionsThisWeek, 0)} decisions logged
                    </div>
                </motion.div>

                {/* Silent Members */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`rounded-xl p-4 border ${data.silentMembers.length > 0
                            ? 'bg-amber-500/10 border-amber-500/20'
                            : 'bg-slate-800/50 border-white/10'
                        }`}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className={`w-5 h-5 ${data.silentMembers.length > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
                        <span className={`text-sm font-medium ${data.silentMembers.length > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                            Silent This Week
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-white font-outfit">{data.silentMembers.length}</div>
                    <div className={`text-xs mt-1 ${data.silentMembers.length > 0 ? 'text-amber-400/70' : 'text-slate-500'}`}>
                        {data.silentMembers.length > 0 ? 'May need a check-in' : 'Everyone is engaged!'}
                    </div>
                </motion.div>
            </div>

            {/* Weekly Trend */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/50 border border-white/10 rounded-xl p-4"
            >
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-medium text-white">Weekly Trend</span>
                </div>
                <div className="flex items-end gap-2 h-24">
                    {data.weeklyTrend.map((week, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(week.decisionCount / maxTrend) * 100}%` }}
                                transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                                className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-sm"
                                style={{ minHeight: week.decisionCount > 0 ? '8px' : '2px' }}
                            />
                            <span className="text-xs text-slate-500">{week.week}</span>
                            <span className="text-xs text-slate-400">{week.decisionCount}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Top Risks */}
            {data.topRisks.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-800/50 border border-white/10 rounded-xl p-4"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-medium text-white">Top Risks Identified</span>
                    </div>
                    <div className="space-y-2">
                        {data.topRisks.slice(0, 5).map((risk, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="text-slate-300 truncate flex-1">{risk.risk}...</span>
                                <span className="text-slate-500 ml-2">×{risk.count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Silent Member Details */}
            {data.silentMembers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-medium text-amber-300">Silent Members</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        {data.silentMembers.slice(0, 5).map((member, idx) => (
                            <div key={idx} className="flex items-center justify-between text-slate-400">
                                <span>Member {idx + 1}</span>
                                <span className="text-amber-400/70">
                                    {member.daysSinceLastDecision !== null
                                        ? `${member.daysSinceLastDecision} days ago`
                                        : 'Never logged'
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
