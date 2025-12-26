import Link from 'next/link';
import { Mail, MapPin, Clock } from 'lucide-react';

export const metadata = {
    title: 'Contact Us | Career Black Box',
    description: 'Get in touch with the Career Black Box team.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <Link href="/" className="text-indigo-400 hover:text-indigo-300 mb-8 inline-block">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8 font-outfit">
                    Contact Us
                </h1>

                <div className="space-y-8">
                    <p className="text-lg text-slate-300">
                        Have questions, feedback, or need support? We'd love to hear from you.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Email Card */}
                        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Mail className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">Email Support</h2>
                            <p className="text-slate-400 mb-4">
                                For general inquiries, support, and feedback
                            </p>
                            <a
                                href="mailto:support@careerblackbox.app"
                                className="text-indigo-400 hover:text-indigo-300 font-medium"
                            >
                                support@careerblackbox.app
                            </a>
                        </div>

                        {/* Response Time Card */}
                        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
                            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">Response Time</h2>
                            <p className="text-slate-400 mb-4">
                                We typically respond within
                            </p>
                            <span className="text-emerald-400 font-medium">
                                24-48 business hours
                            </span>
                        </div>
                    </div>

                    {/* Business Information */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 mt-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-6 h-6 text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-2">Business Address</h2>
                                <p className="text-slate-400">
                                    Career Black Box<br />
                                    India
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Link */}
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Looking for quick answers?
                        </h3>
                        <p className="text-slate-300 mb-4">
                            Check out our FAQ section on the homepage for common questions about Career Black Box.
                        </p>
                        <Link
                            href="/#faq"
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            View FAQ →
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <div className="text-sm text-slate-500 mt-8">
                        <p>
                            For refund requests, please refer to our{' '}
                            <Link href="/refund" className="text-indigo-400 hover:text-indigo-300">
                                Refund & Cancellation Policy
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
