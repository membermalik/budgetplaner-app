'use client';

import { create } from 'zustand';
import { BudgetState, Transaction, Statistics } from '@/types';
import { DEFAULT_CATEGORIES, DEFAULT_SPARKASSE, DEFAULT_SETTINGS, DEFAULT_ACCOUNT_TYPES } from '@/lib/constants';
import { generateID, formatDate, formatMonth } from '@/lib/utils';
import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from '@/actions/transaction.actions';
import {
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountTypes
} from '@/actions/account.actions';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '@/actions/category.actions';
import {
    getSettings,
    updateSettings,
    getSparkasseData,
    updateSparkasse
} from '@/actions/settings.actions';
import {
    getRecurringTransactions,
    createRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction
} from '@/actions/recurring.actions';

export const useBudgetStore = create<BudgetState>((set, get) => ({
    transactions: [],
    categories: DEFAULT_CATEGORIES,
    accounts: [],
    recurringTransactions: [],
    sparkasse: DEFAULT_SPARKASSE,
    settings: DEFAULT_SETTINGS,
    activeAccountId: undefined,
    accountTypes: DEFAULT_ACCOUNT_TYPES,
    isLoading: true,
    error: null,

    fetchInitialData: async () => {
        set({ isLoading: true });
        try {
            const [
                transactions,
                accounts,
                categories,
                settings,
                sparkasse,
                recurring
            ] = await Promise.all([
                getTransactions(),
                getAccounts(),
                getCategories(),
                getSettings(),
                getSparkasseData(),
                getRecurringTransactions()
            ]);

            set({
                transactions,
                accounts,
                categories: Object.keys(categories).length > 0 ? categories : DEFAULT_CATEGORIES,
                settings: settings || DEFAULT_SETTINGS,
                sparkasse: sparkasse || DEFAULT_SPARKASSE,
                recurringTransactions: recurring,
                isLoading: false
            });
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            set({ error: "Failed to load data", isLoading: false });
        }
    },

    // Transaction Actions
    addTransaction: async (transaction) => {
        try {
            const newTransaction = await createTransaction(transaction);
            if (newTransaction) {
                set(state => ({
                    transactions: [...state.transactions, newTransaction]
                }));
                // Fetch updated accounts to ensure correct balance
                const updatedAccounts = await getAccounts();
                set({ accounts: updatedAccounts });
            }
        } catch (e) {
            console.error(e);
        }
    },

    updateTransaction: async (id, updates) => {
        try {
            const updated = await updateTransaction(id, updates);
            if (updated) {
                set(state => ({
                    transactions: state.transactions.map(t => t.id === id ? updated : t)
                }));
                const accounts = await getAccounts();
                set({ accounts });
            }
        } catch (e) { console.error(e); }
    },

    deleteTransaction: async (id) => {
        try {
            const success = await deleteTransaction(id);
            if (success) {
                set(state => ({
                    transactions: state.transactions.filter(t => t.id !== id)
                }));
                const accounts = await getAccounts();
                set({ accounts });
            }
        } catch (e) { console.error(e); }
    },

    // Recurring Transaction Actions
    addRecurringTransaction: async (transaction) => {
        try {
            set({ error: null });
            const newRec = await createRecurringTransaction(transaction);
            if (newRec) {
                set(state => ({
                    recurringTransactions: [...state.recurringTransactions, newRec]
                }));
            }
        } catch (e: any) {
            console.error("Store Add Error:", e);
            set({ error: e.message || "Failed to add transaction" });
            throw e; // Rethrow so component knows
        }
    },

    deleteRecurringTransaction: async (id) => {
        try {
            await deleteRecurringTransaction(id);
            set(state => ({
                recurringTransactions: state.recurringTransactions.filter(t => t.id !== id)
            }));
        } catch (e) { console.error(e); }
    },

    updateRecurringTransaction: async (id, updates) => {
        try {
            const updated = await updateRecurringTransaction(id, updates);
            if (updated) {
                set(state => ({
                    recurringTransactions: state.recurringTransactions.map(t => t.id === id ? updated : t)
                }));
            }
        } catch (e) { console.error(e); }
    },

    checkRecurringTransactions: async () => {
        const state = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDay = today.getDate();
        const currentMonthStr = formatMonth();

        const transactionsToCreate: any[] = [];
        const recurringUpdates: { id: string, date: string }[] = [];

        state.recurringTransactions.forEach(rt => {
            if (!rt.isActive) return;
            // Date Checks
            const startDate = new Date(rt.startDate);
            startDate.setHours(0, 0, 0, 0);

            if (today < startDate) return;
            if (rt.endDate) {
                const endDate = new Date(rt.endDate);
                endDate.setHours(0, 0, 0, 0);
                if (today > endDate) return;
            }

            const lastExecutionDate = rt.lastExecuted ? new Date(rt.lastExecuted) : null;
            const lastExecutionMonthStr = lastExecutionDate ? formatMonth(lastExecutionDate) : '';

            if (lastExecutionMonthStr !== currentMonthStr && currentDay >= rt.dayOfMonth) {
                transactionsToCreate.push({
                    text: rt.text,
                    amount: rt.amount,
                    category: rt.category,
                    date: formatDate(today),
                    month: formatMonth(today),
                });
                recurringUpdates.push({ id: rt.id, date: today.toISOString() });
            }
        });

        // Execute 
        for (const t of transactionsToCreate) {
            await get().addTransaction(t);
        }
        for (const update of recurringUpdates) {
            await get().updateRecurringTransaction(update.id, { lastExecuted: update.date });
        }
    },


    // Account Types
    addAccountType: (type) => {
        set((state) => ({
            accountTypes: [...state.accountTypes, type],
        }));
    },
    deleteAccountType: (id) => {
        set((state) => ({
            accountTypes: state.accountTypes.filter((t) => t.id !== id),
        }));
    },

    // Account Actions
    addAccount: async (account) => {
        try {
            const newAccount = await createAccount(account);
            if (newAccount) {
                set(state => ({
                    accounts: [...state.accounts, newAccount]
                }));
                // Create initial transaction if needed
                if (account.balance > 0 && newAccount.id) {
                    await get().addTransaction({
                        text: 'Startsaldo',
                        amount: account.balance,
                        category: 'General',
                        date: formatDate(),
                        month: formatMonth(),
                        accountId: newAccount.id
                    });
                }
            }
        } catch (e) { console.error(e); }
    },

    deleteAccount: async (id) => {
        try {
            await deleteAccount(id);
            set(state => ({
                accounts: state.accounts.filter(a => a.id !== id),
                transactions: state.transactions.filter(t => t.accountId !== id),
                activeAccountId: state.activeAccountId === id ? undefined : state.activeAccountId
            }));
            const transactions = await getTransactions();
            set({ transactions });
        } catch (e) { console.error(e); }
    },

    updateAccount: async (id, updates) => {
        try {
            await updateAccount(id, updates);
            const accounts = await getAccounts();
            set({ accounts });
        } catch (e) { console.error(e); }
    },

    setActiveAccount: (id) => {
        set({ activeAccountId: id });
    },

    transferBetweenAccounts: async (fromId, toId, amount) => {
        const state = get();
        const fromAccount = state.accounts.find((a) => a.id === fromId);
        const toAccount = state.accounts.find((a) => a.id === toId);

        if (!fromAccount || !toAccount) return;

        const date = formatDate();
        const month = formatMonth();

        await get().addTransaction({
            text: `Übertrag an ${toAccount.name}`,
            amount: -amount,
            category: 'Transport',
            date,
            month,
            accountId: fromId,
        });

        await get().addTransaction({
            text: `Übertrag von ${fromAccount.name}`,
            amount: amount,
            category: 'General',
            date,
            month,
            accountId: toId,
        });
    },

    // Sparkasse Actions
    deposit: async (amount) => {
        const { sparkasse } = get();
        await updateSparkasse({
            balance: sparkasse.balance + amount,
            monthlyDeposited: sparkasse.monthlyDeposited + amount
        });
        const newData = await getSparkasseData();
        if (newData) set({ sparkasse: newData });
    },

    withdraw: async (amount) => {
        const { sparkasse } = get();
        if (sparkasse.balance >= amount) {
            await updateSparkasse({
                balance: sparkasse.balance - amount
            });
            const newData = await getSparkasseData();
            if (newData) set({ sparkasse: newData });
        }
    },

    updateSparkasseSettings: async (updates) => {
        await updateSparkasse({ settings: updates });
        const newData = await getSparkasseData();
        if (newData) set({ sparkasse: newData });
    },

    resetMonthlyProgress: async () => {
        await updateSparkasse({ monthlyDeposited: 0 });
        const newData = await getSparkasseData();
        if (newData) set({ sparkasse: newData });
    },

    // Category Actions
    addCategory: async (key, category) => {
        await createCategory(key, category);
        const cats = await getCategories();
        set({ categories: cats });
    },

    updateCategory: async (key, updates) => {
        await updateCategory(key, updates);
        const cats = await getCategories();
        set({ categories: cats });
    },

    deleteCategory: async (key) => {
        await deleteCategory(key);
        const cats = await getCategories();
        set({ categories: cats });
    },

    setCategoryBudget: async (category, limit) => {
        await updateCategory(category, { budgetLimit: limit });
        const cats = await getCategories();
        set({ categories: cats });
    },

    // Settings Actions
    updateSettings: async (updates) => {
        await updateSettings(updates);
        const s = await getSettings();
        if (s) set({ settings: s });
    },

    // Data Actions
    importData: () => {
        console.warn("Import not supported in DB mode yet");
    },

    resetAllData: async () => {

    },

    // Query Actions
    getStatistics: (month) => {
        const { transactions } = get();
        const relevant = month
            ? transactions.filter((t) => t.month === month)
            : transactions;

        const totalIncome = relevant
            .filter((t) => t.amount > 0)
            .reduce((acc, t) => acc + t.amount, 0);
        const totalExpense = Math.abs(
            relevant.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0)
        );
        const balance = totalIncome - totalExpense;

        const categoryBreakdown: Record<string, { amount: number; percentage: number }> = {};
        relevant.forEach((t) => {
            if (t.amount < 0) {
                const amount = Math.abs(t.amount);
                categoryBreakdown[t.category] = categoryBreakdown[t.category] || {
                    amount: 0,
                    percentage: 0,
                };
                categoryBreakdown[t.category].amount += amount;
            }
        });

        Object.keys(categoryBreakdown).forEach((cat) => {
            categoryBreakdown[cat].percentage =
                totalExpense > 0 ? (categoryBreakdown[cat].amount / totalExpense) * 100 : 0;
        });

        const monthlyMap: Record<string, { month: string; income: number; expense: number }> = {};
        transactions.forEach((t) => {
            if (!monthlyMap[t.month]) {
                monthlyMap[t.month] = { month: t.month, income: 0, expense: 0 };
            }
            if (t.amount > 0) monthlyMap[t.month].income += t.amount;
            else monthlyMap[t.month].expense += Math.abs(t.amount);
        });

        const monthlyTrend = Object.values(monthlyMap).slice(-12);

        return {
            totalIncome,
            totalExpense,
            balance,
            categoryBreakdown,
            monthlyTrend,
        };
    },

    getTransactionsByMonth: (month) => {
        const { transactions } = get();
        return transactions.filter((t) => t.month === month).sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
        });
    },

    searchTransactions: (term, month) => {
        const { transactions } = get();
        return transactions
            .filter((t) => {
                const matchesSearch = t.text.toLowerCase().includes(term.toLowerCase());
                const matchesMonth = !month || t.month === month;
                return matchesSearch && matchesMonth;
            })
            .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB.getTime() - dateA.getTime();
            });
    },

    getCategoryBudgetStatus: (category, month) => {
        const { transactions, categories } = get();
        const relevant = month
            ? transactions.filter((t) => t.month === month)
            : transactions;

        const used = Math.abs(
            relevant
                .filter((t) => t.category === category && t.amount < 0)
                .reduce((acc, t) => acc + t.amount, 0)
        );

        const limit = categories[category]?.budgetLimit || 0;
        const percentage = limit > 0 ? (used / limit) * 100 : 0;

        return { used, limit, percentage };
    },
}));
