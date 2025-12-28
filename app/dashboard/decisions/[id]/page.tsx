'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Pencil,
    Lock,
    Unlock,
    Printer,
    Trash2,
    AlertTriangle,
    Save,
    FileText,
    Sparkles,
    XCircle,
    CheckCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { Decision } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FadeIn } from '@/components/ui/FadeIn';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

export default function DecisionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [decision, setDecision] = useState<Decision | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState('');

    // Edit form state
    const [title, setTitle] = useState('');
    const [decisionMade, setDecisionMade] = useState('');
    const [context, setContext] = useState('');
    const [tradeOffs, setTradeOffs] = useState('');
    const [biggestRisk, setBiggestRisk] = useState('');
    const [stakeholders, setStakeholders] = useState('');
    const [confidenceLevel, setConfidenceLevel] = useState(5);
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (user && params.id) {
            fetchDecision();
        }
    }, [user, params.id]);

    const fetchDecision = async () => {
        try {
            const session = await fetch('/api/auth/session').then(r => r.json());
            const response = await fetch(`/api/decisions/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDecision(data);
                // Initialize edit form
                setTitle(data.title);
                setDecisionMade(data.decision_made);
                setContext(data.context);
                setTradeOffs(data.trade_offs);
                setBiggestRisk(data.biggest_risk);
                setStakeholders(data.stakeholders || '');
                setConfidenceLevel(data.confidence_level || 5);
                setTags(data.tags?.join(', ') || '');
            } else {
                setError('Decision not found');
            }
        } catch (err) {
            console.error('Error fetching decision:', err);
            setError('Failed to load decision');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleLock = async () => {
        try {
            const session = await fetch('/api/auth/session').then(r => r.json());
            const response = await fetch(`/api/decisions/${params.id}/lock`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                const updated = await response.json();
                setDecision(updated);
                setEditing(false);
                showToast(updated.is_locked ? 'Decision locked' : 'Decision unlocked', 'success');
            }
        } catch (err) {
            console.error('Error toggling lock:', err);
            showToast('Failed to update lock status', 'error');
        }
    };

    const handleSave = async () => {
        if (!title || !decisionMade || !context || !tradeOffs || !biggestRisk) {
            setError('Please fill in all required fields');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const session = await fetch('/api/auth/session').then(r => r.json());
            const tagArray = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

            const response = await fetch(`/api/decisions/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
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
                }),
            });

            if (response.ok) {
                const updated = await response.json();
                setDecision(updated);
                setEditing(false);
                showToast('Changes saved successfully!', 'success');
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to save changes');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            const session = await fetch('/api/auth/session').then(r => r.json());
            const response = await fetch(`/api/decisions/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                showToast('Decision deleted', 'success');
                router.push('/dashboard');
            }
        } catch (err) {
            console.error('Error deleting decision:', err);
            showToast('Failed to delete decision', 'error');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30 text-slate-200">
                <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />

                <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <Skeleton className="h-8 w-48" />
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
                        <Skeleton className="h-10 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-48 mb-8" />
                        <SkeletonText lines={4} className="mb-6" />
                        <SkeletonText lines={3} className="mb-6" />
                        <SkeletonText lines={2} />
                    </div>
                </main>
            </div>
        );
    }

    if (error && !decision) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <FadeIn>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 font-outfit">{error}</h2>
                        <Link href="/dashboard">
                            <Button variant="primary">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </FadeIn>
            </div>
        );
    }

    if (!decision) return null;

    const formattedDate = new Date(decision.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30 text-slate-200">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-full h-[500px] bg-violet-900/10 blur-[100px] pointer-events-none" />

            {/* Header - Hidden on print */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl no-print">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-md shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow" />
                                <span className="text-lg font-bold text-white tracking-tight font-outfit group-hover:text-indigo-400 transition-colors hidden sm:inline">Career Black Box</span>
                            </Link>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5">
                                    <ArrowLeft className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            {!decision.is_locked && !editing && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                                        <Pencil className="w-4 h-4 mr-2" /> Edit
                                    </Button>
                                </motion.div>
                            )}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant={decision.is_locked ? 'secondary' : 'outline'}
                                    size="sm"
                                    onClick={handleToggleLock}
                                    className={!decision.is_locked ? 'border-white/10 text-slate-300 hover:bg-white/5' : ''}
                                >
                                    {decision.is_locked ? (
                                        <><Unlock className="w-4 h-4 mr-2" /> Unlock</>
                                    ) : (
                                        <><Lock className="w-4 h-4 mr-2" /> Lock</>
                                    )}
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" size="sm" onClick={handlePrint} className="border-white/10 text-slate-300 hover:bg-white/5">
                                    <Printer className="w-4 h-4 mr-2" /> Print
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <FadeIn>
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl shadow-xl p-8 print:shadow-none print:bg-white print:border-gray-200 print:text-black">
                        {/* Badges */}
                        <div className="flex gap-2 mb-4 no-print">
                            {decision.is_locked && (
                                <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm font-medium border border-white/5 flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> Locked
                                </span>
                            )}
                            {decision.ai_structured && (
                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/20 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" /> AI-Structured
                                </span>
                            )}
                        </div>

                        {/* Editing Mode */}
                        {editing ? (
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-4 flex items-center gap-3"
                                >
                                    <Pencil className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                                    <p className="text-sm text-indigo-300">
                                        <strong>Edit Mode</strong> - Make changes and save, or cancel to discard.
                                    </p>
                                </motion.div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Decision Title *
                                    </label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Brief title for this decision"
                                        className="bg-black/20 border-white/10 text-white placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        What Was Decided? *
                                    </label>
                                    <Textarea
                                        value={decisionMade}
                                        onChange={(e) => setDecisionMade(e.target.value)}
                                        className="min-h-[80px] bg-black/20 border-white/10 text-white placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Context *
                                    </label>
                                    <Textarea
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        className="min-h-[100px] bg-black/20 border-white/10 text-white placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Trade-offs *
                                    </label>
                                    <Textarea
                                        value={tradeOffs}
                                        onChange={(e) => setTradeOffs(e.target.value)}
                                        className="min-h-[100px] bg-black/20 border-white/10 text-white placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Biggest Risk *
                                    </label>
                                    <Textarea
                                        value={biggestRisk}
                                        onChange={(e) => setBiggestRisk(e.target.value)}
                                        className="min-h-[80px] bg-black/20 border-white/10 text-white placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Stakeholders
                                    </label>
                                    <Input
                                        value={stakeholders}
                                        onChange={(e) => setStakeholders(e.target.value)}
                                        className="bg-black/20 border-white/10 text-white placeholder:text-slate-600"
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
                                        Tags
                                    </label>
                                    <Input
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="comma, separated, tags"
                                        className="bg-black/20 border-white/10 text-white placeholder:text-slate-600"
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
                                            variant="primary"
                                            size="lg"
                                            className="w-full"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </motion.div>
                                    <Button
                                        onClick={() => {
                                            setEditing(false);
                                            setError('');
                                            // Reset form to original values
                                            setTitle(decision.title);
                                            setDecisionMade(decision.decision_made);
                                            setContext(decision.context);
                                            setTradeOffs(decision.trade_offs);
                                            setBiggestRisk(decision.biggest_risk);
                                            setStakeholders(decision.stakeholders || '');
                                            setConfidenceLevel(decision.confidence_level || 5);
                                            setTags(decision.tags?.join(', ') || '');
                                        }}
                                        variant="outline"
                                        size="lg"
                                        className="border-white/10 text-slate-300 hover:bg-white/5"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* View Mode */
                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2 print:text-4xl print:text-black font-outfit">
                                        {decision.title}
                                    </h1>
                                    <p className="text-sm text-slate-500">
                                        Logged on {formattedDate}
                                    </p>
                                </div>

                                {/* Decision Made */}
                                <div className="border-l-4 border-indigo-500 pl-4">
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
                                        Decision
                                    </h2>
                                    <p className="text-white text-lg leading-relaxed print:text-black">
                                        {decision.decision_made}
                                    </p>
                                </div>

                                {/* Context */}
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
                                        Context
                                    </h2>
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap print:text-gray-800">
                                        {decision.context}
                                    </p>
                                </div>

                                {/* Trade-offs */}
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
                                        Trade-offs
                                    </h2>
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap print:text-gray-800">
                                        {decision.trade_offs}
                                    </p>
                                </div>

                                {/* Biggest Risk */}
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 print:border print:border-gray-300 print:bg-amber-50">
                                    <h2 className="text-sm font-semibold text-amber-400 uppercase mb-2 print:text-amber-800 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" /> Biggest Risk
                                    </h2>
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap print:text-gray-800">
                                        {decision.biggest_risk}
                                    </p>
                                </div>

                                {/* Stakeholders */}
                                {decision.stakeholders && (
                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
                                            Stakeholders
                                        </h2>
                                        <p className="text-slate-300 print:text-gray-800">
                                            {decision.stakeholders}
                                        </p>
                                    </div>
                                )}

                                {/* Confidence Level */}
                                {decision.confidence_level && (
                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
                                            Confidence Level
                                        </h2>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 bg-slate-800 rounded-full h-3 max-w-xs print:bg-gray-200 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${decision.confidence_level * 10}%` }}
                                                    transition={{ duration: 0.5 }}
                                                    className="bg-indigo-500 h-3 rounded-full print:bg-blue-600"
                                                />
                                            </div>
                                            <span className="text-lg font-semibold text-white print:text-black">
                                                {decision.confidence_level}/10
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {decision.tags && decision.tags.length > 0 && (
                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
                                            Tags
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {decision.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-sm border border-indigo-500/20 print:border print:border-blue-300 print:text-blue-700"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Original Input (if AI-structured) */}
                                {decision.original_input && (
                                    <details className="border-t border-white/5 pt-4 no-print">
                                        <summary className="text-sm font-semibold text-slate-400 uppercase cursor-pointer hover:text-indigo-400 flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Original Input (AI-Structured)
                                        </summary>
                                        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-white/5">
                                            <p className="text-slate-400 text-sm whitespace-pre-wrap">
                                                {decision.original_input}
                                            </p>
                                        </div>
                                    </details>
                                )}
                            </div>
                        )}
                    </div>
                </FadeIn>
            </main>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 no-print"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-md mx-4 shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-2 font-outfit">
                                Delete Decision?
                            </h3>
                            <p className="text-slate-400 mb-6">
                                This action cannot be undone. Are you sure you want to delete "{decision.title}"?
                            </p>
                            <div className="flex gap-4">
                                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        onClick={handleDelete}
                                        variant="danger"
                                        size="lg"
                                        className="w-full"
                                    >
                                        Yes, Delete
                                    </Button>
                                </motion.div>
                                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        variant="outline"
                                        size="lg"
                                        className="w-full border-white/10 text-slate-300 hover:bg-white/5"
                                    >
                                        Cancel
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
