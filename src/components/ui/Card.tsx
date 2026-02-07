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
                'glass rounded-3xl p-6 sm:p-8',
                'transition-all duration-500 ease-out',
                'hover:shadow-glow hover:border-accent/30',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
