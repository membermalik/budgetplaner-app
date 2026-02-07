import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useBudgetStore } from '@/store/budgetStore';
import { formatCurrency, cn } from '@/lib/utils';
import { Plus, Trash2, Send } from 'lucide-react';
import { AccountDetailModal } from './AccountDetailModal'; // Import new modal
import { Account } from '@/types';

export function AccountsManager() {
    const [showForm, setShowForm] = useState(false);
    const [showTypeManager, setShowTypeManager] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null); // State for detail view
    const [newType, setNewType] = useState({ label: '', emoji: '' });

    const [formData, setFormData] = useState({
        name: '',
        type: 'bank', // Initial default, will be overwritten by dynamic default if available
        balance: '',
        currency: '€',
        color: '#6366f1',
    });

    const [transferData, setTransferData] = useState({
        fromId: '',
        toId: '',
        amount: '',
    });

    const {
        accounts,
        activeAccountId,
        addAccount,
        deleteAccount,
        setActiveAccount,
        transferBetweenAccounts,
        settings,
        accountTypes,
        addAccountType,
        deleteAccountType
    } = useBudgetStore();

    // ... handlers remain same ...
    const handleAddType = () => {
        if (newType.label && newType.emoji) {
            const id = newType.label.toLowerCase().replace(/\s+/g, '-');
            addAccountType({ id, label: newType.label, emoji: newType.emoji });
            setNewType({ label: '', emoji: '' });
        }
    };

    const handleAddAccount = () => {
        if (formData.name.trim() && formData.balance !== '') {
            addAccount({
                name: formData.name,
                type: formData.type,
                balance: parseFloat(formData.balance),
                currency: formData.currency,
                color: formData.color,
            });
            setFormData({
                name: '',
                type: accountTypes[0]?.id || 'bank', // dynamic default
                balance: '',
                currency: '€',
                color: '#6366f1',
            });
            setShowForm(false);
        }
    };

    const handleTransfer = () => {
        if (transferData.fromId && transferData.toId && transferData.amount) {
            transferBetweenAccounts(
                transferData.fromId,
                transferData.toId,
                parseFloat(transferData.amount)
            );
            setTransferData({ fromId: '', toId: '', amount: '' });
            setShowTransferModal(false);
        }
    };

    // ...

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="font-outfit text-base font-semibold text-text-main">Konten & Geldbörsen</h3>
                {!showForm && (
                    <Button
                        size="sm"
                        onClick={() => setShowForm(true)}
                        variant="primary"
                        className="flex items-center gap-1"
                    >
                        <Plus size={16} />
                        Neu
                    </Button>
                )}
            </div>

            {/* Total Balance */}
            {!showForm && accounts.length > 0 && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-accent/20 to-secondary/20 border border-surface-border relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <p className="text-sm font-medium text-text-dim mb-2 uppercase tracking-wider">Gesamtvermögen</p>
                    <p className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight">
                        {formatCurrency(totalBalance, settings.currency)}
                    </p>
                </div>
            )}

            {/* Inline Add Account Form */}
            {showForm ? (
                <Card className="p-6 animate-in slide-in-from-top-4 fade-in duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-outfit text-lg font-bold text-text-main">Neues Konto</h4>
                        <button onClick={() => setShowForm(false)} className="text-text-dim hover:text-text-main transition-colors">
                            <span className="sr-only">Schließen</span>
                            <Plus size={24} className="rotate-45" />
                        </button>
                    </div>

                    <div className="space-y-5">
                        <Input
                            label="Kontoname"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="z.B. Hauptkonto"
                            autoFocus
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-xs font-semibold text-text-dim mb-2 uppercase tracking-tight flex justify-between">
                                    <span>Typ</span>
                                    <button
                                        onClick={() => setShowTypeManager(true)}
                                        className="text-accent hover:text-accent/80 transition-colors text-[10px]"
                                    >
                                        Bearbeiten
                                    </button>
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-surface border border-surface-border rounded-2xl px-5 py-4 text-text-main font-inter text-[0.95rem] appearance-none cursor-pointer focus:outline-none focus:bg-surface-hover focus:shadow-[0_0_0_4px_var(--accent-glow)] transition-all duration-300"
                                    >
                                        {accountTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.emoji} {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none">
                                        <Plus className="rotate-45" size={16} />
                                    </div>
                                </div>
                            </div>

                            <Input
                                label="Startsaldo"
                                type="number"
                                value={formData.balance}
                                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>

                        <Button
                            onClick={handleAddAccount}
                            className="w-full mt-2 shadow-lg shadow-accent/20"
                            size="lg"
                            disabled={!formData.name.trim() || formData.balance === ''}
                        >
                            Konto erstellen
                        </Button>
                    </div>
                </Card>
            ) : null}

            {/* Type Manager Modal */}
            <Modal
                isOpen={showTypeManager}
                onClose={() => setShowTypeManager(false)}
                title="Kontotypen verwalten"
            >
                <div className="space-y-6">
                    {/* Add New Type */}
                    <div className="p-4 bg-surface rounded-xl border border-surface-border">
                        <h4 className="text-sm font-semibold text-text-main mb-3">Neuen Typ hinzufügen</h4>
                        <div className="grid grid-cols-[1fr,60px,auto] gap-2">
                            <input
                                placeholder="Bezeichnung (z.B. PayPal)"
                                value={newType.label}
                                onChange={(e) => setNewType({ ...newType, label: e.target.value })}
                                className="bg-surface-hover border border-surface-border rounded-lg px-3 py-2 text-sm text-text-main placeholder:text-text-dim focus:outline-none focus:border-accent"
                            />
                            <input
                                placeholder="Emoji"
                                value={newType.emoji}
                                onChange={(e) => setNewType({ ...newType, emoji: e.target.value })}
                                className="bg-surface-hover border border-surface-border rounded-lg px-3 py-2 text-sm text-center text-text-main placeholder:text-text-dim focus:outline-none focus:border-accent"
                                maxLength={2}
                            />
                            <Button
                                size="sm"
                                onClick={handleAddType}
                                disabled={!newType.label || !newType.emoji}
                            >
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>

                    {/* Type List */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {accountTypes.map((type) => (
                            <div key={type.id} className="flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-hover border border-surface-border group transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center text-xl shadow-sm">
                                        {type.emoji}
                                    </div>
                                    <span className="font-medium text-text-main">{type.label}</span>
                                </div>
                                <button
                                    onClick={() => deleteAccountType(type.id)}
                                    className="p-2 text-text-dim hover:text-danger hover:bg-danger/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    title="Löschen"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Accounts Grid */}
            {!showForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {accounts.length === 0 ? (
                        <Card className="col-span-full text-center py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">Keine Konten</h3>
                            <p className="text-text-dim text-sm mb-6">Erstelle dein erstes Konto um zu starten.</p>
                            <Button onClick={() => setShowForm(true)} variant="secondary">Jetzt erstellen</Button>
                        </Card>
                    ) : (
                        accounts.map((account) => (
                            <Card
                                key={account.id}
                                onClick={() => setSelectedAccount(account)} // Open Detail View
                                className="p-6 cursor-pointer transition-all duration-300 relative group overflow-hidden bg-surface hover:bg-surface-hover border border-surface-border hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                            >
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner bg-surface border border-surface-border leading-none pt-1"
                                        )}>
                                            {accountTypes.find(t => t.id === account.type)?.emoji || '❓'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg leading-tight text-text-main group-hover:text-accent transition-colors">
                                                {account.name}
                                            </h4>
                                            <p className="text-xs font-medium opacity-80 uppercase tracking-wider mt-1 text-text-dim group-hover:text-text-main transition-colors">
                                                {accountTypes.find(t => t.id === account.type)?.label || account.type}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteAccount(account.id);
                                            }}
                                            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/10 text-text-dim hover:text-danger"
                                            title="Löschen"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end relative z-10">
                                    <p className="text-3xl font-bold tracking-tight text-text-main group-hover:scale-105 transition-transform origin-right">
                                        {formatCurrency(account.balance, account.currency)}
                                    </p>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Transfer Button */}
            {!showForm && accounts.length >= 2 && (
                <div className="flex justify-end pt-2">
                    <Button
                        variant="secondary"
                        onClick={() => setShowTransferModal(true)}
                        className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                    >
                        <Send size={16} />
                        Übertrag
                    </Button>
                </div>
            )}

            {/* Transfer Modal */}
            <Modal
                isOpen={showTransferModal}
                onClose={() => setShowTransferModal(false)}
                title="Transferieren"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-text-dim mb-2">Von</label>
                        <select
                            value={transferData.fromId}
                            onChange={(e) => setTransferData({ ...transferData, fromId: e.target.value })}
                            className="w-full bg-surface-hover border border-surface-border rounded-xl px-4 py-3 text-text-main text-sm focus:outline-none focus:border-accent"
                        >
                            <option value="">Wähle Quellkonto</option>
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.name} ({formatCurrency(acc.balance, acc.currency)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-dim mb-2">Nach</label>
                        <select
                            value={transferData.toId}
                            onChange={(e) => setTransferData({ ...transferData, toId: e.target.value })}
                            className="w-full bg-surface-hover border border-surface-border rounded-xl px-4 py-3 text-text-main text-sm focus:outline-none focus:border-accent"
                        >
                            <option value="">Wähle Zielkonto</option>
                            {accounts
                                .filter((acc) => acc.id !== transferData.fromId)
                                .map((acc) => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name} ({formatCurrency(acc.balance, acc.currency)})
                                    </option>
                                ))}
                        </select>
                    </div>

                    <Input
                        label="Betrag"
                        type="number"
                        value={transferData.amount}
                        onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                        placeholder="0.00"
                    />

                    <Button onClick={handleTransfer} className="w-full">
                        Ausführen
                    </Button>
                </div>
            </Modal>

            {/* Account Detail Modal Integration */}
            <AccountDetailModal
                isOpen={!!selectedAccount}
                onClose={() => setSelectedAccount(null)}
                account={selectedAccount}
            />
        </div>
    );
}
