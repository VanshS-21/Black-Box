'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Users, AlertTriangle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TeamVisibilityToggleProps {
    isTeamVisible: boolean;
    onToggle: (visible: boolean) => void;
    teamName?: string;
    disabled?: boolean;
}

/**
 * Team Visibility Toggle with visual mode indicator
 * - Shows clear private vs team-visible state
 * - Changes border color when in team mode
 * - Confirmation dialog when enabling team visibility
 */
export function TeamVisibilityToggle({
    isTeamVisible,
    onToggle,
    teamName,
    disabled = false
}: TeamVisibilityToggleProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleToggle = () => {
        if (!isTeamVisible) {
            // Switching to team visible - show confirmation
            setShowConfirmation(true);
        } else {
            // Switching back to private - no confirmation needed
            onToggle(false);
        }
    };

    const confirmTeamShare = () => {
        onToggle(true);
        setShowConfirmation(false);
    };

    return (
        <div className="relative">
            {/* Main Toggle Button */}
            <motion.button
                onClick={handleToggle}
                disabled={disabled}
                whileHover={{ scale: disabled ? 1 : 1.01 }}
                whileTap={{ scale: disabled ? 1 : 0.99 }}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${isTeamVisible
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300'
                        : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-white/20'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isTeamVisible
                            ? 'bg-indigo-500/20'
                            : 'bg-slate-700/50'
                        }`}>
                        {isTeamVisible ? (
                            <Users className="w-5 h-5 text-indigo-400" />
                        ) : (
                            <Lock className="w-5 h-5 text-slate-500" />
                        )}
                    </div>
                    <div className="text-left">
                        <div className="font-medium text-white text-sm">
                            {isTeamVisible ? 'Team Visible' : 'Private'}
                        </div>
                        <div className="text-xs">
                            {isTeamVisible && teamName
                                ? `Shared with ${teamName}`
                                : 'Only you can see this'}
                        </div>
                    </div>
                </div>

                {/* Toggle Switch Visual */}
                <div className={`w-12 h-6 rounded-full transition-colors relative ${isTeamVisible ? 'bg-indigo-500' : 'bg-slate-600'
                    }`}>
                    <motion.div
                        layout
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                        animate={{ left: isTeamVisible ? 'calc(100% - 20px)' : '4px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                </div>
            </motion.button>

            {/* Confirmation Dialog */}
            <AnimatePresence>
                {showConfirmation && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50"
                    >
                        <div className="bg-slate-800 border border-amber-500/30 rounded-xl p-4 shadow-xl">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm mb-1">
                                        Share with team?
                                    </h4>
                                    <p className="text-slate-400 text-xs">
                                        Team members{teamName ? ` in "${teamName}"` : ''} will be able to see this decision.
                                        Your private notes and other decisions remain hidden.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowConfirmation(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={confirmTeamShare}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                                >
                                    <Users className="w-3 h-3 mr-1" />
                                    Yes, Share
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * Team Mode Border Wrapper
 * Wraps form content and changes border when in team mode
 */
interface TeamModeBorderProps {
    isTeamMode: boolean;
    teamName?: string;
    children: React.ReactNode;
}

export function TeamModeBorder({ isTeamMode, teamName, children }: TeamModeBorderProps) {
    return (
        <div className={`relative rounded-2xl transition-all duration-300 ${isTeamMode
                ? 'ring-2 ring-indigo-500/50'
                : ''
            }`}>
            {/* Team Mode Badge */}
            <AnimatePresence>
                {isTeamMode && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -top-3 left-4 z-10"
                    >
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full shadow-lg">
                            <Users className="w-3 h-3" />
                            Team: {teamName || 'Shared'}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </div>
    );
}

/**
 * Decision Visibility Badge - for displaying on decision cards
 */
interface VisibilityBadgeProps {
    isTeamVisible: boolean;
    teamName?: string;
    size?: 'sm' | 'md';
}

export function VisibilityBadge({ isTeamVisible, teamName, size = 'sm' }: VisibilityBadgeProps) {
    if (isTeamVisible) {
        return (
            <span className={`inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
                }`}>
                <Users className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
                {teamName || 'Team'}
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center gap-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-full ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
            }`}>
            <Lock className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
            Private
        </span>
    );
}
