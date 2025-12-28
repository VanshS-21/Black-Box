'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, BarChart3, ChevronDown, Eye, Download, ClipboardCopy, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { useToast } from '@/components/ui/Toast';

interface SavedPackage {
    id: string;
    content: string;
    decisions_count: number;
    created_at: string;
}

export function SavedPackagesCard() {
    const [packages, setPackages] = useState<SavedPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);
    const [viewingPackage, setViewingPackage] = useState<SavedPackage | null>(null);
    const [hasMounted, setHasMounted] = useState(false);
    const { showToast } = useToast();

    // Prevent hydration mismatch with date formatting
    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await fetch('/api/promotion-packages');
            const data = await response.json();
            if (response.ok) {
                setPackages(data.packages || []);
            }
        } catch (err) {
            console.error('Failed to fetch packages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        showToast('Copied to clipboard!', 'success');
    };

    const handleDownload = (pkg: SavedPackage) => {
        const blob = new Blob([pkg.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `promotion-package-${new Date(pkg.created_at).toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Downloaded!', 'success');
    };

    // Format date only on client to prevent hydration mismatch
    const formatDate = (dateStr: string, options: Intl.DateTimeFormatOptions) => {
        if (!hasMounted) return '...';
        return new Date(dateStr).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-2 text-slate-400">
                    <LoadingSpinner size="sm" />
                    <span>Loading saved packages...</span>
                </div>
            </div>
        );
    }

    if (packages.length === 0) {
        return null; // Don't show anything if no packages
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800/50 border border-white/5 rounded-xl overflow-hidden"
            >
                {/* Header */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-white font-outfit">Saved Promotion Packages</h3>
                            <p className="text-sm text-slate-400">{packages.length} package{packages.length !== 1 ? 's' : ''} saved</p>
                        </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Package List */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="border-t border-white/5 p-4 space-y-3">
                                {packages.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        className="flex items-center justify-between bg-slate-800/50 border border-white/5 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                {formatDate(pkg.created_at, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                            <div className="h-4 w-[1px] bg-white/10" />
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <BarChart3 className="w-4 h-4" />
                                                {pkg.decisions_count} decisions
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setViewingPackage(pkg)}
                                                className="text-slate-400 hover:text-white hover:bg-white/10"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCopy(pkg.content)}
                                                className="text-slate-400 hover:text-white hover:bg-white/10"
                                            >
                                                <ClipboardCopy className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDownload(pkg)}
                                                className="text-slate-400 hover:text-white hover:bg-white/10"
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* View Modal */}
            <AnimatePresence>
                {viewingPackage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setViewingPackage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white font-outfit">Promotion Package</h3>
                                    <p className="text-sm text-slate-400 mt-1">
                                        Generated {formatDate(viewingPackage.created_at, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })} • {viewingPackage.decisions_count} decisions analyzed
                                    </p>
                                </div>
                                <button
                                    onClick={() => setViewingPackage(null)}
                                    className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="bg-slate-800/50 border border-white/5 rounded-lg p-6 prose prose-invert prose-sm max-w-none
                                    prose-headings:font-outfit prose-headings:text-white
                                    prose-h1:text-2xl prose-h1:border-b prose-h1:border-indigo-500/50 prose-h1:pb-2 prose-h1:mb-4
                                    prose-h2:text-xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-h2:mt-6
                                    prose-h3:text-lg prose-h3:text-slate-200 prose-h3:mt-4
                                    prose-p:text-slate-300 prose-p:leading-relaxed
                                    prose-strong:text-white prose-strong:font-semibold
                                    prose-ul:text-slate-300 prose-ol:text-slate-300
                                    prose-li:my-1 prose-li:marker:text-indigo-400
                                ">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {viewingPackage.content}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-white/10 flex justify-end gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => handleCopy(viewingPackage.content)}
                                >
                                    <ClipboardCopy className="w-4 h-4 mr-2" /> Copy
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => handleDownload(viewingPackage)}
                                >
                                    <Download className="w-4 h-4 mr-2" /> Download
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
