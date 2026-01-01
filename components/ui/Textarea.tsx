import React, { useState, useEffect, useId } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    showCount?: boolean;
    error?: boolean;
    helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, showCount, maxLength, value, onChange, error, helperText, id, ...props }, ref) => {
        const [charCount, setCharCount] = useState(0);
        const generatedId = useId();
        const helperId = `${id || generatedId}-helper`;

        useEffect(() => {
            if (typeof value === 'string') {
                setCharCount(value.length);
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCharCount(e.target.value.length);
            onChange?.(e);
        };

        return (
            <div className="w-full">
                <textarea
                    ref={ref}
                    id={id}
                    aria-invalid={error || undefined}
                    aria-describedby={helperText ? helperId : undefined}
                    className={cn(
                        'flex min-h-[120px] w-full rounded-lg border bg-slate-950/20 px-3 py-2 text-sm text-white resize-y',
                        'placeholder:text-slate-400',
                        'focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error
                            ? 'border-red-500/50 focus:ring-red-500/50'
                            : 'border-white/10 focus:ring-indigo-500/50',
                        className
                    )}
                    maxLength={maxLength}
                    value={value}
                    onChange={handleChange}
                    {...props}
                />
                <div className="flex justify-between mt-1">
                    {helperText && (
                        <p
                            id={helperId}
                            role={error ? 'alert' : undefined}
                            className={cn(
                                'text-xs',
                                error ? 'text-red-400' : 'text-slate-400'
                            )}
                        >
                            {helperText}
                        </p>
                    )}
                    {showCount && (
                        <p className={cn(
                            'text-xs ml-auto',
                            maxLength && charCount >= maxLength ? 'text-amber-400' : 'text-slate-400'
                        )}>
                            {charCount}{maxLength && ` / ${maxLength}`}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export { Textarea };
