'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useBudgetStore } from '@/store/budgetStore';
import { Transaction } from '@/types';
import { Search, Filter, X } from 'lucide-react';

interface AdvancedSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AdvancedSearchModal({ isOpen, onClose }: AdvancedSearchModalProps) {
    const { transactions, categories, settings } = useBudgetStore();
    const [filters, setFilters] = useState({
        searchTerm: '',
        minAmount: '',
        maxAmount: '',
        category: '',
        startDate: '',
        endDate: '',
    });
    const [results, setResults] = useState<Transaction[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        let filtered = transactions;

        if (filters.searchTerm) {
            filtered = filtered.filter((t) =>
                t.text.toLowerCase().includes(filters.searchTerm.toLowerCase())
            );
        }

        if (filters.minAmount) {
            filtered = filtered.filter((t) => Math.abs(t.amount) >= parseFloat(filters.minAmount));
        }

        if (filters.maxAmount) {
            filtered = filtered.filter((t) => Math.abs(t.amount) <= parseFloat(filters.maxAmount));
        }

        if (filters.category) {
            filtered = filtered.filter((t) => t.category === filters.category);
        }

        if (filters.startDate) {
            filtered = filtered.filter((t) => new Date(t.date) >= new Date(filters.startDate));
        }

        if (filters.endDate) {
            filtered = filtered.filter((t) => new Date(t.date) <= new Date(filters.endDate));
        }

        setResults(filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
        }));
        setHasSearched(true);
    };

    const handleReset = () => {
        setFilters({
            searchTerm: '',
            minAmount: '',
            maxAmount: '',
            category: '',
            startDate: '',
            endDate: '',
        });
        setResults([]);
        setHasSearched(false);
    };

    const categoryOptions = Object.entries(categories).map(([key, value]) => ({
        value: key,
        label: value.label,
    }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Erweiterte Suche"
            variant="wide"
            >
                <div className="space-y-6">
                    {/* Search Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Beschreibung"
                            value={filters.searchTerm}
                            onChange={(e) =>
                                setFilters({ ...filters, searchTerm: e.target.value })
                            }
                            placeholder="Nach Text suchen..."
                        />

                        <div>
                            <label className="block font-outfit text-xs font-semibold text-white/80 mb-3">
                                Kategorie
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) =>
                                    setFilters({ ...filters, category: e.target.value })
                                }
                                className="w-full bg-black/40 border border-white/[0.08] rounded-[14px] px-5 py-3 text-white font-inter text-sm transition-all focus:outline-none focus:border-accent"
                            >
                                <option value="">Alle Kategorien</option>
                                {categoryOptions.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="Minimalbetrag (€)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={filters.minAmount}
                            onChange={(e) =>
                                setFilters({ ...filters, minAmount: e.target.value })
                            }
                            placeholder="0.00"
                        />

                        <Input
                            label="Maximalbetrag (€)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={filters.maxAmount}
                            onChange={(e) =>
                                setFilters({ ...filters, maxAmount: e.target.value })
                            }
                            placeholder="999999.99"
                        />

                        <Input
                            label="Von Datum"
                            type="date"
                            value={filters.startDate}
                            onChange={(e) =>
                                setFilters({ ...filters, startDate: e.target.value })
                            }
                        />

                        <Input
                            label="Bis Datum"
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 justify-end">
                        <Button variant="secondary" onClick={handleReset}>
                            <X size={16} className="mr-1" /> Zurücksetzen
                        </Button>
                        <Button onClick={handleSearch}>
                            <Search size={16} className="mr-1" /> Suchen
                        </Button>
                    </div>

                    {/* Results */}
                    {hasSearched && (
                        <div>
                            <h4 className="font-outfit font-bold text-text-main mb-4">
                                Ergebnisse: {results.length} Transaktion{results.length !== 1 ? 'en' : ''}
                            </h4>

                            {results.length > 0 ? (
                                <div className="max-h-[400px] overflow-y-auto space-y-2">
                                    {results.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="p-3 rounded-lg bg-black/20 border border-white/[0.08] flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="font-outfit text-sm font-semibold text-text-main">
                                                    {transaction.text}
                                                </p>
                                                <p className="text-xs text-text-dim">
                                                    {transaction.date} • {categories[transaction.category]?.label}
                                                </p>
                                            </div>
                                            <p
                                                className={`font-outfit font-bold ${
                                                    transaction.amount > 0 ? 'text-success' : 'text-danger'
                                                }`}
                                            >
                                                {transaction.amount > 0 ? '+' : ''}
                                                {transaction.amount.toFixed(2)} {settings.currency}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-text-dim py-8">
                                    Keine Ergebnisse gefunden
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </Modal>
    );
}
