'use client';

import { useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '@/lib/constants';

const PRESET_COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#f59e0b', // Amber
    '#eab308', // Yellow
    '#84cc16', // Lime
    '#22c55e', // Green
    '#10b981', // Emerald
    '#14b8a6', // Teal
    '#06b6d4', // Cyan
    '#0ea5e9', // Sky
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#a855f7', // Purple
    '#d946ef', // Fuchsia
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#64748b', // Slate
];

export function CategoryManager() {
    const { categories, addCategory, updateCategory, deleteCategory, transactions } = useBudgetStore();
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [label, setLabel] = useState('');
    const [color, setColor] = useState(PRESET_COLORS[0]);
    const [error, setError] = useState('');

    const resetForm = () => {
        setLabel('');
        setColor(PRESET_COLORS[0]);
        setError('');
        setEditingKey(null);
        setIsCreating(false);
    };

    const handleStartEdit = (key: string) => {
        const cat = categories[key];
        setLabel(cat.label);
        setColor(cat.color);
        setEditingKey(key);
        setIsCreating(false);
        setError('');
    };

    const handleSave = () => {
        if (!label.trim()) {
            setError('Name ist erforderlich');
            return;
        }

        if (isCreating) {
            // Generate simple key from label
            const key = label.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!key) {
                setError('Ungültiger Name');
                return;
            }
            if (categories[key]) {
                setError('Kategorie existiert bereits');
                return;
            }

            // Create proper key-based ID logic if needed, but for now simple slug works
            // Need to ensure unique key if collision happens (e.g. "Test" and "Test!")
            let finalKey = key;
            let counter = 1;
            while (categories[finalKey]) {
                finalKey = `${key}${counter}`;
                counter++;
            }

            addCategory(finalKey, {
                label: label.trim(),
                color,
                budgetLimit: undefined
            });
        } else if (editingKey) {
            updateCategory(editingKey, {
                label: label.trim(),
                color
            });
        }

        resetForm();
    };

    const handleDelete = (key: string) => {
        // Check usage
        const isUsed = transactions.some(t => t.category === key);
        if (isUsed) {
            setError(`Kann nicht gelöscht werden: ${key === editingKey ? 'Diese' : 'Die'} Kategorie wird in Transaktionen verwendet.`);
            return; // Or show modal confirmation to migrate
        }
        deleteCategory(key);
        if (editingKey === key) resetForm();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-text-main font-medium">Kategorien verwalten</h4>
                {!isCreating && !editingKey && (
                    <Button size="sm" onClick={() => setIsCreating(true)}>
                        <Plus size={16} className="mr-2" />
                        Neu
                    </Button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-center gap-2 text-danger text-sm">
                    <AlertTriangle size={16} />
                    {error}
                </div>
            )}

            {/* Editor Form (Create or Edit) */}
            {(isCreating || editingKey) && (
                <div className="p-4 bg-surface/50 border border-white/5 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                        <label className="text-xs text-text-dim font-medium uppercase tracking-wider">Name</label>
                        <Input
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Kategorie Name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-text-dim font-medium uppercase tracking-wider">Farbe</label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-white scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button onClick={handleSave} className="flex-1">
                            <Check size={16} className="mr-2" />
                            Speichern
                        </Button>
                        <Button variant="secondary" onClick={resetForm} className="flex-1">
                            <X size={16} className="mr-2" />
                            Abbrechen
                        </Button>
                    </div>
                </div>
            )}

            {/* Category List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {Object.entries(categories).map(([key, cat]) => (
                    <div
                        key={key}
                        className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${editingKey === key
                                ? 'bg-accent/10 border-accent/30'
                                : 'bg-surface/30 border-transparent hover:border-white/5 hover:bg-surface/50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-full shadow-sm"
                                style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-sm text-text-main font-medium">{cat.label}</span>
                            {/* Usage Badge */}
                            {transactions.some(t => t.category === key) && (
                                <span className="text-[10px] bg-white/5 text-text-dim px-1.5 py-0.5 rounded ml-2">
                                    Verwendet
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleStartEdit(key)}
                                className="p-2 text-text-dim hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={() => handleDelete(key)}
                                className="p-2 text-text-dim hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                title="Löschen"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
