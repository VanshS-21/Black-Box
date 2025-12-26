'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '🧠',
      title: 'AI-Powered Structuring',
      description: 'Just brain dump your thoughts. Our AI extracts context, trade-offs, risks, and outcomes automatically.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📊',
      title: 'Promotion Packages',
      description: 'Generate polished, promotion-ready self-review documents that highlight your decision-making quality.',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: '🔒',
      title: 'Lock & Preserve',
      description: 'Lock important decisions to create an immutable record. Your future self will thank you.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: '🏷️',
      title: 'Smart Tagging',
      description: 'Automatically categorize decisions by type, impact level, and domain for easy retrieval.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: '📤',
      title: 'Export Anywhere',
      description: 'Your data belongs to you. Export everything as JSON or PDF whenever you need it.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: '🔍',
      title: 'Instant Search',
      description: 'Find any decision in seconds. Search by title, tags, date, or content.',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Brain Dump',
      description: 'Write about your decision naturally, like you\'re telling a colleague. No structure needed.',
      visual: '💭'
    },
    {
      step: '02',
      title: 'AI Structures',
      description: 'Our AI extracts the key elements: context, decision, trade-offs, risks, and confidence level.',
      visual: '✨'
    },
    {
      step: '03',
      title: 'Build Your Legacy',
      description: 'Watch your decision log grow. When promotion time comes, generate your brag sheet instantly.',
      visual: '🚀'
    }
  ];

  const testimonials = [
    {
      quote: "I used to forget 90% of the decisions I made. Now I have a searchable record that helped me secure a Staff Engineer promotion.",
      name: "Alex Chen",
      role: "Staff Engineer",
      company: "Tech Startup",
      avatar: "AC"
    },
    {
      quote: "The AI structuring is magic. I just ramble about what happened and it turns into a professional decision log entry.",
      name: "Sarah Miller",
      role: "Engineering Manager",
      company: "Fortune 500",
      avatar: "SM"
    },
    {
      quote: "Finally, a tool that understands that my job is about the decisions I make, not just the code I ship.",
      name: "James Park",
      role: "Senior Developer",
      company: "Fintech",
      avatar: "JP"
    }
  ];

  const faqs = [
    {
      question: "Is my data private and secure?",
      answer: "Absolutely. Your decisions are encrypted and only accessible to you. We use Supabase with row-level security, meaning even we can't read your data. You can export or delete everything anytime."
    },
    {
      question: "How does the AI structuring work?",
      answer: "We use Google's Gemini AI to analyze your natural language input and extract structured information: the decision itself, context, trade-offs considered, risks accepted, and stakeholders involved. You can always edit the results."
    },
    {
      question: "What happens when I change jobs?",
      answer: "Your Career Black Box goes with you! Export your entire decision history as JSON before you leave. Your career wisdom is yours forever, not your employer's."
    },
    {
      question: "Is it really free?",
      answer: "Yes, during our beta period everything is free including AI features. After beta, basic features will remain free. Premium features like unlimited AI generations will be $5/month."
    },
    {
      question: "Can I share my decisions with my manager?",
      answer: "Yes! You can print any decision to PDF or generate a comprehensive promotion package that summarizes your decision-making patterns and impact."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden relative selection:bg-violet-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-indigo-500/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow flex items-center justify-center">
                <span className="text-white font-bold text-lg">📦</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-outfit">Career Black Box</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">How it Works</a>
              <a href="#pricing" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Pricing</a>
              <a href="#faq" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">FAQ</a>
            </div>

            <div className="flex gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-5 shadow-xl shadow-white/10 transition-all hover:scale-105 active:scale-95">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Beta Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            🎉 Now in Public Beta — Free for Early Users
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.05] font-outfit mb-8">
            Stop losing credit
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 animate-gradient">
              for your best decisions.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            The AI-powered decision journal that transforms your daily technical choices into a
            <span className="text-white font-medium"> promotion-ready portfolio</span>.
            Never forget why you made that call.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-lg px-10 py-7 h-auto shadow-2xl shadow-indigo-500/30 border border-white/10 rounded-2xl transition-all hover:scale-105 hover:shadow-indigo-500/40 group">
                Start Logging Decisions
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/5 text-lg px-10 py-7 h-auto rounded-2xl backdrop-blur-sm">
                See Demo
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Free during beta</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Setup in 30 seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Card Section */}
      <section className="pb-32 relative" id="demo">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Glow effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[400px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 blur-[100px] opacity-15" />
          </div>

          <div className="relative bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
            {/* Window Chrome */}
            <div className="flex items-center gap-2 mb-8 pb-6 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/50" />
              </div>
              <div className="ml-4 px-4 py-1.5 bg-slate-800/50 rounded-lg text-xs font-mono text-slate-500 border border-white/5">
                career-black-box.app/new
              </div>
              <div className="ml-auto flex items-center gap-2 text-xs font-medium text-violet-400">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                AI Ready
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Side */}
              <div>
                <div className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Your Brain Dump</div>
                <div className="font-mono text-slate-300 text-sm leading-relaxed p-5 bg-black/30 rounded-xl border border-white/5 min-h-[200px]">
                  <p className="mb-3">
                    <span className="text-indigo-400">{">"}</span> Decided to switch from REST to GraphQL for the new mobile app API.
                  </p>
                  <p className="mb-3">
                    <span className="text-indigo-400">{">"}</span> REST was causing too many round trips - 8 requests just to load the home screen.
                  </p>
                  <p className="mb-3">
                    <span className="text-indigo-400">{">"}</span> GraphQL lets us batch everything. Team needs to learn it but worth it.
                  </p>
                  <p>
                    <span className="text-indigo-400">{">"}</span> Biggest risk is the learning curve - we have 2 weeks to ship.
                  </p>
                </div>
              </div>

              {/* Output Side */}
              <div>
                <div className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className="text-violet-400">✨</span> AI-Structured Output
                </div>
                <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-5 min-h-[200px]">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-500 rounded-l-xl" />

                  <h3 className="text-lg font-bold text-white mb-4 font-outfit">
                    REST → GraphQL Migration for Mobile API
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs uppercase">Decision</span>
                      <p className="text-slate-300">Adopt GraphQL to reduce API round trips from 8 to 1</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-500 text-xs uppercase">Impact</span>
                        <p className="text-emerald-400 font-medium">87% fewer requests</p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs uppercase">Confidence</span>
                        <p className="text-indigo-300 font-medium">8/10</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <span className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded text-xs">architecture</span>
                      <span className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded text-xs">api</span>
                      <span className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded text-xs">mobile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
              Everything you need to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400"> own your career</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built by engineers, for engineers. Every feature designed to make capturing decisions effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-slate-900/40 backdrop-blur-md rounded-2xl p-8 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/5"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-outfit">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-y border-white/5 bg-black/20" id="how-it-works">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
              From chaos to clarity in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> 3 simple steps</span>
            </h2>
            <p className="text-xl text-slate-400">
              No templates. No rigid formats. Just write naturally.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-violet-500/50 to-transparent" />
                )}

                <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-8 border border-white/5 relative overflow-hidden group hover:border-violet-500/30 transition-all">
                  {/* Step Number */}
                  <div className="text-7xl font-bold text-slate-800 absolute -top-2 -right-2 font-outfit opacity-50 group-hover:text-violet-900/50 transition-colors">
                    {step.step}
                  </div>

                  <div className="text-5xl mb-6">{step.visual}</div>
                  <h3 className="text-2xl font-bold text-white mb-3 font-outfit relative z-10">{step.title}</h3>
                  <p className="text-slate-400 relative z-10 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-outfit">
            Trusted by engineers who lead
          </h2>
          <p className="text-slate-400 mb-12">Join thousands of professionals documenting their career journey</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { value: '10,000+', label: 'Decisions Logged' },
              { value: '2,500+', label: 'Active Users' },
              { value: '850+', label: 'Promotions Secured' },
              { value: '50hrs', label: 'Saved Per Year' },
            ].map((stat, idx) => (
              <div key={idx} className="p-6 bg-slate-900/30 rounded-2xl border border-white/5">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-outfit bg-gradient-to-r from-indigo-400 to-violet-400 text-transparent bg-clip-text">
                  {stat.value}
                </div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
              Loved by engineers
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400"> worldwide</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-slate-900/40 backdrop-blur rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-slate-500 text-sm">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24" id="pricing">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-slate-400">
              Start free. Upgrade when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-slate-900/40 backdrop-blur rounded-2xl p-8 border border-white/10">
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Free Forever</div>
              <div className="text-4xl font-bold text-white mb-6 font-outfit">$0<span className="text-lg text-slate-500 font-normal">/month</span></div>

              <ul className="space-y-4 mb-8">
                {['Unlimited decisions', 'Full search & tagging', 'Export to JSON', 'Lock & preserve', 'Print to PDF'].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/auth/signup">
                <Button variant="outline" size="lg" className="w-full border-white/10 text-white hover:bg-white/5 rounded-xl">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-indigo-950/80 to-violet-950/80 backdrop-blur rounded-2xl p-8 border border-indigo-500/30 relative overflow-hidden">
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                BETA: FREE
              </div>

              <div className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2">Pro</div>
              <div className="text-4xl font-bold text-white mb-1 font-outfit">
                <span className="line-through text-slate-500 text-2xl">$5</span> $0
                <span className="text-lg text-slate-400 font-normal">/month</span>
              </div>
              <div className="text-sm text-indigo-300 mb-6">Free during beta!</div>

              <ul className="space-y-4 mb-8">
                {['Everything in Free', 'AI-powered structuring', 'Promotion package generator', 'Advanced analytics', 'Priority support'].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-200">
                    <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/auth/signup">
                <Button size="lg" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl shadow-lg shadow-indigo-500/25">
                  Start Free Trial →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-y border-white/5 bg-black/20" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-900/40 backdrop-blur rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-slate-400 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-outfit leading-tight">
            Ready to stop losing credit for your work?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of engineers who document their decisions and get promoted faster.
          </p>

          <Link href="/auth/signup">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xl px-12 py-8 h-auto shadow-2xl shadow-indigo-500/30 border border-white/10 rounded-2xl transition-all hover:scale-105">
              Start Your Career Black Box →
            </Button>
          </Link>

          <p className="text-slate-500 mt-6">Free during beta • No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <span className="text-lg">📦</span>
                </div>
                <span className="text-xl font-bold text-white font-outfit">Career Black Box</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                The flight recorder for your career. Document decisions, prove your value, get promoted.
              </p>
              <div className="flex gap-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><a href="https://merchant.razorpay.com/policy/RwCVjm6bdiqpML/shipping" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="https://merchant.razorpay.com/policy/RwCVjm6bdiqpML/refund" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="mailto:support@careerblackbox.com" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-sm">
            <div>© {new Date().getFullYear()} Career Black Box. All rights reserved.</div>
            <div className="mt-4 sm:mt-0">Made with ❤️ for engineers who ship</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
