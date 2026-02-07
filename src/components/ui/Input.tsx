'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, id, error, ...props }, ref) => {
        return (
            <div className="mb-6">
                {label && (
                    <label
                        htmlFor={id}
                        className="block font-outfit text-xs font-semibold text-white/80 mb-3"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        id={id}
                        ref={ref}
                        className={cn(
                            'w-full bg-surface border rounded-2xl',
                            'px-5 py-4 text-text-main font-inter text-[0.95rem]',
                            'transition-all duration-300',
                            'placeholder:text-text-dim/50',
                            'focus:outline-none focus:bg-surface-hover',
                            'focus:shadow-[0_0_0_4px_var(--accent-glow)]',
                            error
                                ? 'border-danger/50 focus:border-danger'
                                : 'border-surface-border focus:border-accent/50 hover:border-surface-border/80',
                            className
                        )}
                        {...props}
                    />
                    {error && (
                        <AlertCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-danger pointer-events-none" />
                    )}
                </div>
                {error && (
                    <p className="mt-2 text-sm text-danger flex items-center gap-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
