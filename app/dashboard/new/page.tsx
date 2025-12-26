'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, PenLine, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { VibeInput } from '@/components/VibeInput';
import { CoachingFeedback } from '@/components/CoachingFeedback';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { StructuredDecision } from '@/lib/ai/gemini';
import { FadeIn } from '@/components/ui/FadeIn';
import { useToast } from '@/components/ui/Toast';

export default function NewDecisionPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [mode, setMode] = useState<'ai' | 'manual'>('ai');
    const [structured, setStructured] = useState<(StructuredDecision & { original_input: string }) | null>(null);

    // Form fields
    const [title, setTitle] = useState('');
    const [decisionMade, setDecisionMade] = useState('');
    const [context, setContext] = useState('');
    const [tradeOffs, setTradeOffs] = useState('');
    const [biggestRisk, setBiggestRisk] = useState('');
    const [stakeholders, setStakeholders] = useState('');
    const [confidenceLevel, setConfidenceLevel] = useState(5);
    const [tags, setTags] = useState('');

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleAIStructured = (data: StructuredDecision & { original_input: string }) => {
        setStructured(data);
        setTitle(data.title);
        setDecisionMade(data.decision_made);
        setContext(data.context);
        setTradeOffs(data.trade_offs);
        setBiggestRisk(data.biggest_risk);
        setStakeholders(data.stakeholders || '');
        setConfidenceLevel(data.confidence_level);
        setTags(data.tags.join(', '));
    };

    // Handle accepting AI's reframed decision
    const handleAcceptReframe = (reframedText: string) => {
        setDecisionMade(reframedText);
    };

    const handleSave = async () => {
        if (!title || !decisionMade || !context || !tradeOffs || !biggestRisk) {
            setError('Please fill in all required fields');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const tagArray = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

            const response = await fetch('/api/decisions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    decision_made: decisionMade,
                    context,
                    trade_offs: tradeOffs,
                    biggest_risk: biggestRisk,
                    stakeholders: stakeholders || null,
                    confidence_level: confidenceLevel,
                    tags: tagArray,
                    original_input: structured?.original_input || null,
                    ai_structured: !!structured,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save decision');
            }

            const decision = await response.json();
            showToast('Decision saved successfully!', 'success');
            router.push(`/dashboard/decisions/${decision.id}`);
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30 text-slate-200">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-full h-[500px] bg-violet-900/10 blur-[100px] pointer-events-none" />

            <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-white font-outfit">New Decision</h1>
                            <p className="text-sm text-slate-400">Add a new entry to your flight recorder</p>
                        </div>
                        <Link href="/dashboard">
                            <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <FadeIn>
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl shadow-xl p-8">
                        {/* Mode Toggle */}
                        {!structured && (
                            <div className="mb-8 flex gap-2 border-b border-white/5 pb-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setMode('ai')}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${mode === 'ai'
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Sparkles className="w-4 h-4" /> AI-Assisted (Recommended)
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setMode('manual')}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${mode === 'manual'
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <PenLine className="w-4 h-4" /> Manual Entry
                                </motion.button>
                            </div>
                        )}

                        {/* AI Mode */}
                        {mode === 'ai' && !structured && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4 font-outfit">
                                    Describe your decision naturally
                                </h2>
                                <VibeInput onStructured={handleAIStructured} />
                            </div>
                        )}

                        {/* Manual Mode or Editing AI Output */}
                        {(mode === 'manual' || structured) && (
                            <div className="space-y-6">
                                {structured && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4 flex items-center gap-3"
                                        >
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                            <p className="text-sm text-green-300">
                                                <strong>AI has structured your decision!</strong> Review the coaching feedback below, then edit and save.
                                            </p>
                                        </motion.div>

                                        {/* AI Coaching Feedback */}
                                        <CoachingFeedback
                                            coaching={structured.coaching}
                                            originalDecision={structured.decision_made}
                                            onAcceptReframe={handleAcceptReframe}
                                        />

                                        <hr className="border-white/10 my-6" />
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Decision Title *
                                    </label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Brief title for this decision"
                                        required
                                        className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        What Was Decided? *
                                    </label>
                                    <Textarea
                                        value={decisionMade}
                                        onChange={(e) => setDecisionMade(e.target.value)}
                                        placeholder="Describe what you decided in 1-2 sentences"
                                        className="min-h-[80px] bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Context *
                                    </label>
                                    <Textarea
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        placeholder="What was the situation? What constraints did you have?"
                                        className="min-h-[100px] bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Trade-offs *
                                    </label>
                                    <Textarea
                                        value={tradeOffs}
                                        onChange={(e) => setTradeOffs(e.target.value)}
                                        placeholder="What did you give up or compromise on?"
                                        className="min-h-[100px] bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Biggest Risk *
                                    </label>
                                    <Textarea
                                        value={biggestRisk}
                                        onChange={(e) => setBiggestRisk(e.target.value)}
                                        placeholder="What is the main risk you're accepting with this decision?"
                                        className="min-h-[80px] bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Stakeholders (Optional)
                                    </label>
                                    <Input
                                        value={stakeholders}
                                        onChange={(e) => setStakeholders(e.target.value)}
                                        placeholder="Who was involved or affected?"
                                        className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Confidence Level: {confidenceLevel}/10
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={confidenceLevel}
                                        onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Tags (Optional)
                                    </label>
                                    <Input
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="architecture, database, frontend (comma-separated)"
                                        className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50"
                                    />
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <div className="flex gap-4">
                                    <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                        <Button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                                            size="lg"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {saving ? 'Saving...' : 'Save Decision'}
                                        </Button>
                                    </motion.div>
                                    {structured && (
                                        <Button
                                            onClick={() => setStructured(null)}
                                            variant="outline"
                                            size="lg"
                                            className="border-white/10 text-slate-300 hover:bg-white/5"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Start Over
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </FadeIn>
            </main>
        </div>
    );
}
