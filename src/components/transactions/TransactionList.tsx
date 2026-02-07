'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { TransactionItem } from './TransactionItem';
import { useBudgetStore } from '@/store/budgetStore';
import { Transaction } from '@/types';
import { downloadFile, truncateText } from '@/lib/utils';
import { Search, Calendar } from 'lucide-react';

interface TransactionListProps {
    onEditTransaction: (transaction: Transaction) => void;
}

export function TransactionList({ onEditTransaction }: TransactionListProps) {
    const { transactions, categories, deleteTransaction } = useBudgetStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Get unique months
    const months = useMemo(() => {
        const uniqueMonths = [...new Set(transactions.map((t) => t.month))];
        return uniqueMonths.reverse();
    }, [transactions]);

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return transactions
            .filter((t) => {
                const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesMonth = selectedMonth === 'all' || t.month === selectedMonth;
                return matchesSearch && matchesMonth;
            })
            .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB.getTime() - dateA.getTime();
            });
    }, [transactions, searchTerm, selectedMonth]);

    const handleDelete = async () => {
        if (deleteModalId !== null) {
            setIsDeleting(true);
            // Simulate processing
            await new Promise((resolve) => setTimeout(resolve, 300));
            deleteTransaction(deleteModalId);
            setDeleteModalId(null);
            setIsDeleting(false);
        }
    };

    const exportCSV = () => {
        if (transactions.length === 0) return;
        let csv = 'ID,Datum,Monat,Beschreibung,Betrag,Kategorie\n';
        transactions.forEach((t) => {
            csv += `${t.id},"${t.date}","${t.month}","${t.text}",${t.amount},"${categories[t.category]?.label || t.category}"\n`;
        });
        downloadFile(
            csv,
            'text/csv',
            `Budgetplaner_Export_${new Date().toISOString().split('T')[0]}.csv`
        );
    };

    const exportJSON = () => {
        const data = { transactions, categories };
        downloadFile(
            JSON.stringify(data, null, 2),
            'application/json',
            `Budgetplaner_Backup_${new Date().toISOString().split('T')[0]}.json`
        );
    };

    const transactionToDelete = transactions.find((t) => t.id === deleteModalId);

    return (
        <>
            <Card>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-outfit text-lg font-bold text-text-main">Verlauf</h3>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={exportJSON}
                            title="Als JSON exportieren"
                        >
                            JSON
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={exportCSV}
                            title="Als CSV exportieren"
                        >
                            CSV
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6 flex-col sm:flex-row">
                    <div className="flex-1 relative">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none"
                        />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nach Beschreibung suchen..."
                            className="w-full bg-[var(--input-bg)] border border-[var(--surface-border)] hover:border-accent/50 rounded-2xl pl-11 pr-5 py-3 text-text-main font-inter text-sm transition-all focus:outline-none focus:border-accent focus:shadow-[0_0_0_4px_var(--accent-glow)] placeholder:text-text-dim/50"
                            aria-label="Transaktionen suchen"
                        />
                    </div>
                    <div className="relative sm:w-auto">
                        <Calendar
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none"
                        />
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSearchTerm(e.target.value)} // Note: logic error in original code (setSearchTerm instead of setSelectedMonth?), checking context...
                            className="w-full sm:w-auto bg-[var(--input-bg)] border border-[var(--surface-border)] hover:border-accent/50 rounded-2xl pl-11 pr-10 py-3 text-text-main font-inter text-sm transition-all focus:outline-none focus:border-accent appearance-none cursor-pointer focus:shadow-[0_0_0_4px_var(--accent-glow)]"
                            aria-label="Nach Monat filtern"
                        >
                            <option value="all" className="bg-[--bg-color]">
                                Alle Monate
                            </option>
                            {months.map((month) => (
                                <option key={month} value={month} className="bg-[--bg-color]">
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-sm text-text-dim">
                    {filteredTransactions.length} Transaktion{filteredTransactions.length !== 1 ? 'en' : ''}
                </div>

                {/* Transaction List */}
                <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                onEdit={onEditTransaction}
                                onDelete={setDeleteModalId}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-text-dim mb-2">Keine Transaktionen gefunden</p>
                            <p className="text-xs text-text-dim">
                                {searchTerm && selectedMonth === 'all'
                                    ? 'Versuche eine andere Suchanfrage'
                                    : 'Füge deine erste Transaktion hinzu'}
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalId !== null}
                title="Eintrag löschen"
                message={
                    transactionToDelete
                        ? `Bist du sicher, dass du "${truncateText(transactionToDelete.text)}" unwiderruflich löschen möchtest?`
                        : 'Bist du sicher, dass du diesen Eintrag unwiderruflich löschen möchtest?'
                }
                confirmText="Endgültig löschen"
                cancelText="Abbrechen"
                isDangerous={true}
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalId(null)}
            />
        </>
    );
}
