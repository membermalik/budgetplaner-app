import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Account, AccountType } from '@/types';
import { useBudgetStore } from '@/store/budgetStore';
import { formatCurrency, cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Wallet, Calendar, Edit2, Plus, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TransactionForm } from '@/components/transactions/TransactionForm';

interface AccountDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    account: Account | null;
}

type Mode = 'view' | 'edit' | 'transaction';

export function AccountDetailModal({ isOpen, onClose, account }: AccountDetailModalProps) {
    const { transactions, accountTypes, categories, updateAccount, deleteAccount } = useBudgetStore();
    const [mode, setMode] = useState<Mode>('view');

    // Edit Form State
    const [editName, setEditName] = useState('');
    const [editType, setEditType] = useState('');

    if (!account) return null;

    // Reset state when modal opens/changes account
    if (isOpen && mode !== 'view' && account.name !== editName && !editName) {
        setEditName(account.name);
        setEditType(account.type);
    }

    const accountTransactions = transactions
        .filter(t => t.accountId === account.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalDeposited = accountTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const accountTypeData = accountTypes.find(t => t.id === account.type);

    const handleSaveEdit = () => {
        if (editName.trim()) {
            updateAccount(account.id, {
                name: editName,
                type: editType
            });
            setMode('view');
        }
    };

    const handleDelete = () => {
        if (confirm('Möchtest du dieses Konto wirklich löschen? Alle zugehörigen Transaktionen werden ebenfalls gelöscht.')) {
            deleteAccount(account.id);
            onClose();
        }
    };

    const handleClose = () => {
        setMode('view');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={
            mode === 'edit' ? 'Konto bearbeiten' :
                mode === 'transaction' ? 'Transaktion hinzufügen' :
                    account.name
        }>
            {mode === 'view' && (
                <div className="space-y-6">
                    {/* Actions Header */}
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                setEditName(account.name);
                                setEditType(account.type);
                                setMode('edit')
                            }}
                            className="text-xs"
                        >
                            <Edit2 size={14} className="mr-1" />
                            Bearbeiten
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setMode('transaction')}
                            className="text-xs"
                        >
                            <Plus size={14} className="mr-1" />
                            Transaktion
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-surface border border-surface-border">
                            <p className="text-xs text-text-dim uppercase tracking-wider mb-1">Aktueller Stand</p>
                            <p className="text-2xl font-bold text-text-main">
                                {formatCurrency(account.balance, account.currency)}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface border border-surface-border">
                            <p className="text-xs text-text-dim uppercase tracking-wider mb-1">Gesamt Eingezahlt</p>
                            <p className="text-2xl font-bold text-success flex items-center gap-2">
                                <ArrowDownLeft size={18} />
                                {formatCurrency(totalDeposited, account.currency)}
                            </p>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-white/5">
                        <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center text-xl">
                            {accountTypeData?.emoji || '💰'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-main">{accountTypeData?.label || account.type}</p>
                            <p className="text-xs text-text-dim">Erstellt am {new Date(account.createdAt).toLocaleDateString('de-DE')}</p>
                        </div>
                    </div>

                    {/* History */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-text-dim flex items-center gap-2">
                            <Wallet size={14} />
                            Verlauf
                        </h4>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {accountTransactions.length === 0 ? (
                                <div className="text-center py-8 text-text-dim border border-dashed border-white/10 rounded-xl">
                                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">Noch keine Transaktionen</p>
                                </div>
                            ) : (
                                accountTransactions.map((trx) => (
                                    <div
                                        key={trx.id}
                                        className="flex justify-between items-center p-3 rounded-xl bg-surface hover:bg-surface-hover transition-colors border border-surface-border"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-surface-text font-bold"
                                                style={{ backgroundColor: categories[trx.category]?.color || '#64748b' }}
                                            >
                                                {trx.text.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-text-main truncate max-w-[150px]">{trx.text}</p>
                                                <p className="text-[10px] text-text-dim">{new Date(trx.date).toLocaleDateString('de-DE')}</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "text-sm font-bold flex items-center gap-1",
                                            trx.amount > 0 ? "text-success" : "text-text-main"
                                        )}>
                                            {trx.amount > 0 ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                            {formatCurrency(Math.abs(trx.amount), account.currency)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {mode === 'edit' && (
                <div className="space-y-6">
                    <Input
                        label="Kontoname"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                    />

                    <div>
                        <label className="block text-xs font-semibold text-text-dim mb-2 uppercase tracking-wide">Typ</label>
                        <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-text-main appearance-none focus:outline-none focus:border-accent"
                        >
                            {accountTypes.map(t => (
                                <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="secondary" onClick={() => setMode('view')} className="flex-1">Abbrechen</Button>
                        <Button onClick={handleSaveEdit} className="flex-1">Speichern</Button>
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-6">
                        <button
                            onClick={handleDelete}
                            className="text-danger text-sm font-medium flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <Trash2 size={16} />
                            Konto löschen
                        </button>
                    </div>
                </div>
            )}

            {mode === 'transaction' && (
                <div className="pt-2">
                    <TransactionForm
                        onSuccess={() => {
                            // Short delay to show success message inside form
                            setTimeout(() => setMode('view'), 1000);
                        }}
                        onCancel={() => setMode('view')}
                        accountId={account.id}
                    />
                </div>
            )}
        </Modal>
    );
}
