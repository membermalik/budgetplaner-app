'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, wrapperClassName, label, id, error, ...props }, ref) => {
        return (
            <div className={cn("mb-6 group", wrapperClassName)}>
                {label && (
                    <label
                        htmlFor={id}
                        className="block font-outfit text-xs font-semibold text-text-dim mb-2 uppercase tracking-wider group-focus-within:text-accent transition-colors"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        id={id}
                        ref={ref}
                        aria-invalid={!!error}
                        className={cn(
                            'w-full bg-surface border rounded-xl',
                            'px-4 py-3 text-text-main font-inter text-base',
                            'transition-all duration-200',
                            'placeholder:text-text-dim/50',
                            'focus:outline-none focus:bg-surface-hover focus:ring-2 focus:ring-accent focus:border-transparent',
                            // Error State
                            error
                                ? 'border-danger/50 focus:ring-danger text-danger'
                                : 'border-surface-border hover:border-surface-active',
                            className
                        )}
                        {...props}
                    />
                    {error && (
                        <AlertCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-danger pointer-events-none" />
                    )}
                </div>
                {error && (
                    <p className="mt-2 text-sm text-danger flex items-center gap-1 font-medium animate-in">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
