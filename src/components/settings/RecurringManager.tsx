import { RecurringTransaction } from '@/types';
import { useBudgetStore } from '@/store/budgetStore';
import { Button } from '@/components/ui/Button';
import { Trash2, Calendar, RefreshCw, Plus, Edit2 } from 'lucide-react';

interface RecurringManagerProps {
    onAdd?: () => void;
    onEdit?: (transaction: RecurringTransaction) => void;
}

export function RecurringManager({ onAdd, onEdit }: RecurringManagerProps) {
    const { recurringTransactions, deleteRecurringTransaction, categories } = useBudgetStore();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 text-text-dim">
                <RefreshCw className="w-4 h-4" />
                <h4 className="font-outfit font-medium text-sm uppercase tracking-wider">
                    Daueraufträge & Abos
                </h4>
            </div>

            <div className="space-y-3">
                {recurringTransactions.length === 0 ? (
                    <div className="text-center p-8 bg-black/20 rounded-xl border border-white/5">
                        <Calendar className="w-8 h-8 mx-auto text-text-dim mb-2 opacity-50" />
                        <p className="text-sm text-text-dim">Keine wiederkehrenden Zahlungen eingerichtet.</p>
                        <p className="text-xs text-text-dimmer mt-1">
                            Erstelle eine neue Transaktion und aktiviere "Wiederkehrend".
                        </p>
                    </div>
                ) : (
                    recurringTransactions.map((rt) => (
                        <div
                            key={rt.id}
                            className="flex justify-between items-center p-4 bg-surface/50 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/30 text-xs font-bold font-outfit text-surface-text"
                                    style={{ color: categories[rt.category]?.color || '#fff' }}
                                >
                                    {rt.dayOfMonth}.
                                </div>
                                <div>
                                    <p className="font-medium text-text-main">{rt.text}</p>
                                    <div className="flex items-center gap-2 text-xs text-text-dim">
                                        <span
                                            className="px-1.5 py-0.5 rounded-md bg-white/5 text-white/70"
                                            style={{ borderLeft: `2px solid ${categories[rt.category]?.color || '#fff'}` }}
                                        >
                                            {categories[rt.category]?.label || rt.category}
                                        </span>
                                        <span>• Monatlich</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`font-outfit font-bold ${rt.amount > 0 ? 'text-success' : 'text-text-main'}`}>
                                    {rt.amount > 0 ? '+' : ''}
                                    {Math.abs(rt.amount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => onEdit?.(rt)}
                                        className="p-2 text-text-dim hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                        title="Bearbeiten"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteRecurringTransaction(rt.id)}
                                        className="p-2 text-text-dim hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                        title="Löschen"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
