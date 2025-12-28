import { Metadata } from 'next';
import Link from 'next/link';
import { Package, Siren, ArrowRight, Sparkles, Clock, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'Incident Postmortem Template | Write Reports That Get You Promoted | Career Black Box',
    description: 'Document incidents that showcase your problem-solving skills. Turn crisis management into career advancement with AI-structured postmortems.',
    keywords: ['postmortem template', 'incident report', 'incident response', 'blameless postmortem', 'SRE documentation'],
    openGraph: {
        title: 'Incident Postmortem Template | Career Black Box',
        description: 'Write incident reports that get you promoted, not fired.',
        type: 'website',
    },
};

const postmortemExample = {
    title: 'Postmortem: Payment Gateway Timeout (Dec 15, 2024)',
    context: `## What happened
- **Date/Time:** December 15, 2024 at 14:32 IST
- **Duration:** 47 minutes
- **Impact:** 1,247 failed transactions, ~₹12L in delayed revenue

## Timeline
- 14:32 - First PagerDuty alert: Payment success rate dropped to 67%
- 14:35 - Investigation started, initial suspicion: Razorpay API
- 14:41 - Root cause identified: Connection pool exhaustion
- 14:52 - Hotfix deployed: Increased pool size from 10 to 50
- 15:19 - All clear: Success rate back to 99.8%`,
    decision: `## Root cause
Database connection pool was undersized for Black Friday traffic. Under load, payment workers competed for connections, causing timeouts after 30 seconds.

## Fix applied
1. Immediately increased connection pool from 10 to 50
2. Added connection timeout alerts at 80% pool usage
3. Implemented connection recycling every 5 minutes`,
    tradeoffs: `## Prevention measures
1. **Short-term:** Added PgBouncer for connection pooling
2. **Long-term:** Implementing auto-scaling for payment workers

## Monitoring gaps identified
- No alert for connection pool saturation
- Missing dashboard for payment worker health`,
    risk: 'Without the long-term fix, this could happen again during Diwali sale (4x expected traffic).',
};

const features = [
    {
        icon: Clock,
        title: 'Timeline Extraction',
        description: 'AI structures your incident timeline automatically. Just describe what happened.',
    },
    {
        icon: AlertTriangle,
        title: 'Blameless Format',
        description: 'Focus on systems, not people. Our template emphasizes process improvements.',
    },
    {
        icon: Shield,
        title: 'Prevention Tracking',
        description: 'Track action items from each incident. Never let the same issue happen twice.',
    },
    {
        icon: TrendingUp,
        title: 'Career Evidence',
        description: 'Turn crisis moments into promotion material. Show how you saved the day.',
    },
];

export default function PostmortemTemplatePage() {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-rose-500/15 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium mb-6">
                        <Siren className="w-4 h-4" />
                        <span>Incident Postmortems</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-outfit leading-tight">
                        Write Postmortems That{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                            Get You Promoted
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                        Turn incident response into career advancement. Document your crisis management skills
                        with AI-structured postmortems that showcase your impact.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-lg px-8 py-6 h-auto shadow-xl shadow-rose-500/25 rounded-xl">
                                Document Your Next Incident
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

            {/* Example Postmortem */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2 font-outfit">Example: Payment Outage Postmortem</h2>
                        <p className="text-slate-400">See how Career Black Box structures an incident report</p>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
                        {/* Postmortem Header */}
                        <div className="bg-gradient-to-r from-rose-950/80 to-orange-950/80 px-6 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                                    <Siren className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{postmortemExample.title}</h3>
                                    <p className="text-sm text-slate-400">Incident Postmortem</p>
                                </div>
                            </div>
                        </div>

                        {/* Postmortem Content */}
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-rose-400 uppercase tracking-wide mb-2">What Happened & Timeline</h4>
                                <div className="text-slate-300 whitespace-pre-line text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {postmortemExample.context}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-emerald-400 uppercase tracking-wide mb-2">Root Cause & Fix</h4>
                                <div className="text-slate-300 whitespace-pre-line text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {postmortemExample.decision}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-amber-400 uppercase tracking-wide mb-2">Prevention & Monitoring</h4>
                                <div className="text-slate-300 whitespace-pre-line text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {postmortemExample.tradeoffs}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-blue-400 uppercase tracking-wide mb-2">Outstanding Risk</h4>
                                <div className="text-slate-300 text-sm bg-black/20 rounded-lg p-4 border border-white/5">
                                    {postmortemExample.risk}
                                </div>
                            </div>
                        </div>

                        {/* AI Badge */}
                        <div className="px-6 py-4 bg-black/30 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Sparkles className="w-4 h-4 text-violet-400" />
                                <span>AI-structured from natural language input</span>
                            </div>
                            <div className="text-sm text-slate-500">Tagged: incident, postmortem, payments</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4 font-outfit">Why Use Career Black Box for Postmortems?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Most postmortems get written once and forgotten. Make yours work for your career.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-slate-900/40 backdrop-blur rounded-xl p-6 border border-white/5 hover:border-rose-500/30 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mb-4">
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
                        Turn Crisis Into Career Wins
                    </h2>
                    <p className="text-slate-400 mb-8">
                        Document your incident response skills. Show how you save the day under pressure.
                    </p>
                    <Link href="/auth/signup">
                        <Button size="lg" className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xl px-10 py-7 h-auto shadow-2xl shadow-rose-500/25 rounded-xl">
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
