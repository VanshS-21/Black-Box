'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Sparkles, Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/Loading';
import { useToast } from '@/components/ui/Toast';

interface QuickReframeResult {
    original: string;
    reframed: string;
    weak_phrases: string[];
    power_phrases: string[];
    tip: string;
}

export function QuickReframe() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<QuickReframeResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();

    const handleReframe = async () => {
        if (!input.trim() || input.length < 3) {
            setError('Enter at least 3 characters');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('/api/ai/quick-reframe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reframe');
            }

            setResult(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (result?.reframed) {
            navigator.clipboard.writeText(result.reframed);
            setCopied(true);
            showToast('Copied to clipboard!', 'success');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleReframe();
        }
    };

    return (
        <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white font-outfit">Quick Reframe</h3>
                    <p className="text-sm text-slate-400">Translate to executive-speak instantly</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Paste a commit message, Slack update, or describe what you did...

Examples:
• Fixed the login bug
• Refactored the API
• Improved database performance"
                        className="min-h-[100px] bg-black/30 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500/50 resize-none"
                        maxLength={500}
                    />
                    <div className="flex justify-between mt-1">
                        <span className="text-xs text-slate-500">Ctrl+Enter to submit</span>
                        <span className="text-xs text-slate-500">{input.length}/500</span>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </motion.div>
                )}

                <Button
                    onClick={handleReframe}
                    disabled={loading || input.length < 3}
                    className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white"
                >
                    {loading ? (
                        <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Reframing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Reframe for Impact
                        </>
                    )}
                </Button>
            </div>

            {/* Result */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 space-y-4"
                    >
                        {/* Before/After */}
                        <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                            <div className="mb-3">
                                <span className="text-xs text-slate-500 uppercase tracking-wide">Your version</span>
                                <p className="text-slate-400 text-sm mt-1 line-through opacity-70">{result.original}</p>
                            </div>

                            <div className="flex items-center gap-2 my-2">
                                <ArrowRight className="w-4 h-4 text-violet-400" />
                                <span className="text-xs text-violet-400 font-medium">EXECUTIVE SPEAK</span>
                            </div>

                            <div>
                                <p className="text-white leading-relaxed">{result.reframed}</p>
                            </div>

                            <Button
                                onClick={handleCopy}
                                variant="ghost"
                                size="sm"
                                className="mt-3 text-slate-400 hover:text-white hover:bg-white/5"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2 text-emerald-400" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Phrase upgrades */}
                        {result.weak_phrases.length > 0 && (
                            <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                                <span className="text-xs text-amber-400 uppercase tracking-wide font-medium">Phrase Upgrades</span>
                                <div className="mt-2 space-y-1">
                                    {result.weak_phrases.map((weak, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <span className="text-red-400 line-through">{weak}</span>
                                            <ArrowRight className="w-3 h-3 text-slate-600" />
                                            <span className="text-emerald-400">{result.power_phrases[idx] || '(add metrics)'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tip */}
                        <div className="flex items-start gap-2 text-sm">
                            <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{result.tip}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
