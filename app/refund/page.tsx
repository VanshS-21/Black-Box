import Link from 'next/link';

export const metadata = {
    title: 'Refund & Cancellation Policy | Career Black Box',
    description: 'Refund and cancellation policy for Career Black Box services.',
};

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <Link href="/" className="text-indigo-400 hover:text-indigo-300 mb-8 inline-block">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8 font-outfit">
                    Refund & Cancellation Policy
                </h1>

                <div className="prose prose-invert prose-slate max-w-none space-y-6">
                    <p className="text-slate-400">
                        Last updated: December 26, 2024
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">1. Free Tier Services</h2>
                        <p>
                            Career Black Box currently offers its core features free of charge during our beta period.
                            Since no payment is collected for free tier usage, no refund is applicable.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">2. Premium Services</h2>
                        <p>
                            For any premium or paid features that may be introduced in the future:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li>Refund requests must be made within 7 days of purchase</li>
                            <li>Refunds will be processed within 5-7 business days</li>
                            <li>Refunds will be credited to the original payment method</li>
                            <li>Partial refunds may be issued for partially used services</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">3. Cancellation Policy</h2>
                        <p>
                            You may cancel your subscription or delete your account at any time:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li>Go to Dashboard → Settings → Delete Account</li>
                            <li>Your data will be permanently deleted upon account deletion</li>
                            <li>We recommend exporting your data before cancellation</li>
                            <li>For paid subscriptions, cancellation takes effect at the end of the billing period</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">4. Non-Refundable Items</h2>
                        <p>
                            The following are non-refundable:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li>AI generation credits that have been consumed</li>
                            <li>Services rendered satisfactorily</li>
                            <li>Accounts terminated due to Terms of Service violations</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">5. How to Request a Refund</h2>
                        <p>
                            To request a refund, please contact us at:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li>Email: support@careerblackbox.app</li>
                            <li>Include your account email and order/transaction ID</li>
                            <li>Describe the reason for your refund request</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
                        <p>
                            If you have any questions about our refund policy, please contact us:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li>Email: support@careerblackbox.app</li>
                            <li>Response time: Within 24-48 hours</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
