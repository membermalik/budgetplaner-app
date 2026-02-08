'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Menu, Plus, Search } from 'lucide-react';
import { NotificationsCenter } from '@/components/dashboard/NotificationsCenter';
import { Modal } from '@/components/ui/Modal';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { AdvancedSearchModal } from '@/components/dashboard/AdvancedSearchModal';
import { usePathname } from 'next/navigation';
import { Transaction, RecurringTransaction } from '@/types';

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Global Transaction Modal State (accessible via header button)
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Helper to determine title based on path
    const getTitle = () => {
        switch (pathname) {
            case '/': return 'Willkommen zurück';
            case '/verlauf': return 'Transaktionsverlauf';
            case '/konten': return 'Kontenverwaltung';
            case '/fixkosten': return 'Fixkosten';
            case '/daten': return 'Datenverwaltung';
            case '/einstellungen': return 'Einstellungen';
            default: return 'Budgetplaner';
        }
    };

    return (
        <div className="flex min-h-screen bg-[--bg-color] transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-surface/50 backdrop-blur-xl sticky top-0 z-30">
                    <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                        <Menu size={20} />
                    </Button>
                    <span className="font-outfit font-bold">Pro Finance</span>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowSearch(true)}>
                            <Search size={20} />
                        </Button>
                        <NotificationsCenter />
                    </div>
                </header>

                {/* Desktop Header / Toolbar */}
                <div className="hidden lg:flex items-center justify-between p-6 pb-2">
                    <h2 className="text-xl font-bold text-text-dim capitalize">
                        {getTitle()}
                    </h2>
                    <div className="flex gap-3">
                        {/* Search Button */}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowSearch(true)}
                            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                            title="Suche"
                        >
                            <Search size={20} />
                        </Button>

                        {/* Transaction Button */}
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowTransactionModal(true)}
                            className="bg-accent hover:bg-accent/90 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-glow"
                        >
                            <Plus size={20} />
                        </Button>

                        <div className="w-10 h-10 flex items-center justify-center">
                            <NotificationsCenter />
                        </div>
                    </div>
                </div>

                <div className="p-4 lg:p-8 pb-32">
                    {children}
                </div>
            </main>

            {/* Global Transaction Modal */}
            <Modal
                isOpen={showTransactionModal}
                onClose={() => setShowTransactionModal(false)}
                title="Neue Buchung"
            >
                <TransactionForm
                    onCancel={() => setShowTransactionModal(false)}
                    onSuccess={() => setShowTransactionModal(false)}
                />
            </Modal>

            {/* Global Search Modal */}
            <AdvancedSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
        </div>
    );
}
