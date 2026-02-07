'use client';

import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
    error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, id, options, error, ...props }, ref) => {
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
                    <select
                        id={id}
                        ref={ref}
                        className={cn(
                            'w-full bg-surface border rounded-2xl',
                            'px-5 py-4 pr-10 text-text-main font-inter text-[0.95rem]',
                            'transition-all duration-300',
                            'focus:outline-none focus:bg-surface-hover',
                            'focus:shadow-[0_0_0_4px_var(--accent-glow)]',
                            'appearance-none cursor-pointer',
                            error
                                ? 'border-danger/50 focus:border-danger'
                                : 'border-surface-border focus:border-accent/50 hover:border-surface-border/80',
                            className
                        )}
                        {...props}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value} className="bg-card-bg text-text-main py-2">
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {/* Custom Chevron */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-dim">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                {error && (
                    <p className="mt-2 text-sm text-danger">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
