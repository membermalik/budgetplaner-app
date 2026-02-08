'use client';

import { useState } from 'react';
import { TransactionList } from '@/components/transactions/TransactionList';
import { Modal } from '@/components/ui/Modal';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Transaction } from '@/types';

export default function HistoryPage() {
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleEdit = (transaction: Transaction) => {
        setEditTransaction(transaction);
        setShowModal(true);
    };

    const handleClose = () => {
        setEditTransaction(null);
        setShowModal(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Transaktionsverlauf</h2>
            </div>

            <TransactionList onEditTransaction={handleEdit} />

            {/* Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleClose}
                title="Buchung bearbeiten"
            >
                <TransactionForm
                    editTransaction={editTransaction}
                    onCancel={handleClose}
                    onSuccess={handleClose}
                />
            </Modal>
        </div>
    );
}
