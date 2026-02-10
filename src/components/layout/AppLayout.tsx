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
            case '/': return 'Startseite';
            case '/dashboard': return 'Dashboard';
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
        <div className="flex min-h-screen bg-background transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 border-b border-surface-border bg-surface/80 backdrop-blur-xl sticky top-0 z-30">
                    <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                        <Menu size={20} />
                    </Button>
                    <span className="font-outfit font-bold text-text-main">Pro <span className="text-accent">Finance</span></span>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowSearch(true)}>
                            <Search size={22} />
                        </Button>
                        <NotificationsCenter />
                    </div>
                </header>

                <div className="p-4 lg:p-8 pb-32 w-full max-w-[1600px] mx-auto space-y-8">
                    {/* Desktop Header / Toolbar */}
                    <div className="hidden lg:flex items-center justify-between pb-6 border-b border-surface-border">
                        <div>
                            <h2 className="text-2xl font-bold text-text-main capitalize tracking-tight font-outfit">
                                {getTitle()}
                            </h2>
                            <p className="text-sm text-text-dim mt-1">Überblick über deine Finanzen</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search Button */}
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowSearch(true)}
                                className="h-12 w-12 p-0 rounded-full flex items-center justify-center bg-surface hover:bg-surface-hover text-text-dim hover:text-text-main transition-all border-surface-border"
                                title="Suche"
                            >
                                <Search size={24} />
                            </Button>

                            {/* Notifications */}
                            <div className="h-12 w-12 flex items-center justify-center bg-surface rounded-full hover:bg-surface-hover transition-all border border-surface-border">
                                <NotificationsCenter />
                            </div>

                            {/* Transaction Button - Hide on Fixkosten page as it has its own */}
                            {pathname !== '/fixkosten' && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setShowTransactionModal(true)}
                                    className="h-10 px-6 rounded-full shadow-lg shadow-accent/20 flex items-center gap-2"
                                >
                                    <Plus size={18} />
                                    <span>Neu</span>
                                </Button>
                            )}
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
