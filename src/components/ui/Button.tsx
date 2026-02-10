'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'relative inline-flex items-center justify-center font-outfit font-bold rounded-[14px] border border-transparent cursor-pointer',
                'transition-all duration-300 ease-out',
                'disabled:opacity-50 disabled:pointer-events-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                // Variants
                variant === 'primary' && [
                    'bg-accent text-accent-foreground',
                    'hover:shadow-lg hover:shadow-accent-glow hover:-translate-y-0.5',
                    'active:translate-y-0 active:shadow-md',
                ],
                variant === 'secondary' && [
                    'bg-surface-hover border-surface-border text-text-main',
                    'hover:bg-surface-active hover:text-text-main',
                ],
                variant === 'danger' && [
                    'bg-danger text-white',
                    'hover:shadow-lg hover:shadow-danger/30',
                ],
                variant === 'ghost' && [
                    'bg-transparent text-text-main hover:bg-surface-hover',
                    'border-transparent',
                ],
                variant === 'icon' && [
                    'bg-surface/50 border-surface-border text-text-main',
                    'w-12 h-12 rounded-[14px]',
                    'backdrop-blur-md',
                    'hover:bg-accent hover:text-accent-foreground hover:border-accent hover:-translate-y-0.5 hover:rotate-6',
                    'hover:shadow-glow',
                ],
                // Sizes
                size === 'sm' && 'px-4 py-2 text-sm',
                size === 'md' && 'px-6 py-3 text-base',
                size === 'lg' && 'px-8 py-5 text-lg w-full',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
