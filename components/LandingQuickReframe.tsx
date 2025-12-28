'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Sparkles, Copy, Check, AlertCircle, Lock, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/Loading';

interface QuickReframeResult {
    original: string;
    reframed: string;
    weak_phrases: string[];
    power_phrases: string[];
    tip: string;
    remaining?: number;
    signupRequired?: boolean;
}

/**
 * Landing page version of Quick Reframe
 * - Works without login (uses public API)
 * - Shows remaining uses (5/day per IP)
 * - Prompts signup on copy or exhaustion
 */
export function LandingQuickReframe() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<QuickReframeResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [showSignupPrompt, setShowSignupPrompt] = useState(false);
    const [remainingUses, setRemainingUses] = useState<number | null>(null);

    const handleReframe = async () => {
        if (!input.trim() || input.length < 3) {
            setError('Enter at least 3 characters');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);
        setShowSignupPrompt(false);

        try {
            const response = await fetch('/api/ai/quick-reframe-public', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.signupRequired) {
                    setShowSignupPrompt(true);
                    setRemainingUses(0);
                }
                throw new Error(data.error || 'Failed to reframe');
            }

            setResult(data);
            if (data.remaining !== undefined) {
                setRemainingUses(data.remaining);
            }
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
            setShowSignupPrompt(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleReframe();
        }
    };

    return (
        <div className="relative">
            {/* Main card */}
            <div className="bg-slate-900/70 backdrop-blur-2xl border border-violet-500/20 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white font-outfit">Quick Reframe</h3>
                            <p className="text-sm text-slate-400">Translate to executive-speak instantly</p>
                        </div>
                    </div>
                    {remainingUses !== null && (
                        <div className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5">
                            {remainingUses} of 5 free today
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`e.g. "Fixed the login bug" or "Refactored the API to be faster"`}
                            className="min-h-[120px] bg-black/30 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500/50 resize-none text-base"
                            maxLength={500}
                        />
                        <div className="flex justify-between mt-1">
                            <span className="text-xs text-slate-500">Ctrl+Enter to submit</span>
                            <span className="text-xs text-slate-500">{input.length}/500</span>
                        </div>
                    </div>

                    {error && !showSignupPrompt && (
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
                        disabled={loading || input.length < 3 || showSignupPrompt}
                        className={`w-full text-white text-lg py-6 rounded-xl shadow-lg transition-all duration-300 ${loading
                            ? 'bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 bg-[length:200%_auto] animate-gradient shadow-violet-500/20'
                            : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-violet-500/20'
                            }`}
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                <span className="animate-pulse">Reframing with AI...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Reframe for Impact
                            </>
                        )}
                    </Button>
                </div>

                {/* Result */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="mt-6 space-y-4"
                        >
                            {/* Before/After */}
                            <div className="bg-black/30 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
                                {/* Subtle glow behind the card */}
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="mb-3 relative z-10">
                                    <span className="text-xs text-slate-500 uppercase tracking-wide">Your version</span>
                                    <p className="text-slate-400 text-sm mt-1 line-through opacity-70">{result.original}</p>
                                </div>

                                <div className="flex items-center gap-2 my-3 relative z-10">
                                    <div className="h-px bg-gradient-to-r from-violet-500/50 to-transparent flex-1" />
                                    <ArrowRight className="w-4 h-4 text-violet-400" />
                                    <span className="text-xs text-violet-400 font-bold tracking-wider">EXECUTIVE SPEAK</span>
                                    <div className="h-px bg-gradient-to-l from-violet-500/50 to-transparent flex-1" />
                                </div>

                                <div className="relative z-10">
                                    <p className="text-white leading-relaxed text-base font-medium shadow-black drop-shadow-sm">{result.reframed}</p>
                                </div>

                                <div className="flex gap-3 mt-4 relative z-10">
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={handleCopy}
                                            className={`border-0 transition-all ${copied
                                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                : 'bg-white/10 hover:bg-white/20 text-white'
                                                }`}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy Result
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                    <Link href="/auth/signup?from=reframe">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-500/20">
                                                <Save className="w-4 h-4 mr-2" />
                                                Save to Career Vault
                                            </Button>
                                        </motion.div>
                                    </Link>
                                </div>
                            </div>

                            {/* Phrase upgrades */}
                            {result.weak_phrases.length > 0 && (
                                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
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

                {/* Signup prompt overlay */}
                <AnimatePresence>
                    {showSignupPrompt && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-3xl flex items-center justify-center p-8"
                        >
                            <div className="text-center max-w-md">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3 font-outfit">
                                    {remainingUses === 0 ? "You've used all free reframes" : "Love it? There's more!"}
                                </h3>
                                <p className="text-slate-400 mb-6">
                                    {remainingUses === 0
                                        ? "Sign up for unlimited Quick Reframes, AI decision structuring, and promotion package generation."
                                        : "Sign up for free to save your reframes, structure full decisions, and generate promotion packages."}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link href="/auth/signup">
                                        <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8">
                                            Sign Up Free
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                    {remainingUses !== 0 && (
                                        <Button
                                            variant="ghost"
                                            className="text-slate-400 hover:text-white"
                                            onClick={() => setShowSignupPrompt(false)}
                                        >
                                            Keep Trying
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
