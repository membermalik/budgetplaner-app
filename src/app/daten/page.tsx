'use client';

import { DataImportExport } from '@/components/dashboard/DataImportExport';

export default function DataPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold">Datenverwaltung</h2>
            <DataImportExport />
        </div>
    );
}
