'use client';

import { AccountsManager } from '@/components/dashboard/AccountsManager';

export default function AccountsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold">Kontenverwaltung</h2>
            <AccountsManager />
        </div>
    );
}
