import { Metadata } from 'next';
import Link from 'next/link';
import { Package, Box, ArrowRight, Sparkles, BookOpen, GitBranch, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'AI-Powered Architecture Decision Record (ADR) Template | Career Black Box',
    description: 'Document your architectural decisions with AI assistance. Turn "I chose X over Y" into a comprehensive ADR with context, trade-offs, and risks automatically structured.',
    keywords: ['ADR template', 'architecture decision record', 'software architecture', 'technical documentation', 'decision logging'],
    openGraph: {
        title: 'AI-Powered ADR Template | Career Black Box',
        description: 'Document architectural decisions that survive employee turnover.',
        type: 'website',
    },
};

const adrExample = {
    title: 'ADR: Choosing PostgreSQL over MongoDB for User Data',
    context: `## Context
We need to store user profiles, authentication data, and decision logs with complex relationships: users → decisions → tags, teams → members.

## Options Considered
1. **PostgreSQL**: ACID compliance, strong relationships, proven at scale
2. **MongoDB**: Flexible schema, good for rapid prototyping
3. **DynamoDB**: Serverless, but vendor lock-in concerns`,
    decision: `We decided to go with PostgreSQL because:
- Strong foreign key constraints for data integrity
- Better query performance for our relational data model
- Supabase provides excellent PostgreSQL-as-a-service with RLS`,
    tradeoffs: `## Accepted Trade-offs
- Less schema flexibility (acceptable: our schema is well-defined)
- Horizontal scaling is harder (acceptable at our current scale)

## Rejected alternatives
- MongoDB was rejected: we'd lose referential integrity benefits`,
    risk: 'The main risk is scaling beyond single-node capacity. We mitigate this by using read replicas and connection pooling.',
};

const features = [
    {
        icon: Box,
        title: 'Structured Automatically',
        description: 'Just describe your decision naturally. AI extracts context, options, trade-offs, and risks.',
    },
    {
        icon: GitBranch,
        title: 'Version Control Compatible',
        description: 'Export ADRs as markdown. Store them alongside your code in git for full history.',
    },
    {
        icon: Shield,
        title: 'Survives Turnover',
        description: 'When engineers leave, their context stays. ADRs become institutional knowledge.',
    },
    {
        icon: BookOpen,
        title: 'Searchable History',
        description: 'Find any architectural decision instantly. Never ask "why did we choose X?" again.',
    },
];

export default function ADRTemplatePage() {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/15 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Navigation */}
            <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight font-outfit">Career Black Box</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link href="/auth/login">
                                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/25">
                                    Get Started Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6">
                        <Box className="w-4 h-4" />
                        <span>Architecture Decision Records</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-outfit leading-tight">
                        AI-Powered{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            ADR Template
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                        Document architectural decisions that survive employee turnover. AI structures your thoughts into
                        comprehensive ADRs with context, trade-offs, and risks.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-lg px-8 py-6 h-auto shadow-xl shadow-blue-500/25 rounded-xl">
                                Create Your First ADR
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/#try-it">
                            <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 text-lg px-8 py-6 h-auto rounded-xl">
                                Try AI Structuring Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Example ADR */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2 font-outfit">Example: Database Selection ADR</h2>
                        <p className="text-slate-400">See how Career Black Box structures an architectural decision</p>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
                        {/* ADR Header */}
                        <div className="bg-gradient-to-r from-blue-950/80 to-indigo-950/80 px-6 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                    <Box className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{adrExample.title}</h3>
                                    <p className="text-sm text-slate-400">Architecture Decision Record</p>
                                </div>
                            </div>
                        </div>

                        {/* ADR Content */}
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-blue-400 uppercase tracking-wide mb-2">Context & Options</h4>
                                <div className="text-slate-300 whitespace-pre-line text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {adrExample.context}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-emerald-400 uppercase tracking-wide mb-2">Decision Made</h4>
                                <div className="text-slate-300 whitespace-pre-line text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {adrExample.decision}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-amber-400 uppercase tracking-wide mb-2">Trade-offs</h4>
                                <div className="text-slate-300 whitespace-pre-line text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {adrExample.tradeoffs}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-rose-400 uppercase tracking-wide mb-2">Risks & Mitigation</h4>
                                <div className="text-slate-300 text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {adrExample.risk}
                                </div>
                            </div>
                        </div>

                        {/* AI Badge */}
                        <div className="px-6 py-4 bg-black/30 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Sparkles className="w-4 h-4 text-violet-400" />
                                <span>AI-structured from natural language input</span>
                            </div>
                            <div className="text-sm text-slate-500">Tagged: architecture, database, adr</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4 font-outfit">Why Use Career Black Box for ADRs?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Traditional ADRs are tedious to write. Career Black Box makes them effortless.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-slate-900/40 backdrop-blur rounded-xl p-6 border border-white/5 hover:border-blue-500/30 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-outfit">
                        Start Documenting Decisions Today
                    </h2>
                    <p className="text-slate-400 mb-8">
                        Join engineers who never lose context on their architectural choices.
                    </p>
                    <Link href="/auth/signup">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xl px-10 py-7 h-auto shadow-2xl shadow-blue-500/25 rounded-xl">
                            Create Free Account
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <p className="text-slate-500 mt-4 text-sm">No credit card required • Free during beta</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 px-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-slate-500 text-sm">
                    <div>© {new Date().getFullYear()} Career Black Box. All rights reserved.</div>
                    <div className="flex gap-6 mt-4 sm:mt-0">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
