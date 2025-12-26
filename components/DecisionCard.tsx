import Link from 'next/link';
import { Decision } from '@/lib/supabase/client';

interface DecisionCardProps {
    decision: Decision;
}

export function DecisionCard({ decision }: DecisionCardProps) {
    const formattedDate = new Date(decision.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <Link href={`/dashboard/decisions/${decision.id}`}>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group shadow-lg shadow-black/20 hover:shadow-indigo-500/10">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors flex-1 font-outfit truncate pr-4">
                        {decision.title}
                    </h3>
                    <div className="flex items-center gap-1">
                        {decision.is_locked && (
                            <span className="flex-shrink-0 text-slate-500" title="Locked">
                                🔒
                            </span>
                        )}
                        {decision.ai_structured && (
                            <span className="flex-shrink-0 text-violet-400 animate-pulse" title="AI-structured">
                                ✨
                            </span>
                        )}
                    </div>
                </div>

                <div className="mb-4 text-xs font-mono text-slate-500 flex items-center justify-between">
                    <span className="uppercase tracking-wider">LOG_ID: {decision.id.slice(0, 8)}</span>
                    <span>{formattedDate}</span>
                </div>

                <p className="text-sm text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                    {decision.decision_made}
                </p>

                <div className="flex items-center justify-between text-xs pt-4 border-t border-white/5">
                    {decision.tags && decision.tags.length > 0 ? (
                        <div className="flex gap-1">
                            {decision.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded text-[10px] uppercase tracking-wide font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                            {decision.tags.length > 3 && (
                                <span className="px-2 py-1 bg-white/5 text-slate-400 rounded text-[10px]">
                                    +{decision.tags.length - 3}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-slate-600 italic">No tags</span>
                    )}
                </div>

                {decision.confidence_level && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">Confidence</span>
                        <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${decision.confidence_level >= 8 ? 'bg-emerald-500' :
                                        decision.confidence_level >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${decision.confidence_level * 10}%` }}
                            />
                        </div>
                        <span className="text-xs font-mono text-slate-300">
                            {decision.confidence_level}/10
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}
