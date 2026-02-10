'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    variant?: 'default' | 'danger' | 'wide';
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    variant = 'default',
}: ModalProps) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className={cn(
                'fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]',
                'flex items-center justify-center p-6 sm:p-8',
                'animate-in fade-in duration-300'
            )}
            onClick={onClose}
        >
            <div
                className={cn(
                    'glass-strong rounded-3xl overflow-hidden shadow-2xl',
                    'w-full max-w-[500px] flex flex-col max-h-[80vh]',
                    'animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out',
                    variant === 'danger' && 'border-danger/30 shadow-[0_0_50px_-20px_rgba(239,68,68,0.5)]',
                    variant === 'wide' && 'max-w-[950px]'
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 sm:px-10 pt-6 sm:pt-8 pb-4">
                    <h3 className="font-outfit text-lg sm:text-xl font-bold text-text-main truncate">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-text-dim text-3xl leading-none hover:text-text-main hover:rotate-90 transition-all duration-500 flex-shrink-0 ml-4"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 sm:px-10 pb-6 sm:pb-8 flex-1 overflow-y-auto min-h-0">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="px-10 pb-10 flex gap-4 justify-end">{footer}</div>
                )}
            </div>
        </div >
    );
}
