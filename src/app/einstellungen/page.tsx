'use client';

import { SettingsView } from '@/components/settings/SettingsView';

export default function SettingsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold">Einstellungen</h2>
            <SettingsView />
        </div>
    );
}
