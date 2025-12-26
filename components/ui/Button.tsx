'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

        const variants = {
            primary: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 focus-visible:ring-indigo-600 shadow-lg shadow-indigo-500/25 border border-white/10',
            secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 focus-visible:ring-slate-500 border border-white/5',
            outline: 'border border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white focus-visible:ring-slate-500',
            ghost: 'hover:bg-white/5 text-slate-300 hover:text-white focus-visible:ring-slate-500',
            danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 focus-visible:ring-red-600',
        };

        const sizes = {
            sm: 'text-sm px-3 py-1.5',
            md: 'text-base px-4 py-2',
            lg: 'text-lg px-6 py-3',
        };

        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={isDisabled}
                {...props}
            >
                {loading && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
