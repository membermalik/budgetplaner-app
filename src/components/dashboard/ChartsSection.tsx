'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useBudgetStore } from '@/store/budgetStore';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Activity, TrendingUp } from 'lucide-react';

export function ChartsSection() {
    const [chartType, setChartType] = useState<'pie' | 'bar' | 'line' | 'area'>('pie');
    const { transactions, categories } = useBudgetStore();

    // Calculate category totals for pie chart
    const expenses = transactions.filter((t) => t.amount < 0);
    const categoryTotals: Record<string, number> = {};

    expenses.forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
    });

    const pieData = Object.entries(categoryTotals).map(([key, value]) => ({
        name: categories[key]?.label || key,
        value,
        color: categories[key]?.color || '#64748b',
    }));

    // Calculate monthly data for charts
    const monthlyData: Record<string, { month: string; income: number; expense: number; balance: number }> = {};
    transactions.forEach((t) => {
        if (!monthlyData[t.month]) {
            monthlyData[t.month] = { month: t.month.split(' ')[0], income: 0, expense: 0, balance: 0 };
        }
        if (t.amount > 0) monthlyData[t.month].income += t.amount;
        else monthlyData[t.month].expense += Math.abs(t.amount);
        monthlyData[t.month].balance = monthlyData[t.month].income - monthlyData[t.month].expense;
    });
    const chartData = Object.values(monthlyData).slice(-6);

    const tooltipStyle = {
        background: '#0d0d12',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        color: 'white',
    };

    const EmptyState = ({ icon: Icon, message }: { icon: any, message: string }) => (
        <div className="h-full flex flex-col items-center justify-center text-text-dim gap-3 opacity-60">
            <Icon size={48} strokeWidth={1} />
            <p className="text-sm font-medium">Keine Daten verfügbar</p>
            <p className="text-xs">{message}</p>
        </div>
    );

    return (
        <Card className="flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-outfit text-base font-semibold text-text-main">Analyse</h3>
                <div className="flex bg-black/30 p-1 rounded-xl border border-white/[0.08] overflow-x-auto">
                    <button
                        onClick={() => setChartType('pie')}
                        className={`px-3 py-2 rounded-lg font-outfit font-semibold text-xs transition-all duration-500 whitespace-nowrap ${chartType === 'pie' ? 'bg-accent text-white' : 'text-white/70 hover:text-white'
                            }`}
                    >
                        Pie
                    </button>
                    <button
                        onClick={() => setChartType('bar')}
                        className={`px-3 py-2 rounded-lg font-outfit font-semibold text-xs transition-all duration-500 whitespace-nowrap ${chartType === 'bar' ? 'bg-accent text-white' : 'text-white/70 hover:text-white'
                            }`}
                    >
                        Bar
                    </button>
                    <button
                        onClick={() => setChartType('line')}
                        className={`px-3 py-2 rounded-lg font-outfit font-semibold text-xs transition-all duration-500 whitespace-nowrap ${chartType === 'line' ? 'bg-accent text-white' : 'text-white/70 hover:text-white'
                            }`}
                    >
                        Line
                    </button>
                    <button
                        onClick={() => setChartType('area')}
                        className={`px-3 py-2 rounded-lg font-outfit font-semibold text-xs transition-all duration-500 whitespace-nowrap ${chartType === 'area' ? 'bg-accent text-white' : 'text-white/70 hover:text-white'
                            }`}
                    >
                        Area
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[250px]">
                {chartType === 'pie' ? (
                    pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={tooltipStyle as any}
                                    formatter={(value: number) => `${value.toFixed(2)} €`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState icon={PieIcon} message="Füge Ausgaben hinzu, um die Verteilung zu sehen" />
                    )
                ) : chartType === 'bar' ? (
                    chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={tooltipStyle as any} />
                                <Legend />
                                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Einnahmen" />
                                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Ausgaben" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState icon={BarChart3} message="Füge Transaktionen hinzu, um monatliche Vergleiche zu sehen" />
                    )
                ) : chartType === 'line' ? (
                    chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={tooltipStyle as any} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#10b981"
                                    name="Einnahmen"
                                    dot={{ fill: '#10b981', r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#f43f5e"
                                    name="Ausgaben"
                                    dot={{ fill: '#f43f5e', r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#6366f1"
                                    name="Bilanz"
                                    dot={{ fill: '#6366f1', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState icon={TrendingUp} message="Der zeitliche Verlauf deiner Finanzen wird hier erscheinen" />
                    )
                ) : chartType === 'area' ? (
                    chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={tooltipStyle as any} />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#10b981"
                                    fillOpacity={1}
                                    fill="url(#colorIncome)"
                                    name="Einnahmen"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#f43f5e"
                                    fillOpacity={1}
                                    fill="url(#colorExpense)"
                                    name="Ausgaben"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState icon={Activity} message="Visualisiere deine Finanzen als Flächendiagramm" />
                    )
                ) : null}
            </div>

            {/* Legend for Pie Chart */}
            {chartType === 'pie' && pieData.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/[0.08]">
                    {pieData.map((item) => (
                        <div key={item.name} className="flex items-center gap-3 text-sm text-text-dim">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ background: item.color }}
                            />
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
