import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/10 blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-white mb-6 font-outfit">Terms of Service</h1>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-slate-400 mb-4">
                            <strong className="text-slate-300">Last updated:</strong> {new Date().toLocaleDateString()}
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">1. Acceptance of Terms</h2>
                        <p className="text-slate-300 mb-4">
                            By accessing and using Career Black Box, you accept and agree to be bound by these
                            Terms of Service.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">2. Description of Service</h2>
                        <p className="text-slate-300 mb-4">
                            Career Black Box is a decision-logging and career development tool that uses AI to
                            help you document and analyze your professional decisions.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">3. User Responsibilities</h2>
                        <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                            <li>You are responsible for maintaining the confidentiality of your account</li>
                            <li>You agree not to misuse the service or use it for illegal purposes</li>
                            <li>You own all content you create, including decision entries</li>
                            <li>You grant us permission to process your data to provide AI-powered features</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">4. AI-Generated Content</h2>
                        <p className="text-slate-300 mb-4">
                            Our AI features (decision structuring, promotion packages) are provided "as is".
                            While we strive for accuracy, you should review and edit all AI-generated content
                            before using it professionally.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">5. Payment Terms</h2>
                        <p className="text-slate-300 mb-4">
                            AI promotion package generation may require payment. All payments are processed
                            securely through Razorpay. Refunds are handled on a case-by-case basis.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">6. Data Ownership</h2>
                        <p className="text-slate-300 mb-4">
                            You retain full ownership of all your decision data. You can export or delete your
                            data at any time through the Settings page.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">7. Service Availability</h2>
                        <p className="text-slate-300 mb-4">
                            We strive for 99.9% uptime but cannot guarantee uninterrupted service. We are not
                            liable for any damages resulting from service interruptions.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">8. Termination</h2>
                        <p className="text-slate-300 mb-4">
                            You may terminate your account at any time. We reserve the right to terminate
                            accounts that violate these terms.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">9. Changes to Terms</h2>
                        <p className="text-slate-300 mb-4">
                            We may update these terms from time to time. Continued use of the service constitutes
                            acceptance of updated terms.
                        </p>

                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 font-outfit">10. Contact</h2>
                        <p className="text-slate-300 mb-4">
                            Questions about these Terms? Contact us at{' '}
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
