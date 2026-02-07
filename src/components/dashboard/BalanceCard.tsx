'use client';

import { Card } from '@/components/ui/Card';
import { useBudgetStore } from '@/store/budgetStore';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function BalanceCard() {
    const { transactions, settings } = useBudgetStore();

    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0));

    return (
        <div className="flex flex-col gap-6">
            {/* Hero Balance Card */}
            <Card variant="hero">
                <p className="font-outfit text-sm font-medium text-text-dim mb-2">
                    Gesamtbilanz
                </p>
                <p className="font-outfit text-5xl sm:text-6xl font-bold tracking-tight text-text-main">
                    {formatCurrency(total, settings.currency)}
                </p>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Income Card */}
                <Card variant="stat">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-success/10 text-success">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="font-outfit text-xs font-medium text-text-dim mb-1">
                            Einnahmen
                        </p>
                        <p className="font-outfit text-2xl font-bold text-success">
                            + {formatCurrency(income, settings.currency)}
                        </p>
                    </div>
                </Card>

                {/* Expense Card */}
                <Card variant="stat">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-danger/10 text-danger">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="font-outfit text-xs font-medium text-text-dim mb-1">
                            Ausgaben
                        </p>
                        <p className="font-outfit text-2xl font-bold text-danger">
                            - {formatCurrency(expense, settings.currency)}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
