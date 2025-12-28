'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Settings, Users, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';

interface DashboardHeaderProps {
    /** Show a back button instead of the main actions */
    showBack?: boolean;
    /** Page title to display (for sub-pages) */
    pageTitle?: string;
    /** Subtitle for the page */
    pageSubtitle?: string;
}

export function DashboardHeader({ showBack, pageTitle, pageSubtitle }: DashboardHeaderProps) {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get user initials for avatar
    const getInitials = (email: string | undefined) => {
        if (!email) return '?';
        const parts = email.split('@')[0];
        return parts.slice(0, 2).toUpperCase();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push('/auth/login');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Left side: Logo + optional page title */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow flex items-center justify-center">
                            <div className="w-3 h-3 bg-white/90 rounded-sm" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight font-outfit group-hover:text-indigo-400 transition-colors hidden sm:inline">
                            Career Black Box
                        </span>
                    </Link>

                    {pageTitle && (
                        <>
                            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
                            <div>
                                <h1 className="text-lg font-semibold text-white font-outfit">{pageTitle}</h1>
                                {pageSubtitle && (
                                    <p className="text-xs text-slate-400 hidden sm:block">{pageSubtitle}</p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Right side: Actions + Profile */}
                <div className="flex items-center gap-3">
                    {showBack ? (
                        <Button
                            onClick={() => router.push('/dashboard')}
                            variant="outline"
                            size="sm"
                            className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                        >
                            ← Back to Dashboard
                        </Button>
                    ) : (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                onClick={() => router.push('/dashboard/new')}
                                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-1.5" />
                                <span className="hidden sm:inline">Log Decision</span>
                                <span className="sm:hidden">New</span>
                            </Button>
                        </motion.div>
                    )}

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-indigo-500/20">
                                {getInitials(user?.email)}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                                >
                                    {/* User info */}
                                    <div className="px-4 py-3 border-b border-white/5">
                                        <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                                        <p className="text-xs text-slate-400">Free Plan</p>
                                    </div>

                                    {/* Menu items */}
                                    <div className="py-1">
                                        <Link
                                            href="/dashboard/settings"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Profile & Settings
                                        </Link>
                                        <Link
                                            href="/dashboard/settings#teams"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <Users className="w-4 h-4" />
                                            Teams
                                        </Link>
                                    </div>

                                    {/* Sign out */}
                                    <div className="border-t border-white/5 py-1">
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
