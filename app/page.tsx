'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  BarChart3,
  Lock,
  Tag,
  Upload,
  Search,
  MessageSquare,
  Sparkles,
  Rocket,
  Target,
  Package,
  PartyPopper,
  Heart,
  ChevronDown,
  ArrowRight,
  Check,
  Menu,
  X,
  Users,
  Building2,
  Chrome
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Structuring',
      description: 'Just brain dump your thoughts. Our AI extracts context, trade-offs, risks, and outcomes automatically.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Promotion Packages',
      description: 'Generate polished, promotion-ready self-review documents that highlight your decision-making quality.',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: Lock,
      title: 'Lock & Preserve',
      description: 'Lock important decisions to create an immutable record. Your future self will thank you.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Tag,
      title: 'Smart Tagging',
      description: 'Automatically categorize decisions by type, impact level, and domain for easy retrieval.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Upload,
      title: 'Export Anywhere',
      description: 'Your data belongs to you. Export everything as JSON or PDF whenever you need it.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Search,
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
      icon: MessageSquare
    },
    {
      step: '02',
      title: 'AI Structures',
      description: 'Our AI extracts the key elements: context, decision, trade-offs, risks, and confidence level.',
      icon: Sparkles
    },
    {
      step: '03',
      title: 'Build Your Legacy',
      description: 'Watch your decision log grow. When promotion time comes, generate your brag sheet instantly.',
      icon: Rocket
    }
  ];

  const betaFeatures = [
    {
      icon: Target,
      title: 'Decision Logging',
      description: 'Capture your professional decisions with AI-powered structuring'
    },
    {
      icon: BarChart3,
      title: 'Promotion Packages',
      description: 'Generate polished self-review documents for performance reviews'
    },
    {
      icon: Lock,
      title: 'Your Data, Your Control',
      description: 'Export everything, delete anytime. Privacy-first architecture'
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
      answer: "Yes, during our beta period everything is free including AI features. After beta, basic features will remain free. Premium features like unlimited AI generations will be ₹500/month."
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
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-outfit">Career Black Box</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">How it Works</a>
              <a href="#for-teams" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">For Teams</a>
              <a href="#pricing" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Pricing</a>
              <a href="#faq" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">FAQ</a>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link href="/auth/login" className="hidden sm:block">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="hidden sm:block">
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-5 shadow-xl shadow-white/10 transition-all hover:scale-105 active:scale-95">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-white/5 py-4 space-y-4 overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors text-sm font-medium py-2">Features</a>
                  <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors text-sm font-medium py-2">How it Works</a>
                  <a href="#for-teams" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors text-sm font-medium py-2">For Teams</a>
                  <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors text-sm font-medium py-2">Pricing</a>
                  <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors text-sm font-medium py-2">FAQ</a>
                </div>
                <div className="flex gap-3 pt-2">
                  <Link href="/auth/login" className="flex-1">
                    <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-white/5">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="flex-1">
                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Beta Badge */}
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <PartyPopper className="w-4 h-4" />
              <span>Now in Public Beta — Free for Early Users</span>
            </div>
          </FadeIn>

          {/* Main Headline */}
          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.05] font-outfit mb-8">
              Stop losing credit
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 animate-gradient">
                for your best decisions.
              </span>
            </h1>
          </FadeIn>

          {/* Subheadline */}
          <FadeIn delay={0.3}>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              The AI-powered decision journal that transforms your daily technical choices into a
              <span className="text-white font-medium"> promotion-ready portfolio</span>.
              Never forget why you made that call.
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth/signup">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-lg px-10 py-7 h-auto shadow-2xl shadow-indigo-500/30 border border-white/10 rounded-2xl transition-all group">
                    Start Logging Decisions
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <a href="#demo">
                <Button variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/5 text-lg px-10 py-7 h-auto rounded-2xl backdrop-blur-sm">
                  See Demo
                </Button>
              </a>
            </div>
          </FadeIn>

          {/* Trust Indicators */}
          <FadeIn delay={0.5}>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Free during beta</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Setup in 30 seconds</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Demo Card Section */}
      <section className="pb-32 relative" id="demo">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Glow effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[400px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 blur-[100px] opacity-15" />
          </div>

          <FadeIn>
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
                    <Sparkles className="w-4 h-4 text-violet-400" /> AI-Structured Output
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
          </FadeIn>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
                Everything you need to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400"> own your career</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Built by engineers, for engineers. Every feature designed to make capturing decisions effortless.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <StaggerItem key={idx}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group bg-slate-900/40 backdrop-blur-md rounded-2xl p-8 border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 h-full"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-outfit">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* For Teams Section - Engineering Managers */}
      <section className="py-24 relative" id="for-teams">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium backdrop-blur-sm mb-6">
                <Building2 className="w-4 h-4" />
                <span>For Engineering Teams</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
                Never lose
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> institutional knowledge</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                When engineers leave, their context leaves with them. Career Black Box keeps your team's architectural history alive.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 backdrop-blur-md rounded-2xl p-8 border border-emerald-500/20 h-full"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-outfit">Team-Wide Decision History</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  "Why did we choose Kafka over RabbitMQ?" Stop asking Slack—it's documented with full context.
                </p>
                <div className="text-emerald-400 text-sm font-medium">
                  → Survives employee turnover
                </div>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 backdrop-blur-md rounded-2xl p-8 border border-emerald-500/20 h-full"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-outfit">Performance Reviews with Data</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  No more "I think they did something good." Generate evidence-backed reviews from real decisions.
                </p>
                <div className="text-emerald-400 text-sm font-medium">
                  → Better calibration, happier engineers
                </div>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 backdrop-blur-md rounded-2xl p-8 border border-emerald-500/20 h-full"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg">
                  <Chrome className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-outfit">Capture in Flow of Work</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Chrome Extension coming soon—right-click any Slack message or GitHub comment to log a decision in 5 seconds.
                </p>
                <div className="text-emerald-400 text-sm font-medium">
                  → Zero workflow disruption
                </div>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>

          <FadeIn delay={0.3}>
            <div className="text-center mt-12">
              <a href="mailto:teams@careerblackbox.com" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                <span>Interested in team features? Contact us</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-y border-white/5 bg-black/20" id="how-it-works">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
                From chaos to clarity in
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400"> 3 simple steps</span>
              </h2>
              <p className="text-xl text-slate-400">
                No templates. No rigid formats. Just write naturally.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <StaggerItem key={idx}>
                <div className="relative">
                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-violet-500/50 to-transparent" />
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-900/50 backdrop-blur rounded-2xl p-8 border border-white/5 relative overflow-hidden group hover:border-violet-500/30 transition-all"
                  >
                    {/* Step Number */}
                    <div className="text-7xl font-bold text-slate-800 absolute -top-2 -right-2 font-outfit opacity-50 group-hover:text-violet-900/50 transition-colors">
                      {step.step}
                    </div>

                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-6 shadow-lg">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 font-outfit relative z-10">{step.title}</h3>
                    <p className="text-slate-400 relative z-10 leading-relaxed">{step.description}</p>
                  </motion.div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Beta Announcement Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="bg-gradient-to-r from-indigo-950/50 to-violet-950/50 backdrop-blur-md rounded-3xl p-12 border border-indigo-500/20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Now in Public Beta
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-outfit">
                Be an Early Adopter
              </h2>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                We're actively building Career Black Box with feedback from engineers like you.
                Join our beta to get free access to all features and help shape the product.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {betaFeatures.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    className="p-6 bg-white/5 rounded-xl border border-white/5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-4 mx-auto">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* User Feedback Section */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
                Share Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400"> Experience</span>
              </h2>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                We'd love to hear how Career Black Box is helping you. Your feedback shapes our product.
              </p>
              <a href="mailto:feedback@careerblackbox.com" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Feedback
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24" id="pricing">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-slate-400">
                Start free. Upgrade when you're ready.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <StaggerItem>
              <div className="bg-slate-900/40 backdrop-blur rounded-2xl p-8 border border-white/10 h-full">
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Free Forever</div>
                <div className="text-4xl font-bold text-white mb-6 font-outfit">$0<span className="text-lg text-slate-500 font-normal">/month</span></div>

                <ul className="space-y-4 mb-8">
                  {['Unlimited decisions', 'Full search & tagging', 'Export to JSON', 'Lock & preserve', 'Print to PDF'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-300">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
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
            </StaggerItem>

            {/* Pro Tier */}
            <StaggerItem>
              <div className="bg-gradient-to-b from-indigo-950/80 to-violet-950/80 backdrop-blur rounded-2xl p-8 border border-indigo-500/30 relative overflow-hidden h-full">
                {/* Popular Badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                  BETA: FREE
                </div>

                <div className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2">Pro</div>
                <div className="text-4xl font-bold text-white mb-1 font-outfit">
                  <span className="line-through text-slate-500 text-2xl">₹500</span> ₹0
                  <span className="text-lg text-slate-400 font-normal">/month</span>
                </div>
                <div className="text-sm text-indigo-300 mb-6">Free during beta!</div>

                <ul className="space-y-4 mb-8">
                  {['Everything in Free', 'AI-powered structuring', 'Promotion package generator', 'Advanced analytics', 'Priority support'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-200">
                      <Check className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/auth/signup">
                  <Button size="lg" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl shadow-lg shadow-indigo-500/25">
                    Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-y border-white/5 bg-black/20" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
                Frequently asked questions
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FadeIn key={idx} delay={idx * 0.05}>
                <div className="bg-slate-900/40 backdrop-blur rounded-xl border border-white/5 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    aria-expanded={openFaq === idx}
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaq === idx ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-5 text-slate-400 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-outfit leading-tight">
              Ready to stop losing credit for your work?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Join thousands of engineers who document their decisions and get promoted faster.
            </p>

            <Link href="/auth/signup">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xl px-12 py-8 h-auto shadow-2xl shadow-indigo-500/30 border border-white/10 rounded-2xl transition-all">
                  Start Your Career Black Box <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>

            <p className="text-slate-500 mt-6">Free during beta • No credit card required</p>
          </FadeIn>
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
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white font-outfit">Career Black Box</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                The flight recorder for your career. Document decisions, prove your value, get promoted.
              </p>
              <div className="flex gap-4">
                <a href="mailto:support@careerblackbox.com" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors" aria-label="Email us">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
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
                <li><Link href="/refund" className="text-slate-400 hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/shipping" className="text-slate-400 hover:text-white transition-colors">Shipping Policy</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-sm">
            <div>© {new Date().getFullYear()} Career Black Box. All rights reserved.</div>
            <div className="mt-4 sm:mt-0 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> for engineers who ship
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
