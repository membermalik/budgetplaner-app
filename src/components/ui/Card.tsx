'use client';

import { cn } from '@/lib/utils';
import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'hero' | 'stat';
}

export function Card({ children, className, variant = 'default', ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-3xl p-6 sm:p-8 border',
                'transition-all duration-300',
                variant === 'default' && 'glass border-surface-border shadow-card',
                variant === 'hero' && 'glass-strong border-accent/20 shadow-glow',
                variant === 'stat' && 'bg-surface border-surface-border hover:border-accent/30 hover:shadow-lg',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
