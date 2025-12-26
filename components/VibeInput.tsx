'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { StructuredDecision } from '@/lib/ai/gemini';

interface VibeInputProps {
    onStructured: (data: StructuredDecision & { original_input: string }) => void;
}

export function VibeInput({ onStructured }: VibeInputProps) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStructure = async () => {
        if (input.trim().length < 50) {
            setError('Please write at least 50 characters to help me understand your decision');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/ai/structure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rawInput: input }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to structure decision');
            }

            const structured = await response.json();
            onStructured(structured);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">
                        Tell me about your decision
                    </label>
                    <span className="text-xs text-slate-500">{input.length} characters</span>
                </div>
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Just write naturally... For example: 'Last week I decided to use PostgreSQL instead of MongoDB for our new project. We needed better transaction support and our data is relational anyway. The team was initially skeptical because they're more familiar with Mongo, but I think the better data integrity is worth the learning curve. My biggest concern is the migration time...'"
                    className="min-h-[200px] bg-black/20 border-white/10 text-white placeholder:text-slate-600"
                />
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span><strong className="text-slate-300">Tip:</strong> Write 2-3 paragraphs about your decision. I'll structure it for you!</span>
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
                    onClick={handleStructure}
                    disabled={loading || input.trim().length < 50}
                    variant="primary"
                    size="lg"
                    className="w-full"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            AI is structuring your decision...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Structure This for Me
                        </span>
                    )}
                </Button>
            </motion.div>
        </div>
    );
}
