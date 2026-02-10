import { useState } from 'react';
import { RecurringTransaction } from '@/types';
import { useBudgetStore } from '@/store/budgetStore';
import { Button } from '@/components/ui/Button';
import { Trash2, Calendar, RefreshCw, Edit2, ChevronDown, ChevronUp, Bell, StickyNote, History } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecurringManagerProps {
    onAdd?: () => void;
    onEdit?: (transaction: RecurringTransaction) => void;
}

export function RecurringManager({ onAdd, onEdit }: RecurringManagerProps) {
    const { recurringTransactions, deleteRecurringTransaction, categories } = useBudgetStore();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

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
                    recurringTransactions.map((rt) => {
                        const isExpanded = expandedId === rt.id;
                        const category = categories[rt.category] || { label: rt.category, color: '#fff' };

                        return (
                            <div
                                key={rt.id}
                                className={cn(
                                    "group flex flex-col bg-surface/50 border rounded-2xl transition-all duration-300 overflow-hidden",
                                    isExpanded ? "border-accent/40 bg-surface/80 ring-1 ring-accent/20" : "border-white/5 hover:border-white/10"
                                )}
                            >
                                {/* Header / Summary Row */}
                                <div
                                    className="flex justify-between items-center p-4 cursor-pointer"
                                    onClick={() => toggleExpand(rt.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-black/30 shadow-inner relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 opacity-20" style={{ backgroundColor: category.color }} />
                                            <span className="font-outfit font-bold text-lg text-white z-10">{rt.dayOfMonth}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-base text-text-main group-hover:text-accent transition-colors">
                                                {rt.text}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-text-dim mt-0.5">
                                                <span
                                                    className="inline-block w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                                <span>{category.label}</span>
                                                <span className="text-text-dimmer">•</span>
                                                <span>Monatlich</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={cn(
                                            "font-outfit font-bold text-lg",
                                            rt.amount > 0 ? 'text-success' : 'text-text-main'
                                        )}>
                                            {rt.amount > 0 ? '+' : ''}
                                            {Math.abs(rt.amount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                        </span>
                                        <div className="text-text-dim p-1">
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed View (Expanded) */}
                                {isExpanded && (
                                    <div className="border-t border-white/5 bg-black/10 animate-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            {/* Details Left */}
                                            <div className="space-y-4">
                                                {rt.noticePeriod && (
                                                    <div className="flex gap-3">
                                                        <Bell className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-text-dim uppercase tracking-wider font-semibold mb-1">
                                                                Kündigungsfrist
                                                            </p>
                                                            <p className="text-text-main">{rt.noticePeriod}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {rt.notes && (
                                                    <div className="flex gap-3">
                                                        <StickyNote className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-text-dim uppercase tracking-wider font-semibold mb-1">
                                                                Notizen
                                                            </p>
                                                            <p className="text-text-main whitespace-pre-line">{rt.notes}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex gap-3 text-text-dim text-xs">
                                                    <Calendar className="w-4 h-4 shrink-0" />
                                                    <p>Angelegt am {formatDate(rt.startDate)}</p>
                                                </div>
                                            </div>

                                            {/* History Right */}
                                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                                <div className="flex items-center gap-2 mb-3 text-text-dim">
                                                    <History className="w-4 h-4" />
                                                    <span className="text-xs font-semibold uppercase tracking-wider">Änderungshistorie</span>
                                                </div>

                                                {rt.history && rt.history.length > 0 ? (
                                                    <ul className="space-y-3">
                                                        {rt.history.slice(0, 3).map((entry, idx) => (
                                                            <li key={idx} className="text-xs relative pl-3 border-l-2 border-white/10">
                                                                <p className="text-text-dim mb-0.5">{formatDate(entry.date)}</p>
                                                                {entry.changes.map((change, cIdx) => (
                                                                    <p key={cIdx} className="text-text-main">{change}</p>
                                                                ))}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-xs text-text-dim/50 italic">Keine Änderungen bisher.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions Footer */}
                                        <div className="flex justify-end gap-2 p-4 pt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); onEdit?.(rt); }}
                                                className="text-text-dim hover:text-white"
                                            >
                                                <Edit2 size={14} className="mr-2" />
                                                Bearbeiten
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); deleteRecurringTransaction(rt.id); }}
                                                className="text-text-dim hover:text-danger hover:bg-danger/10"
                                            >
                                                <Trash2 size={14} className="mr-2" />
                                                Löschen
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
