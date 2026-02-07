'use client';

import { useBudgetStore } from '@/store/budgetStore';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/types';
import { Pencil, X } from 'lucide-react';

interface TransactionItemProps {
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: number) => void;
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
    const { categories, settings } = useBudgetStore();
    const cat = categories[transaction.category] || { label: transaction.category, color: '#ccc' };
    const isExpense = transaction.amount < 0;

    return (
        <div
            className={`
        flex justify-between items-center p-5 rounded-[18px]
        bg-white/[0.02] border border-white/[0.08]
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:bg-white/[0.05] hover:border-white/[0.15] hover:scale-[1.01]
        animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]
      `}
        >
            <div className="flex flex-col">
                <h4 className="font-outfit text-base font-semibold text-text-main mb-1">
                    {transaction.text}
                </h4>
                <p className="text-xs text-text-dim">
                    <span style={{ color: cat.color }}>●</span> {cat.label} • {transaction.date}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <span
                    className={`font-outfit font-bold text-lg ${isExpense ? 'text-danger' : 'text-success'
                        }`}
                >
                    {isExpense ? '-' : '+'}
                    {formatCurrency(Math.abs(transaction.amount), settings.currency)}
                </span>
                <button
                    onClick={() => onEdit(transaction)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent text-text-dim hover:text-accent hover:bg-white/10 transition-all"
                    title="Bearbeiten"
                >
                    <Pencil size={16} />
                </button>
                <button
                    onClick={() => onDelete(transaction.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent text-text-dim hover:text-danger hover:bg-danger/10 transition-all"
                    title="Löschen"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
