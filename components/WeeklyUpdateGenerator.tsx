'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, Copy, Check, RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { useToast } from '@/components/ui/Toast';

interface WeeklyUpdateGeneratorProps {
    decisionCount: number;
}

export function WeeklyUpdateGenerator({ decisionCount }: WeeklyUpdateGeneratorProps) {
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [decisionsUsed, setDecisionsUsed] = useState(0);
    const { showToast } = useToast();

    const handleGenerate = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/ai/weekly-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate update');
            }

            setUpdate(data.update);
            setDecisionsUsed(data.decisionsCount);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (update) {
            navigator.clipboard.writeText(update);
            setCopied(true);
            showToast('Copied to clipboard! Paste it in Slack 📱', 'success');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const canGenerate = decisionCount >= 1;

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-emerald-600/80 to-teal-600/80 rounded-xl p-5 text-white shadow-lg border border-white/5"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold font-outfit">Weekly Update</h3>
                        <p className="text-sm text-emerald-100 opacity-80">
                            Slack-ready summary of your week
                        </p>
                    </div>
                </div>
            </div>

            {!update && (
                <>
                    <p className="text-sm text-emerald-100 mb-4">
                        {canGenerate
                            ? `Generate a weekly update from your recent ${decisionCount} decision${decisionCount > 1 ? 's' : ''}.`
                            : 'Log at least 1 decision to generate your weekly update.'}
                    </p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2 text-sm mb-3"
                        >
                            {error}
                        </motion.div>
                    )}

                    <Button
                        onClick={handleGenerate}
                        disabled={loading || !canGenerate}
                        className="w-full bg-white text-emerald-700 hover:bg-emerald-50 border-0"
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Update
                            </>
                        )}
                    </Button>
                </>
            )}

            <AnimatePresence>
                {update && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <MessageSquare className="w-3 h-3" />
                            Based on {decisionsUsed} decision{decisionsUsed > 1 ? 's' : ''} from the past week
                        </div>

                        <div className="bg-black/20 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap border border-white/10">
                            {update}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleCopy}
                                className="flex-1 bg-white text-emerald-700 hover:bg-emerald-50 border-0"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy for Slack
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={() => {
                                    setUpdate(null);
                                    setError('');
                                }}
                                variant="ghost"
                                className="text-white hover:bg-white/10"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="text-xs text-emerald-200/60 mt-3">
                💡 Lower friction than Promotion Package - works with just 1 decision!
            </p>
        </motion.div>
    );
}
