'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
    value: number;
    max?: number;
    variant?: 'accent' | 'secondary' | 'success';
    className?: string;
}

export function ProgressBar({
    value,
    max = 100,
    variant = 'accent',
    className,
}: ProgressBarProps) {
    const percentage = Math.min(100, (value / max) * 100);

    return (
        <div
            className={cn(
                'h-2 bg-white/5 rounded-[10px] overflow-hidden relative',
                className
            )}
        >
            <div
                className={cn(
                    'h-full rounded-[10px] transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    variant === 'accent' && 'bg-gradient-to-r from-accent to-secondary shadow-[0_0_15px_rgba(99,102,241,0.4)]',
                    variant === 'secondary' && 'bg-gradient-to-r from-secondary to-[#ec4899]',
                    variant === 'success' && 'bg-gradient-to-r from-success to-accent'
                )}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
