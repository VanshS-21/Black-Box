import React, { useId } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', error, helperText, id, ...props }, ref) => {
        const generatedId = useId();
        const helperId = `${id || generatedId}-helper`;

        return (
            <div className="w-full">
                <input
                    type={type}
                    ref={ref}
                    id={id}
                    aria-invalid={error || undefined}
                    aria-describedby={helperText ? helperId : undefined}
                    className={cn(
                        'flex h-10 w-full rounded-lg border bg-slate-950/20 px-3 py-2 text-sm text-white',
                        'placeholder:text-slate-400',
                        'focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error
                            ? 'border-red-500/50 focus:ring-red-500/50'
                            : 'border-white/10 focus:ring-indigo-500/50',
                        className
                    )}
                    {...props}
                />
                {helperText && (
                    <p
                        id={helperId}
                        role={error ? 'alert' : undefined}
                        className={cn(
                            'mt-1 text-xs',
                            error ? 'text-red-400' : 'text-slate-400'
                        )}
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
