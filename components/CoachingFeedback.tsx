'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingUp, AlertTriangle, Zap, Check } from 'lucide-react';
import { CareerCoaching } from '@/lib/ai/gemini';
import { Button } from '@/components/ui/Button';

interface CoachingFeedbackProps {
    coaching: CareerCoaching;
    originalDecision: string;
    onAcceptReframe: (reframedText: string) => void;
}

export function CoachingFeedback({ coaching, originalDecision, onAcceptReframe }: CoachingFeedbackProps) {
    const getReadinessColor = (score: number) => {
        if (score >= 8) return 'text-emerald-400';
        if (score >= 5) return 'text-amber-400';
        return 'text-red-400';
    };

    const getReadinessLabel = (score: number) => {
        if (score >= 8) return 'Promotion Ready';
        if (score >= 5) return 'Getting There';
        return 'Needs Work';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4 mt-6"
        >
            {/* Header */}
            <div className="flex items-center gap-2 text-violet-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold text-lg">AI Career Coach Feedback</h3>
            </div>

            {/* Promotion Readiness Score */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm font-medium">Promotion Readiness</span>
                    <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getReadinessColor(coaching.promotion_readiness)}`}>
                            {coaching.promotion_readiness}/10
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getReadinessColor(coaching.promotion_readiness)} bg-current/10`}>
                            {getReadinessLabel(coaching.promotion_readiness)}
                        </span>
                    </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${coaching.promotion_readiness * 10}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-2 rounded-full ${coaching.promotion_readiness >= 8 ? 'bg-emerald-500' :
                                coaching.promotion_readiness >= 5 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                    />
                </div>
            </div>

            {/* Impact Reframe */}
            <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-violet-400" />
                    <span className="text-sm font-medium text-violet-300">Reframe for Maximum Impact</span>
                </div>

                {/* Before */}
                <div className="mb-3">
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Your version:</span>
                    <p className="text-slate-400 text-sm mt-1 line-through opacity-70">{originalDecision}</p>
                </div>

                {/* After */}
                <div className="mb-4">
                    <span className="text-xs text-emerald-400 uppercase tracking-wide">Promotion-ready version:</span>
                    <p className="text-white text-sm mt-1 leading-relaxed">{coaching.impact_reframe}</p>
                </div>

                <Button
                    onClick={() => onAcceptReframe(coaching.impact_reframe)}
                    variant="secondary"
                    size="sm"
                    className="w-full bg-violet-500/20 hover:bg-violet-500/30 border-violet-500/30"
                >
                    <Check className="w-4 h-4 mr-2" />
                    Use This Reframe
                </Button>
            </div>

            {/* Weak vs Power Phrases */}
            {coaching.weak_phrases.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-slate-300">Phrase Upgrades</span>
                    </div>

                    <div className="space-y-2">
                        {coaching.weak_phrases.map((weak, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                                <span className="text-red-400 line-through">{weak}</span>
                                <ArrowRight className="w-4 h-4 text-slate-600" />
                                <span className="text-emerald-400">{coaching.power_phrases[idx] || 'Add metrics'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Coaching Tip */}
            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                    <span className="text-sm font-medium text-amber-300">Pro Tip</span>
                    <p className="text-slate-300 text-sm mt-1">{coaching.coaching_tip}</p>
                </div>
            </div>
        </motion.div>
    );
}
