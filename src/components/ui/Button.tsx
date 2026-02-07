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
                'font-outfit font-bold rounded-[14px] border-none cursor-pointer',
                'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                // Variants
                variant === 'primary' && [
                    'bg-accent text-white',
                    'hover:translate-y-[-2px] hover:shadow-[0_15px_30px_rgba(99,102,241,0.4)]',
                ],
                variant === 'secondary' && [
                    'bg-white/10 border border-white/[0.2] text-text-main font-semibold',
                    'hover:bg-white/20 hover:border-white/[0.3] hover:text-white',
                ],
                variant === 'danger' && [
                    'bg-danger text-white',
                    'hover:shadow-[0_8px_25px_rgba(244,63,94,0.4)]',
                ],
                variant === 'ghost' && [
                    'bg-transparent text-text-main font-semibold',
                    'border border-white/[0.1]',
                    'hover:bg-white/10 hover:border-white/[0.2]',
                ],
                variant === 'icon' && [
                    'bg-white/5 border border-white/[0.15] text-text-main',
                    'w-12 h-12 flex items-center justify-center rounded-[14px]',
                    'backdrop-blur-[25px]',
                    'hover:bg-accent hover:translate-y-[-2px] hover:rotate-[15deg]',
                    'hover:shadow-[0_10px_20px_rgba(99,102,241,0.4)]',
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
