'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = 'Bestätigen',
    cancelText = 'Abbrechen',
    isDangerous = false,
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmationModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title={title}>
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    {isDangerous && (
                        <AlertTriangle size={24} className="text-danger flex-shrink-0 mt-1" />
                    )}
                    <p className="text-text-main">{message}</p>
                </div>

                <div className="flex gap-3 justify-end">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={isDangerous ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Wird verarbeitet...' : confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
