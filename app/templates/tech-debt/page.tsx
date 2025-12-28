import { Metadata } from 'next';
import Link from 'next/link';
import { Package, AlertTriangle, ArrowRight, Sparkles, Calendar, Wrench, Scale, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'Technical Debt Documentation Template | Log Debt Consciously | Career Black Box',
    description: 'Document technical debt with full context. Track shortcuts, timelines, and payback plans. Never lose context on why you took on debt.',
    keywords: ['tech debt template', 'technical debt documentation', 'tech debt tracking', 'engineering shortcuts', 'code debt'],
    openGraph: {
        title: 'Tech Debt Documentation Template | Career Black Box',
        description: 'Log technical debt consciously with full context and payback plans.',
        type: 'website',
    },
};

const techDebtExample = {
    title: 'Tech Debt: Hardcoded Rate Limiter Configuration',
    context: `## What we're deferring
Proper rate limiter configuration through environment variables and admin UI. Currently hardcoded to 100 req/min in source code.

## Why now isn't the right time
- Sprint ending in 2 days with launch deadline
- Rate limiting works, just not configurable
- No immediate need to change limits frequently`,
    decision: `We're taking on this debt consciously:
- **Shortcut:** Hardcoded values in \`lib/rate-limiter.ts\` instead of env vars
- **Timeline:** Plan to address in Q2 2025 during "Platform Hardening" sprint
- **Owner:** Backend team (assigned to @srikanth)`,
    tradeoffs: `## Impact of this debt
- **Maintenance burden:** LOW - values rarely need changing
- **Performance impact:** NO - same runtime behavior
- **Future work affected:** 
  - Multi-tenant rate limits will require refactor
  - A/B testing rate limits impossible currently`,
    risk: 'If we don\'t address this by Q2 2025, we risk production issues when launching enterprise tier with custom rate limits per customer.',
};

const features = [
    {
        icon: Calendar,
        title: 'Timeline Tracking',
        description: 'Set payback deadlines. Get reminded before debt becomes a crisis.',
    },
    {
        icon: Wrench,
        title: 'Owner Assignment',
        description: 'Track who owns each piece of debt. Clear accountability.',
    },
    {
        icon: Scale,
        title: 'Impact Assessment',
        description: 'Document maintenance burden, performance impact, and blocked features.',
    },
    {
        icon: FileText,
        title: 'Audit Trail',
        description: 'Show leadership you\'re tracking debt consciously, not ignoring it.',
    },
];

export default function TechDebtTemplatePage() {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber-500/15 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px]" />
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium mb-6">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Technical Debt Tracking</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-outfit leading-tight">
                        Log Tech Debt{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">
                            Consciously
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                        Shortcuts are sometimes necessary. Document them with context, timelines, and payback plans
                        so they don&apos;t haunt you later.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-lg px-8 py-6 h-auto shadow-xl shadow-amber-500/25 rounded-xl">
                                Log Your First Debt
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

            {/* Example Tech Debt */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2 font-outfit">Example: Configuration Debt</h2>
                        <p className="text-slate-400">See how Career Black Box documents intentional shortcuts</p>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
                        {/* Tech Debt Header */}
                        <div className="bg-gradient-to-r from-amber-950/80 to-yellow-950/80 px-6 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{techDebtExample.title}</h3>
                                    <p className="text-sm text-slate-400">Technical Debt Decision</p>
                                </div>
                            </div>
                        </div>

                        {/* Tech Debt Content */}
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-amber-400 uppercase tracking-wide mb-2">What We&apos;re Deferring &amp; Why</h4>
                                <div className="text-slate-300 whitespace-pre-line text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {techDebtExample.context}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-emerald-400 uppercase tracking-wide mb-2">The Shortcut & Payback Plan</h4>
                                <div className="text-slate-300 whitespace-pre-line text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {techDebtExample.decision}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-blue-400 uppercase tracking-wide mb-2">Impact Assessment</h4>
                                <div className="text-slate-300 whitespace-pre-line text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {techDebtExample.tradeoffs}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-rose-400 uppercase tracking-wide mb-2">Risk if Not Addressed</h4>
                                <div className="text-slate-300 text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {techDebtExample.risk}
                                </div>
                            </div>
                        </div>

                        {/* AI Badge */}
                        <div className="px-6 py-4 bg-black/30 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Sparkles className="w-4 h-4 text-violet-400" />
                                <span>AI-structured from natural language input</span>
                            </div>
                            <div className="text-sm text-slate-500">Tagged: tech-debt, shortcut, backend</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4 font-outfit">Why Document Tech Debt?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Undocumented shortcuts become surprise crises. Documented debt becomes planned work.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-slate-900/40 backdrop-blur rounded-xl p-6 border border-white/5 hover:border-amber-500/30 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mb-4">
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
                        Take Control of Your Debt
                    </h2>
                    <p className="text-slate-400 mb-8">
                        Stop letting shortcuts become surprises. Document them today, pay them back on your terms.
                    </p>
                    <Link href="/auth/signup">
                        <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xl px-10 py-7 h-auto shadow-2xl shadow-amber-500/25 rounded-xl">
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
