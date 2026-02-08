import { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useBudgetStore } from '@/store/budgetStore';
import { Transaction, RecurringTransaction, ValidationError } from '@/types';
import { validateTransaction } from '@/lib/utils';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface TransactionFormProps {
    editTransaction?: Transaction | null;
    editRecurringTransaction?: RecurringTransaction | null;
    onCancel?: () => void;
    onSuccess?: () => void;
    initialIsRecurring?: boolean;
    accountId?: string; // New prop
}

export function TransactionForm({
    editTransaction,
    editRecurringTransaction,
    onCancel,
    onSuccess,
    initialIsRecurring = false,
    accountId
}: TransactionFormProps) {
    const { categories, accounts, activeAccountId, addTransaction, updateTransaction, addRecurringTransaction, updateRecurringTransaction } = useBudgetStore();

    // Determine initial values
    const initialData = editTransaction || editRecurringTransaction;
    const isEdit = !!initialData;

    const [type, setType] = useState<'income' | 'expense'>(
        initialData ? (initialData.amount >= 0 ? 'income' : 'expense') : 'expense'
    );
    const [text, setText] = useState(initialData?.text || '');
    const [amount, setAmount] = useState(initialData ? Math.abs(initialData.amount).toString() : '');
    const [category, setCategory] = useState(initialData?.category || 'General');
    // Account Selection
    const [selectedAccountId, setSelectedAccountId] = useState(accountId || editTransaction?.accountId || activeAccountId || (accounts.length > 0 ? accounts[0].id : ''));

    // Recurring state
    const [isRecurring, setIsRecurring] = useState(initialIsRecurring || !!editRecurringTransaction);
    const [dayOfMonth, setDayOfMonth] = useState(editRecurringTransaction?.dayOfMonth.toString() || '1');
    const [startDate, setStartDate] = useState(editRecurringTransaction?.startDate || new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(editRecurringTransaction?.endDate || '');

    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Update state when props change...
    useEffect(() => {
        if (editTransaction) {
            setText(editTransaction.text);
            setAmount(Math.abs(editTransaction.amount).toString());
            setType(editTransaction.amount >= 0 ? 'income' : 'expense');
            setCategory(editTransaction.category);
            setIsRecurring(false);
        } else if (editRecurringTransaction) {
            setText(editRecurringTransaction.text);
            setAmount(Math.abs(editRecurringTransaction.amount).toString());
            setType(editRecurringTransaction.amount >= 0 ? 'income' : 'expense');
            setCategory(editRecurringTransaction.category);
            setIsRecurring(true);
            setDayOfMonth(editRecurringTransaction.dayOfMonth.toString());
            setStartDate(editRecurringTransaction.startDate);
            setEndDate(editRecurringTransaction.endDate || '');
        }
    }, [editTransaction, editRecurringTransaction]);

    const categoryOptions = Object.entries(categories).map(([key, value]) => ({
        value: key,
        label: value.label,
    }));

    const accountOptions = accounts.map(acc => ({
        value: acc.id,
        label: `${acc.name} (${acc.balance.toFixed(2)}€)`
    }));

    const getFieldError = useCallback((field: string) => {
        return errors.find((e) => e.field === field)?.message || '';
    }, [errors]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setSuccess(false);

        // Validation
        const validationErrors = validateTransaction(text, amount);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));

            const finalAmount = type === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

            if (editRecurringTransaction) {
                // Update Recurring Transaction
                updateRecurringTransaction(editRecurringTransaction.id, {
                    text: text.trim(),
                    amount: finalAmount,
                    category,
                    dayOfMonth: parseInt(dayOfMonth) || 1,
                    startDate,
                    endDate: endDate || undefined
                    // accountId removed as it's not supported in RecurringTransaction type yet
                });
            } else if (isRecurring && !editTransaction) {
                // Add Recurring Transaction
                addRecurringTransaction({
                    text: text.trim(),
                    amount: finalAmount,
                    category,
                    interval: 'monthly',
                    dayOfMonth: parseInt(dayOfMonth) || 1,
                    startDate,
                    endDate: endDate || undefined
                    // accountId removed
                });
            } else if (editTransaction) {
                // Update Normal Transaction
                updateTransaction(editTransaction.id, {
                    text: text.trim(),
                    amount: finalAmount,
                    category,
                    accountId: selectedAccountId // Update account
                });
            } else {
                // Add Normal Transaction
                addTransaction({
                    text: text.trim(),
                    amount: finalAmount,
                    category,
                    date: '',
                    month: '',
                    accountId: selectedAccountId // Use selected account
                });
            }

            setSuccess(true);
            setTimeout(() => {
                // Reset form only if not editing (or if we want to close modal, usually parent handles closes)
                if (!isEdit) {
                    setText('');
                    setAmount('');
                    setCategory('General');
                    setType('expense');
                    setIsRecurring(false);
                }
                setSuccess(false);
                onSuccess?.();
            }, 1000);

            if (!isRecurring && !editRecurringTransaction) onCancel?.();
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setErrors([]);
        setSuccess(false);
        onCancel?.();
    };

    return (
        <Card>
            <h3 className="font-outfit text-lg font-bold text-text-main mb-6">
                {editTransaction ? 'Eintrag bearbeiten' : editRecurringTransaction ? 'Dauerauftrag bearbeiten' : 'Neue Transaktion'}
            </h3>
            <form onSubmit={handleSubmit}>
                {/* Type Toggle */}
                <div className="flex p-1 bg-black/20 border border-white/5 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${type === 'expense'
                            ? 'bg-danger text-white shadow-lg shadow-danger/25'
                            : 'text-text-dim hover:text-white'
                            }`}
                    >
                        Ausgabe
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${type === 'income'
                            ? 'bg-success text-white shadow-lg shadow-success/25'
                            : 'text-text-dim hover:text-white'
                            }`}
                    >
                        Einnahme
                    </button>
                </div>

                <Input
                    id="text"
                    label="Bezeichnung"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        if (errors.find((e) => e.field === 'text')) {
                            setErrors(errors.filter((e) => e.field !== 'text'));
                        }
                    }}
                    placeholder="z.B. Gehalt, Miete, Einkauf"
                    error={getFieldError('text')}
                    disabled={isLoading}
                />
                <Input
                    id="amount"
                    label="Betrag (€)"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => {
                        setAmount(e.target.value);
                        if (errors.find((e) => e.field === 'amount')) {
                            setErrors(errors.filter((e) => e.field !== 'amount'));
                        }
                    }}
                    placeholder="Betrag eingeben (z.B. 100)"
                    error={getFieldError('amount')}
                    disabled={isLoading}
                />
                <Select
                    id="category"
                    label="Kategorie"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={categoryOptions}
                    disabled={isLoading}
                />

                {/* Account Selection */}
                <Select
                    id="account"
                    label="Konto"
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    options={accountOptions}
                    disabled={isLoading || !!accountId} // Disable if fixed account passed via prop
                />

                {/* Recurring Toggle - Only for new transactions OR when editing recurring */}
                {(!editTransaction || editRecurringTransaction) && (
                    <div className="mb-6 p-4 rounded-xl bg-surface/50 border border-white/5 space-y-4">
                        {!editRecurringTransaction && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <RefreshCw className={`w-5 h-5 ${isRecurring ? 'text-accent' : 'text-text-dim'}`} />
                                    <div>
                                        <p className="text-sm font-medium text-text-main">Wiederkehrende Zahlung</p>
                                        <p className="text-xs text-text-dim">Automatisch jeden Monat buchen</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isRecurring}
                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                    className="w-5 h-5 rounded border-white/20 bg-black/40 text-accent focus:ring-accent"
                                />
                            </div>
                        )}

                        {isRecurring && (
                            <div className="animate-in slide-in-from-top-2 fade-in space-y-4 pt-2 border-t border-white/5">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Startdatum"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <Input
                                        label="Enddatum (Optional)"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>

                                <Input
                                    label="Tag der Zahlung (1-31)"
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={dayOfMonth}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (val >= 1 && val <= 31) setDayOfMonth(e.target.value);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-4 rounded-lg bg-success/10 border border-success/30 flex items-center gap-3">
                        <CheckCircle size={20} className="text-success flex-shrink-0" />
                        <p className="text-sm text-success font-medium">
                            {isEdit
                                ? 'Eintrag aktualisiert!'
                                : isRecurring
                                    ? 'Dauerauftrag eingerichtet!'
                                    : 'Transaktion hinzugefügt!'}
                        </p>
                    </div>
                )}

                {/* General Errors */}
                {errors.length > 0 && !success && (
                    <div className="mb-4 p-4 rounded-lg bg-danger/10 border border-danger/30">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle size={18} className="text-danger flex-shrink-0" />
                            <p className="text-sm font-medium text-danger">
                                Bitte überprüfe folgendes:
                            </p>
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                            {errors.map((error) => (
                                <li key={error.field} className="text-sm text-danger/90">
                                    {error.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button type="submit" size="lg" disabled={isLoading} className="flex-1">
                        {isLoading
                            ? isEdit
                                ? 'Wird gespeichert...'
                                : 'Wird hinzugefügt...'
                            : isEdit
                                ? 'Speichern'
                                : 'Hinzufügen'}
                    </Button>
                    {isEdit && (
                        <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Abbrechen
                        </Button>
                    )}
                </div>
            </form>
        </Card>
    );
}
