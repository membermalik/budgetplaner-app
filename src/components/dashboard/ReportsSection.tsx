'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useBudgetStore } from '@/store/budgetStore';
import { formatCurrency, formatMonth } from '@/lib/utils';
import { TrendingUp, TrendingDown, Target, PieChart as PieChartIcon } from 'lucide-react';

export function ReportsSection() {
    const { transactions, settings, getStatistics } = useBudgetStore();
    const [selectedMonth, setSelectedMonth] = useState<string>('current');

    // Get unique months
    const availableMonths = useMemo(() => {
        const months: string[] = Array.from(new Set(transactions.map((t) => t.month)));
        return months.reverse();
    }, [transactions]);

    const stats = useMemo(() => {
        return getStatistics(selectedMonth === 'current' ? undefined : selectedMonth);
    }, [selectedMonth, getStatistics]);

    // Calculate savings rate
    const savingsRate =
        stats.totalIncome > 0
            ? ((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100
            : 0;

    // Top expenses
    const topExpenses = Object.entries(stats.categoryBreakdown)
        .sort(([, a], [, b]) => (b as { amount: number }).amount - (a as { amount: number }).amount)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Month Selector */}
            <Card>
                <h3 className="font-outfit text-lg font-bold text-text-main mb-4">
                    Berichte & Statistiken
                </h3>
                <select
                    value={selectedMonth}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMonth(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.08] rounded-[14px] px-5 py-3 text-white font-inter text-sm transition-all focus:outline-none focus:border-accent"
                >
                    <option value="current">Aktueller Monat</option>
                    {availableMonths.map((month: string) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Income */}
                <Card variant="stat">
                    <div className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center text-2xl bg-black/20 border border-white/[0.08] text-success shadow-[0_10px_20px_rgba(16,185,129,0.1)]">
                        <TrendingUp size={28} />
                    </div>
                    <div className="flex flex-col">
                        <p className="font-outfit text-xs font-semibold uppercase tracking-[0.2em] text-text-dim mb-1">
                            Einnahmen
                        </p>
                        <p className="font-outfit text-2xl font-bold text-success">
                            {formatCurrency(stats.totalIncome, settings.currency)}
                        </p>
                    </div>
                </Card>

                {/* Expenses */}
                <Card variant="stat">
                    <div className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center text-2xl bg-black/20 border border-white/[0.08] text-danger shadow-[0_10px_20px_rgba(244,63,94,0.1)]">
                        <TrendingDown size={28} />
                    </div>
                    <div className="flex flex-col">
                        <p className="font-outfit text-xs font-semibold uppercase tracking-[0.2em] text-text-dim mb-1">
                            Ausgaben
                        </p>
                        <p className="font-outfit text-2xl font-bold text-danger">
                            {formatCurrency(stats.totalExpense, settings.currency)}
                        </p>
                    </div>
                </Card>

                {/* Savings Rate */}
                <Card variant="stat">
                    <div className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center text-2xl bg-black/20 border border-white/[0.08] text-accent shadow-[0_10px_20px_rgba(99,102,241,0.1)]">
                        <Target size={28} />
                    </div>
                    <div className="flex flex-col">
                        <p className="font-outfit text-xs font-semibold uppercase tracking-[0.2em] text-white/80 mb-1">
                            🎯 Sparquote
                        </p>
                        <p className="font-outfit text-2xl font-bold text-accent">
                            {savingsRate.toFixed(1)}%
                        </p>
                    </div>
                </Card>

                {/* Balance */}
                <Card variant="stat">
                    <div className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center text-2xl bg-black/20 border border-white/[0.08] text-text-main shadow-[0_10px_20px_rgba(99,102,241,0.1)]">
                        <PieChartIcon size={28} />
                    </div>
                    <div className="flex flex-col">
                        <p className="font-outfit text-xs font-semibold uppercase tracking-[0.2em] text-text-dim mb-1">
                            Bilanz
                        </p>
                        <p
                            className={`font-outfit text-2xl font-bold ${
                                stats.balance >= 0 ? 'text-success' : 'text-danger'
                            }`}
                        >
                            {formatCurrency(stats.balance, settings.currency)}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Top Expenses Breakdown */}
            {topExpenses.length > 0 && (
                <Card>
                    <h4 className="font-outfit font-bold text-text-main mb-4">
                        Top Ausgabenkategorien
                    </h4>
                    <div className="space-y-3">
                        {topExpenses.map(([category, data]) => (
                            <div key={category} className="flex justify-between items-end gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="font-outfit text-sm font-semibold text-text-main truncate">
                                        {category}
                                    </p>
                                    <div className="mt-2 h-2 bg-black/40 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent transition-all duration-500"
                                            style={{ width: `${(data as { percentage: number }).percentage}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-outfit text-sm font-bold text-text-main">
                                        {formatCurrency((data as { amount: number }).amount, settings.currency)}
                                    </p>
                                    <p className="text-xs text-text-dim">
                                        {((data as { percentage: number }).percentage).toFixed(0)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Monthly Trend */}
            {stats.monthlyTrend.length > 0 && (
                <Card>
                    <h4 className="font-outfit font-bold text-text-main mb-4">
                        Monatlicher Überblick (Letzter 12 Monate)
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.08]">
                                    <th className="text-left px-2 py-2 text-text-dim font-semibold">
                                        Monat
                                    </th>
                                    <th className="text-right px-2 py-2 text-text-dim font-semibold">
                                        Einnahmen
                                    </th>
                                    <th className="text-right px-2 py-2 text-text-dim font-semibold">
                                        Ausgaben
                                    </th>
                                    <th className="text-right px-2 py-2 text-text-dim font-semibold">
                                        Bilanz
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.monthlyTrend.map((trend, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-white/[0.08] hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-2 py-3 text-text-main font-medium">
                                            {trend.month}
                                        </td>
                                        <td className="text-right px-2 py-3 text-success">
                                            +{formatCurrency(trend.income, settings.currency)}
                                        </td>
                                        <td className="text-right px-2 py-3 text-danger">
                                            -{formatCurrency(trend.expense, settings.currency)}
                                        </td>
                                        <td
                                            className={`text-right px-2 py-3 font-semibold ${
                                                trend.income - trend.expense >= 0
                                                    ? 'text-success'
                                                    : 'text-danger'
                                            }`}
                                        >
                                            {formatCurrency(
                                                trend.income - trend.expense,
                                                settings.currency
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
