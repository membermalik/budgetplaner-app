'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useBudgetStore } from '@/store/budgetStore';
import { downloadFile } from '@/lib/utils';
import { Palette } from 'lucide-react';
import { CategoryManager } from './CategoryManager';

type Tab = 'general' | 'appearance' | 'categories' | 'data';

export function SettingsView() {
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const {
        settings,
        categories,
        transactions,
        updateSettings,
        importData,
        resetAllData,
    } = useBudgetStore();

    const [currency, setCurrency] = useState(settings.currency);
    const [budgetLimit, setBudgetLimit] = useState(settings.budgetLimit.toString());
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSaveGeneral = () => {
        updateSettings({
            currency: currency || '€',
            budgetLimit: parseFloat(budgetLimit) || 0,
        });
        alert('Einstellungen gespeichert');
    };

    const handleExportCSV = () => {
        if (transactions.length === 0) return;
        let csv = 'ID,Datum,Monat,Beschreibung,Betrag,Kategorie\n';
        transactions.forEach((t) => {
            csv += `${t.id},"${t.date}","${t.month}","${t.text}",${t.amount},"${categories[t.category]?.label || t.category}"\n`;
        });
        downloadFile(csv, 'text/csv', 'Budgetplaner_Export.csv');
    };

    const handleExportJSON = () => {
        const data = { transactions, categories, settings };
        downloadFile(JSON.stringify(data, null, 2), 'application/json', 'Budgetplaner_Backup.json');
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (data.transactions || data.categories) {
                    importData(data);
                    alert('Daten erfolgreich importiert');
                }
            } catch {
                alert('Fehler beim Importieren der Datei.');
            }
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        if (confirm('Bist du absolut sicher? Alle Daten werden gelöscht!')) {
            resetAllData();
        }
    };

    const handleThemeChange = (newTheme: 'auto' | 'light' | 'dark') => {
        updateSettings({ theme: newTheme });
        if (typeof window !== 'undefined') {
            if (newTheme === 'auto') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('light', !isDark);
                document.documentElement.classList.toggle('dark', isDark);
            } else {
                document.documentElement.classList.toggle('light', newTheme === 'light');
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
            }
        }
    };

    const tabs = [
        { id: 'general' as Tab, label: 'Allgemein', icon: '⚙️' },
        { id: 'appearance' as Tab, label: 'Erscheinungsbild', icon: '🎨' },
        { id: 'categories' as Tab, label: 'Kategorien', icon: '🏷️' },
        { id: 'data' as Tab, label: 'Daten & Export', icon: '💾' },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-[220px] pb-4 md:pb-0 md:pr-6">
                <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "text-left px-4 py-3 rounded-xl font-outfit font-medium text-sm transition-all duration-300 flex items-center gap-3 whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-accent/10 text-accent shadow-sm border border-accent/20"
                                    : "text-text-dim hover:bg-surface-hover hover:text-text-main"
                            )}
                        >
                            <span className="text-lg opacity-80">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-[500px]">
                {activeTab === 'general' && (
                    <div className="space-y-6 max-w-xl animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-6 rounded-2xl bg-surface border border-white/5">
                            <h4 className="font-outfit font-semibold text-text-main mb-6">Allgemeine Anzeige</h4>
                            <div className="space-y-4">
                                <Input
                                    label="Währungssymbol"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                />
                                <Input
                                    label={`Monatliches Budgetlimit (${currency}) (0 = Deaktiviert)`}
                                    type="number"
                                    value={budgetLimit}
                                    onChange={(e) => setBudgetLimit(e.target.value)}
                                />
                            </div>
                            <div className="mt-6">
                                <Button onClick={handleSaveGeneral} size="lg">
                                    Änderungen speichern
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'appearance' && (
                    <div className="space-y-6 max-w-xl animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-6 rounded-2xl bg-surface border border-white/5">
                            <h4 className="font-outfit font-semibold text-text-main mb-4 flex items-center gap-2">
                                <Palette className="w-5 h-5" />
                                Farbschema
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { id: 'auto', label: 'Systemeinstellung', icon: '⚙️', desc: 'Folgt dem System-Design' },
                                    { id: 'light', label: 'Helles Design', icon: '☀️', desc: 'Hell und freundlich' },
                                    { id: 'dark', label: 'Dunkles Design', icon: '🌙', desc: 'Dunkel und modern' },
                                ].map(({ id, label, desc }) => (
                                    <div
                                        key={id}
                                        onClick={() => handleThemeChange(id as 'auto' | 'light' | 'dark')}
                                        className={cn(
                                            "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                                            (settings.theme as string) === id
                                                ? "border-accent bg-accent/5 shadow-sm"
                                                : "border-surface-border hover:border-accent/50 hover:bg-surface-hover"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="theme"
                                                value={id}
                                                checked={(settings.theme as string) === id}
                                                onChange={() => { }}
                                                className="w-5 h-5 cursor-pointer accent-accent"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-text-main">{label}</p>
                                                <p className="text-xs text-text-dim">{desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="space-y-6 max-w-xl animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-6 rounded-2xl bg-surface border border-white/5">
                            <CategoryManager />
                        </div>
                    </div>
                )}

                {activeTab === 'data' && (
                    <div className="space-y-6 max-w-xl animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-6 rounded-2xl bg-surface border border-white/5">
                            <h4 className="font-outfit font-semibold text-text-main mb-4">Daten sichern & wiederherstellen</h4>
                            <p className="text-sm text-text-dim mb-6">
                                Exportiere deine Daten regelmäßig, um sie nicht zu verlieren.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <Button variant="secondary" onClick={handleExportCSV}>Als CSV exportieren</Button>
                                <Button variant="secondary" onClick={handleExportJSON}>Als JSON exportieren</Button>
                            </div>

                            <div className="mb-8">
                                <label className="block font-outfit text-xs font-semibold text-text-dim mb-3">
                                    Backup (JSON) importieren
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json"
                                    onChange={handleImport}
                                    className="w-full bg-surface border border-surface-border rounded-xl p-3 text-text-main text-sm 
                                                   file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                                                   file:bg-accent file:text-white file:font-semibold
                                                   hover:file:bg-accent/80 transition-colors cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="p-6 border border-danger/30 rounded-2xl bg-danger/5">
                            <h4 className="font-outfit font-semibold text-danger mb-2">Danger Zone</h4>
                            <p className="text-sm text-text-dim mb-4">
                                Hiermit werden alle Transaktionen und Einstellungen gelöscht.
                            </p>
                            <Button variant="danger" onClick={handleReset} className="w-full">
                                Alles zurücksetzen
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
