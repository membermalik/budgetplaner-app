'use client';

import { useState } from 'react';
import { RecurringManager } from '@/components/settings/RecurringManager';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { RecurringTransaction } from '@/types';
import { Plus } from 'lucide-react';

export default function RecurringPage() {
    const [editRecurringTransaction, setEditRecurringTransaction] = useState<RecurringTransaction | null>(null);
    const [initialIsRecurring, setInitialIsRecurring] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleAdd = () => {
        setEditRecurringTransaction(null);
        setInitialIsRecurring(false); // Changed to false to start clean
        setShowModal(true);
    };

    const handleEdit = (transaction: RecurringTransaction) => {
        setEditRecurringTransaction(transaction);
        setInitialIsRecurring(true);
        setShowModal(true);
    };

    const handleClose = () => {
        setEditRecurringTransaction(null);
        setInitialIsRecurring(false);
        setShowModal(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Fixkosten</h2>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAdd}
                    className="h-10 px-6 rounded-full shadow-lg shadow-accent/20 flex items-center gap-2"
                >
                    <Plus size={18} />
                    <span>Neu</span>
                </Button>
            </div>

            <RecurringManager
                onAdd={handleAdd}
                onEdit={handleEdit}
            />

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleClose}
                title={editRecurringTransaction ? "Dauerauftrag bearbeiten" : "Neuer Dauerauftrag"}
            >
                <TransactionForm
                    editRecurringTransaction={editRecurringTransaction}
                    initialIsRecurring={initialIsRecurring}
                    onCancel={handleClose}
                    onSuccess={handleClose}
                />
            </Modal>
        </div>
    );
}
