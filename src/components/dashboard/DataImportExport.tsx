'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useBudgetStore } from '@/store/budgetStore';
import { downloadFile, parseJSONImport, parseCSVImport } from '@/lib/utils';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';

export function DataImportExport() {
    const { transactions, categories, importData } = useBudgetStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importModal, setImportModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importMessage, setImportMessage] = useState('');
    const [importError, setImportError] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    const handleExportJSON = () => {
        const data = { transactions, categories };
        downloadFile(
            JSON.stringify(data, null, 2),
            'application/json',
            `Budgetplaner_Backup_${new Date().toISOString().split('T')[0]}.json`
        );
    };

    const handleExportCSV = () => {
        if (transactions.length === 0) {
            setImportError('Keine Transaktionen zum Exportieren');
            return;
        }

        let csv = 'ID,Datum,Monat,Beschreibung,Betrag,Kategorie\n';
        transactions.forEach((t) => {
            csv += `${t.id},"${t.date}","${t.month}","${t.text}",${t.amount},"${categories[t.category]?.label || t.category}"\n`;
        });

        downloadFile(
            csv,
            'text/csv',
            `Budgetplaner_Export_${new Date().toISOString().split('T')[0]}.csv`
        );
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImportFile(file);
            setImportError('');
            setImportMessage('');
        }
    };

    const handleImport = async () => {
        if (!importFile) return;

        setIsImporting(true);
        setImportMessage('');
        setImportError('');

        try {
            const content = await importFile.text();
            let data = null;

            if (importFile.type === 'application/json' || importFile.name.endsWith('.json')) {
                data = parseJSONImport(content);
            } else if (importFile.type === 'text/csv' || importFile.name.endsWith('.csv')) {
                const transactions = parseCSVImport(content);
                data = transactions ? { transactions } : null;
            }

            if (!data || (!data.transactions && !data.categories)) {
                setImportError('Ungültiges Dateiformat oder leere Datei');
                return;
            }

            await new Promise((resolve) => setTimeout(resolve, 500));

            importData(data);
            setImportMessage(
                `Erfolgreich importiert! ${data.transactions?.length || 0} Transaktionen hinzugefügt.`
            );
            setImportFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            setTimeout(() => {
                setImportModal(false);
                setImportMessage('');
            }, 2000);
        } catch (error) {
            setImportError('Fehler beim Importieren der Datei');
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <>
            <Card>
                <h3 className="font-outfit text-lg font-bold text-text-main mb-4">
                    Daten Import/Export
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm text-text-dim font-medium">Exportieren</p>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleExportJSON}
                                className="flex-1"
                            >
                                <Download size={16} className="mr-2" />
                                JSON
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleExportCSV}
                                className="flex-1"
                            >
                                <Download size={16} className="mr-2" />
                                CSV
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-text-dim font-medium">Importieren</p>
                        <Button
                            size="sm"
                            onClick={() => setImportModal(true)}
                            className="w-full"
                        >
                            <Upload size={16} className="mr-2" />
                            Datei wählen
                        </Button>
                    </div>
                </div>


                {/* Data Safety Warning */}
                <div className="mt-6 p-4 rounded-xl bg-warning/10 border border-warning/20 flex gap-3">
                    <AlertCircle className="text-warning flex-shrink-0" size={24} />
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-warning">Wichtiger Hinweis zur Datensicherheit</p>
                        <p className="text-xs text-warning/80 leading-relaxed">
                            Deine Daten werden ausschließlich <strong>lokal in diesem Browser</strong> gespeichert.
                            Wenn du deinen Browser-Cache löschst oder den Inkognito-Modus nutzt, gehen deine Daten verloren.
                            Bitte erstelle regelmäßig ein <strong>JSON-Backup</strong>.
                        </p>
                    </div>
                </div>
            </Card >

            {/* Import Modal */}
            < Modal
                isOpen={importModal}
                onClose={() => {
                    setImportModal(false);
                    setImportFile(null);
                    setImportError('');
                    setImportMessage('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
                }
                title="Daten Importieren"
            >
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-white/[0.2] rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,.csv"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <Upload size={32} className="mx-auto mb-2 text-white/50" />
                        <p className="text-sm text-text-main font-medium">
                            {importFile
                                ? importFile.name
                                : 'Datei auswählen oder hierher ziehen'}
                        </p>
                        <p className="text-xs text-text-dim mt-1">JSON oder CSV Format</p>
                    </div>

                    {importError && (
                        <div className="p-4 rounded-lg bg-danger/10 border border-danger/30 flex items-center gap-3">
                            <AlertCircle size={20} className="text-danger flex-shrink-0" />
                            <p className="text-sm text-danger">{importError}</p>
                        </div>
                    )}

                    {importMessage && (
                        <div className="p-4 rounded-lg bg-success/10 border border-success/30 flex items-center gap-3">
                            <CheckCircle size={20} className="text-success flex-shrink-0" />
                            <p className="text-sm text-success">{importMessage}</p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={handleImport}
                            disabled={!importFile || isImporting}
                            className="flex-1"
                        >
                            {isImporting ? 'Wird importiert...' : 'Importieren'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setImportModal(false);
                                setImportFile(null);
                                setImportError('');
                                setImportMessage('');
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            disabled={isImporting}
                            className="flex-1"
                        >
                            Abbrechen
                        </Button>
                    </div>
                </div>
            </Modal >
        </>
    );
}
