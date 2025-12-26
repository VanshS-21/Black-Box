import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', ...props }, ref) => {
        return (
            <input
                type={type}
                ref={ref}
                className={cn(
                    'flex h-10 w-full rounded-lg border border-white/10 bg-slate-950/20 px-3 py-2 text-sm text-white',
                    'placeholder:text-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';

export { Input };
