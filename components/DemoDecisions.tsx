'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lightbulb, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Sample decisions to show new users what the platform looks like
const sampleDecisions = [
    {
        id: 'demo-1',
        title: 'Migrated from REST to GraphQL for Mobile API',
        decision_made: 'Adopted GraphQL to reduce API round trips from 8 to 1 for the mobile home screen, improving load time by 60%.',
        context: 'Mobile app was making too many network requests, causing slow load times on poor connections.',
        tags: ['architecture', 'performance', 'mobile'],
        confidence_level: 8,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        icon: TrendingUp,
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'demo-2',
        title: 'Chose PostgreSQL over MongoDB for User Data',
        decision_made: 'Selected PostgreSQL with JSONB columns for user profiles, getting relational integrity with flexible schema where needed.',
        context: 'Needed to balance structured billing data with flexible user preferences.',
        tags: ['database', 'infrastructure'],
        confidence_level: 9,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        icon: Shield,
        gradient: 'from-violet-500 to-purple-500',
    },
    {
        id: 'demo-3',
        title: 'Implemented Feature Flags Instead of Branch Deploys',
        decision_made: 'Deployed LaunchDarkly feature flags enabling 10x faster rollouts and instant rollback capabilities.',
        context: 'Long-running feature branches were causing merge conflicts and deployment delays.',
        tags: ['devops', 'process', 'risk-reduction'],
        confidence_level: 7,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        icon: Lightbulb,
        gradient: 'from-amber-500 to-orange-500',
    },
];

export function DemoDecisions() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>Sample Decisions - See what others log</span>
                </div>
                <h3 className="text-xl font-bold text-white font-outfit mb-2">
                    Your dashboard will look like this
                </h3>
                <p className="text-slate-400 max-w-lg mx-auto">
                    These are example decisions. Create your first real entry to get started!
                </p>
            </div>

            {/* Sample Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                {sampleDecisions.map((decision, idx) => (
                    <motion.div
                        key={decision.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all group"
                    >
                        {/* Demo Badge */}
                        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-slate-800 border border-white/10 rounded-full text-xs text-slate-400">
                            Sample
                        </div>

                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${decision.gradient} flex items-center justify-center mb-4`}>
                            <decision.icon className="w-5 h-5 text-white" />
                        </div>

                        {/* Title */}
                        <h4 className="font-semibold text-white mb-2 line-clamp-2 font-outfit">
                            {decision.title}
                        </h4>

                        {/* Decision */}
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                            {decision.decision_made}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                            {decision.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-slate-400"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Confidence */}
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Confidence: {decision.confidence_level}/10</span>
                            <span>{new Date(decision.created_at).toLocaleDateString()}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <div className="text-center pt-6">
                <Link href="/dashboard/new">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20"
                        >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Create Your First Real Decision
                        </Button>
                    </motion.div>
                </Link>
                <p className="text-xs text-slate-500 mt-3">
                    These sample cards will disappear after you log your first decision
                </p>
            </div>
        </div>
    );
}
