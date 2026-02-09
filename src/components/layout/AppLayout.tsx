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

    // Check for public pages
    const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/register';

    if (isPublicPage) {
        return <div className="min-h-screen bg-black text-white">{children}</div>;
    }

    return (
        <div className="flex min-h-screen bg-[--bg-color] transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 lg:pl-64">
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

                <div className="p-4 lg:p-8 pb-32 max-w-7xl mx-auto space-y-8">
                    {/* Desktop Header / Toolbar */}
                    <div className="hidden lg:flex items-center justify-between pb-6 border-b border-white/5">
                        <div>
                            <h2 className="text-2xl font-bold text-white capitalize tracking-tight">
                                {getTitle()}
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">Überblick über deine Finanzen</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search Button */}
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowSearch(true)}
                                className="h-10 w-10 p-0 rounded-full flex items-center justify-center bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
                                title="Suche"
                            >
                                <Search size={18} />
                            </Button>

                            {/* Notifications */}
                            <div className="h-10 w-10 flex items-center justify-center bg-gray-800/50 rounded-full hover:bg-gray-700 transition-all">
                                <NotificationsCenter />
                            </div>

                            {/* Transaction Button */}
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setShowTransactionModal(true)}
                                className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                <span>Neu</span>
                            </Button>
                        </div>
                    </div>

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
