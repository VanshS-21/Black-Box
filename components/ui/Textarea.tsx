import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    'flex min-h-[120px] w-full rounded-lg border border-white/10 bg-slate-950/20 px-3 py-2 text-sm text-white',
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

Textarea.displayName = 'Textarea';

export { Textarea };
