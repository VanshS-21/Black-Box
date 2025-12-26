'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, XCircle, Sparkles, Lock, Lightbulb, BarChart3, Rocket, ClipboardCopy, Download, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { useToast } from '@/components/ui/Toast';

interface PromotionPackageGeneratorProps {
    decisionCount: number;
}

export function PromotionPackageGenerator({ decisionCount }: PromotionPackageGeneratorProps) {
    const [showModal, setShowModal] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedPackage, setGeneratedPackage] = useState<string | null>(null);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const handleGenerate = async () => {
        setGenerating(true);
        setError('');

        try {
            const session = await fetch('/api/auth/session').then(r => r.json());
            const response = await fetch('/api/ai/promotion-package', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate package');
            }

            setGeneratedPackage(data.package);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to generate package';
            setError(message);
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = () => {
        if (generatedPackage) {
            navigator.clipboard.writeText(generatedPackage);
            showToast('Copied to clipboard!', 'success');
        }
    };

    const handleDownload = () => {
        if (generatedPackage) {
            const blob = new Blob([generatedPackage], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `promotion-package-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Downloaded successfully!', 'success');
        }
    };

    const canGenerate = decisionCount >= 10;

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white shadow-lg border border-white/10"
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 font-outfit flex items-center gap-2">
                            <Target className="w-6 h-6" /> AI Promotion Package
                        </h3>
                        <p className="text-indigo-100 mb-4">
                            Generate a professional self-review document showcasing your decision-making quality.
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/20 rounded-lg px-4 py-2">
                                <div className="text-sm text-indigo-100">Your Decisions</div>
                                <div className="text-2xl font-bold">{decisionCount}</div>
                            </div>
                            <div className="text-sm text-indigo-100 flex items-center gap-2">
                                {canGenerate ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-emerald-300" />
                                        Ready to generate
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4 text-red-300" />
                                        Need {10 - decisionCount} more decisions
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        onClick={() => setShowModal(true)}
                        disabled={!canGenerate}
                        variant="primary"
                        size="lg"
                        className="bg-white text-indigo-600 hover:bg-slate-100 border-0 shadow-lg"
                    >
                        {canGenerate ? (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" /> Generate Promotion Package
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4 mr-2" /> Need 10+ Decisions
                            </>
                        )}
                    </Button>
                </motion.div>

                <p className="text-xs text-indigo-200 mt-3 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Free while in beta. Normally ₹500 per generation.
                </p>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
                                        {generatedPackage ? (
                                            <>
                                                <CheckCircle className="w-6 h-6 text-emerald-400" /> Your Promotion Package
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-6 h-6 text-amber-400" /> Generate Promotion Package
                                            </>
                                        )}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setGeneratedPackage(null);
                                            setError('');
                                        }}
                                        className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {!generatedPackage && !generating && (
                                    <div className="space-y-4">
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                                            <h4 className="font-semibold text-indigo-300 mb-2">What You'll Get:</h4>
                                            <ul className="space-y-2 text-sm text-indigo-200">
                                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Executive summary of your decision-making quality</li>
                                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Pattern analysis backed by specific examples</li>
                                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Growth trajectory over time</li>
                                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Impact & outcomes from your decisions</li>
                                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Risk management assessment</li>
                                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Professional format ready for performance reviews</li>
                                            </ul>
                                        </div>

                                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                            <h4 className="font-semibold text-green-300 mb-2 flex items-center gap-2">
                                                <BarChart3 className="w-4 h-4" /> Your Data:
                                            </h4>
                                            <p className="text-sm text-green-200">
                                                Analyzing <strong>{decisionCount} decisions</strong> from your Career Black Box
                                            </p>
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

                                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                            <Button
                                                onClick={handleGenerate}
                                                disabled={generating}
                                                variant="primary"
                                                size="lg"
                                                className="w-full"
                                            >
                                                <Rocket className="w-4 h-4 mr-2" /> Generate Now (Free)
                                            </Button>
                                        </motion.div>
                                    </div>
                                )}

                                {generating && (
                                    <div className="text-center py-12">
                                        <LoadingSpinner size="lg" />
                                        <p className="mt-4 text-slate-300 font-medium">
                                            AI is analyzing your {decisionCount} decisions...
                                        </p>
                                        <p className="text-sm text-slate-500 mt-2">
                                            This may take 15-30 seconds
                                        </p>
                                    </div>
                                )}

                                {generatedPackage && (
                                    <div className="space-y-4">
                                        <div className="bg-slate-800/50 border border-white/5 rounded-lg p-6 max-h-[400px] overflow-y-auto">
                                            <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans leading-relaxed">
                                                {generatedPackage}
                                            </pre>
                                        </div>

                                        <div className="flex gap-4">
                                            <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                                <Button
                                                    onClick={handleCopy}
                                                    variant="secondary"
                                                    size="lg"
                                                    className="w-full"
                                                >
                                                    <ClipboardCopy className="w-4 h-4 mr-2" /> Copy to Clipboard
                                                </Button>
                                            </motion.div>
                                            <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                                <Button
                                                    onClick={handleDownload}
                                                    variant="primary"
                                                    size="lg"
                                                    className="w-full"
                                                >
                                                    <Download className="w-4 h-4 mr-2" /> Download as .txt
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
