import { AuthProvider } from '@/lib/auth/context';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Career Black Box - AI Decision Journal for Engineers',
  description: 'Document your professional decisions with AI-powered structuring. Generate promotion-ready self-review packages. The flight recorder for your engineering career.',
  keywords: ['decision journal', 'career tracking', 'promotion package', 'AI assistant', 'engineering career', 'performance review', 'self review'],
  authors: [{ name: 'Career Black Box' }],
  openGraph: {
    title: 'Career Black Box - AI Decision Journal',
    description: 'Stop losing credit for your best decisions. Document, analyze, and generate promotion packages with AI.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Career Black Box',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Black Box - AI Decision Journal',
    description: 'Stop losing credit for your best decisions. Document, analyze, and generate promotion packages with AI.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-slate-900 bg-slate-50`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
