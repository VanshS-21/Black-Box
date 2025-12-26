'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface PromotionPackageGeneratorProps {
    decisionCount: number;
}

export function PromotionPackageGenerator({ decisionCount }: PromotionPackageGeneratorProps) {
    const [showModal, setShowModal] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedPackage, setGeneratedPackage] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

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
        } catch (err: any) {
            setError(err.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = () => {
        if (generatedPackage) {
            navigator.clipboard.writeText(generatedPackage);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
        }
    };

    const canGenerate = decisionCount >= 10;

    return (
        <>
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white shadow-lg border border-white/10">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 font-outfit">🎯 AI Promotion Package</h3>
                        <p className="text-indigo-100 mb-4">
                            Generate a professional self-review document showcasing your decision-making quality.
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/20 rounded-lg px-4 py-2">
                                <div className="text-sm text-indigo-100">Your Decisions</div>
                                <div className="text-2xl font-bold">{decisionCount}</div>
                            </div>
                            <div className="text-sm text-indigo-100">
                                {canGenerate ? '✅ Ready to generate' : `❌ Need ${10 - decisionCount} more decisions`}
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => setShowModal(true)}
                    disabled={!canGenerate}
                    variant="primary"
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-slate-100 border-0 shadow-lg"
                >
                    {canGenerate ? '✨ Generate Promotion Package' : '🔒 Need 10+ Decisions'}
                </Button>

                <p className="text-xs text-indigo-200 mt-3">
                    💡 Free while in beta. Normally $5 per generation.
                </p>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-white font-outfit">
                                    {generatedPackage ? '✅ Your Promotion Package' : '⚡ Generate Promotion Package'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setGeneratedPackage(null);
                                        setError('');
                                    }}
                                    className="text-slate-400 hover:text-white text-2xl transition-colors"
                                >
                                    ×
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
                                            <li>✅ Executive summary of your decision-making quality</li>
                                            <li>✅ Pattern analysis backed by specific examples</li>
                                            <li>✅ Growth trajectory over time</li>
                                            <li>✅ Impact & outcomes from your decisions</li>
                                            <li>✅ Risk management assessment</li>
                                            <li>✅ Professional format ready for performance reviews</li>
                                        </ul>
                                    </div>

                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                        <h4 className="font-semibold text-green-300 mb-2">📊 Your Data:</h4>
                                        <p className="text-sm text-green-200">
                                            Analyzing <strong>{decisionCount} decisions</strong> from your Career Black Box
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleGenerate}
                                        disabled={generating}
                                        variant="primary"
                                        size="lg"
                                        className="w-full"
                                    >
                                        {generating ? 'Generating...' : '🚀 Generate Now (Free)'}
                                    </Button>
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
                                        <Button
                                            onClick={handleCopy}
                                            variant="secondary"
                                            size="lg"
                                            className="flex-1"
                                        >
                                            {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
                                        </Button>
                                        <Button
                                            onClick={handleDownload}
                                            variant="primary"
                                            size="lg"
                                            className="flex-1"
                                        >
                                            💾 Download as .txt
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
