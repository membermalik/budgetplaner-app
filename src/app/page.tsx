'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Menu, Search, Settings as SettingsIcon, Plus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

// Views
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { ReportsSection } from '@/components/dashboard/ReportsSection';
import { DataImportExport } from '@/components/dashboard/DataImportExport';
import { AccountsManager } from '@/components/dashboard/AccountsManager';
import { AdvancedSearchModal } from '@/components/dashboard/AdvancedSearchModal';
import { NotificationsCenter } from '@/components/dashboard/NotificationsCenter';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { RecurringManager } from '@/components/settings/RecurringManager';
import { SettingsView } from '@/components/settings/SettingsView';
import { Transaction, RecurringTransaction } from '@/types';

export default function Home() {
    const [activeView, setActiveView] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Feature States
    const [showSettings, setShowSettings] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [editRecurringTransaction, setEditRecurringTransaction] = useState<RecurringTransaction | null>(null);
    const [initialIsRecurring, setInitialIsRecurring] = useState(false);

    // Scroll to form or open modal function for FAB or Edit
    const handleEditTransaction = (transaction: Transaction) => {
        setEditTransaction(transaction);
        setEditRecurringTransaction(null);
        setInitialIsRecurring(false);
        setShowTransactionModal(true);
    };

    const handleEditRecurring = (transaction: RecurringTransaction) => {
        setEditTransaction(null);
        setEditRecurringTransaction(transaction);
        setInitialIsRecurring(true);
        setShowTransactionModal(true);
    };

    const handleAddRecurring = () => {
        setEditTransaction(null);
        setEditRecurringTransaction(null);
        setInitialIsRecurring(true);
        setShowTransactionModal(true);
    };

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 gap-6">
                            <BalanceCard />
                        </div>

                        {/* Recent Transactions & Actions */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Main Feed */}
                            <div className="space-y-6">
                                <ChartsSection />
                            </div>
                        </div>
                    </div>
                );
            case 'history':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Transaktionsverlauf</h2>
                        </div>
                        <TransactionList onEditTransaction={handleEditTransaction} />
                    </div>
                );
            case 'accounts':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold">Kontenverwaltung</h2>
                        <AccountsManager />
                    </div>
                );
            case 'recurring':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold">Fixkosten</h2>
                        <RecurringManager
                            onAdd={handleAddRecurring}
                            onEdit={handleEditRecurring}
                        />
                    </div>
                );
            case 'data':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold">Datenverwaltung</h2>
                        <DataImportExport />
                    </div>
                );
            case 'settings':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold">Einstellungen</h2>
                        <SettingsView />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-[--bg-color] transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar
                activeView={activeView}
                onChangeView={setActiveView}
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
                    <NotificationsCenter />
                </header>

                {/* Desktop Header / Toolbar */}
                <div className="hidden lg:flex items-center justify-between p-6 pb-2">
                    <h2 className="text-xl font-bold text-text-dim capitalize">
                        {activeView === 'dashboard' ? `Willkommen zurück` : activeView === 'recurring' ? 'Fixkosten' : activeView}
                    </h2>
                    <div className="flex gap-3">
                        {/* Transaction Button */}
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                setEditTransaction(null);
                                setEditRecurringTransaction(null);
                                setInitialIsRecurring(false);
                                setShowTransactionModal(true);
                            }}
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
                    {renderContent()}
                </div>
            </main>

            {/* Modals */}
            <AdvancedSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />

            {/* Transaction Modal */}
            <Modal
                isOpen={showTransactionModal}
                onClose={() => {
                    setShowTransactionModal(false);
                    setEditTransaction(null);
                    setEditRecurringTransaction(null);
                    setInitialIsRecurring(false);
                }}
                title={editTransaction ? "Buchung bearbeiten" : (editRecurringTransaction ? "Dauerauftrag bearbeiten" : (initialIsRecurring ? "Neuer Dauerauftrag" : "Neue Buchung"))}
            >
                <TransactionForm
                    editTransaction={editTransaction}
                    editRecurringTransaction={editRecurringTransaction}
                    initialIsRecurring={initialIsRecurring}
                    onCancel={() => {
                        setShowTransactionModal(false);
                        setEditTransaction(null);
                        setEditRecurringTransaction(null);
                        setInitialIsRecurring(false);
                    }}
                    onSuccess={() => {
                        setShowTransactionModal(false);
                        setEditTransaction(null);
                        setEditRecurringTransaction(null);
                        setInitialIsRecurring(false);
                    }}
                />
            </Modal>
        </div>
    );
}
