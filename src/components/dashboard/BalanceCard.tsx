'use client';

import { Card } from '@/components/ui/Card';
import { useBudgetStore } from '@/store/budgetStore';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';

export function BalanceCard() {
    const { transactions, settings, isLoading } = useBudgetStore();

    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0));

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <Card variant="hero">
                    <Skeleton className="h-4 w-32 mb-4 bg-white/5" />
                    <Skeleton className="h-16 w-3/4 bg-white/10" />
                </Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card variant="stat">
                        <div className="flex gap-4">
                            <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20 bg-white/5" />
                                <Skeleton className="h-8 w-32 bg-white/5" />
                            </div>
                        </div>
                    </Card>
                    <Card variant="stat">
                        <div className="flex gap-4">
                            <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20 bg-white/5" />
                                <Skeleton className="h-8 w-32 bg-white/5" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
        >
            {/* Hero Balance Card */}
            <Card variant="hero">
                <p className="font-outfit text-sm font-medium text-text-dim mb-2 uppercase tracking-wider">
                    Gesamtbilanz
                </p>
                <p className="font-outfit text-5xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                    {formatCurrency(total, settings.currency)}
                </p>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Income Card */}
                <Card variant="stat">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="font-outfit text-xs font-medium text-text-dim mb-1 uppercase tracking-wider">
                                Einnahmen
                            </p>
                            <p className="font-outfit text-2xl font-bold text-emerald-400">
                                + {formatCurrency(income, settings.currency)}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Expense Card */}
                <Card variant="stat">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/10 text-red-500 ring-1 ring-red-500/20">
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <p className="font-outfit text-xs font-medium text-text-dim mb-1 uppercase tracking-wider">
                                Ausgaben
                            </p>
                            <p className="font-outfit text-2xl font-bold text-red-400">
                                - {formatCurrency(expense, settings.currency)}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}
