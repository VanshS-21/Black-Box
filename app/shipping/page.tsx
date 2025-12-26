import Link from 'next/link';

export const metadata = {
    title: 'Shipping Policy | Career Black Box',
    description: 'Shipping and delivery policy for Career Black Box services.',
};

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <Link href="/" className="text-indigo-400 hover:text-indigo-300 mb-8 inline-block">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8 font-outfit">
                    Shipping & Delivery Policy
                </h1>

                <div className="prose prose-invert prose-slate max-w-none space-y-6">
                    <p className="text-slate-400">
                        Last updated: December 26, 2024
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Digital Product - No Physical Shipping</h2>
                        <p>
                            Career Black Box is a <strong>100% digital software-as-a-service (SaaS) product</strong>.
                            There are no physical goods involved, and therefore no physical shipping is required.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Instant Access</h2>
                        <p>
                            Upon successful registration or payment, you will receive:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li><strong>Immediate access</strong> to your Career Black Box account</li>
                            <li>No waiting period or delivery time</li>
                            <li>Access via web browser at careerblackbox.app</li>
                            <li>Login credentials sent to your registered email (if applicable)</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Service Delivery</h2>
                        <p>
                            Our service is delivered electronically:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li><strong>Platform:</strong> Web-based application accessible from any modern browser</li>
                            <li><strong>Availability:</strong> 24/7 access to your account and data</li>
                            <li><strong>Updates:</strong> Automatic updates with no action required from you</li>
                            <li><strong>Data Export:</strong> Available via Dashboard → Settings → Export</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Technical Requirements</h2>
                        <p>
                            To access Career Black Box, you need:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li>A modern web browser (Chrome, Firefox, Safari, Edge)</li>
                            <li>Stable internet connection</li>
                            <li>Valid email address for account verification</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Access Issues</h2>
                        <p>
                            If you experience any issues accessing your account after registration or purchase,
                            please contact us immediately:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li>Email: support@careerblackbox.app</li>
                            <li>We will resolve access issues within 24 hours</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
                        <p>
                            For any questions about our delivery policy:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            <li>Email: support@careerblackbox.app</li>
                            <li>Visit: <Link href="/contact" className="text-indigo-400 hover:text-indigo-300">Contact Us</Link></li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
