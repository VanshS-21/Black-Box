import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/10 blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-white mb-6 font-outfit">Privacy Policy</h1>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-slate-400 mb-4">
                            <strong className="text-slate-300">Last updated:</strong> {new Date().toLocaleDateString()}
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">Introduction</h2>
                        <p className="text-slate-300 mb-4">
                            Career Black Box ("we", "our", or "us") is committed to protecting your privacy.
                            This Privacy Policy explains how we collect, use, and safeguard your information.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">Information We Collect</h2>
                        <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                            <li><strong className="text-slate-200">Account Information:</strong> Email address, password (encrypted)</li>
                            <li><strong className="text-slate-200">Decision Data:</strong> All decision entries you create</li>
                            <li><strong className="text-slate-200">Usage Data:</strong> AI generation requests, timestamps</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">How We Use Your Information</h2>
                        <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                            <li>To provide and maintain our service</li>
                            <li>To generate AI-powered insights from your decisions</li>
                            <li>To improve our AI models and features</li>
                            <li>To communicate with you about your account</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">Data Security</h2>
                        <p className="text-slate-300 mb-4">
                            We use industry-standard security measures including encryption, secure authentication
                            (Supabase), and row-level security policies to protect your data. Your decisions are
                            private and only accessible to you.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">Third-Party Services</h2>
                        <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                            <li><strong className="text-slate-200">Supabase:</strong> Database and authentication</li>
                            <li><strong className="text-slate-200">Google Gemini AI:</strong> AI-powered decision structuring</li>
                            <li><strong className="text-slate-200">Razorpay:</strong> Payment processing (when applicable)</li>
                            <li><strong className="text-slate-200">Vercel:</strong> Hosting</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">Your Rights</h2>
                        <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                            <li>Access and export your data anytime</li>
                            <li>Delete your account and all associated data</li>
                            <li>Update or correct your information</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">Contact Us</h2>
                        <p className="text-slate-300 mb-4">
                            If you have questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:support@careerblackbox.com" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                                support@careerblackbox.com
                            </a>
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <Link href="/" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
