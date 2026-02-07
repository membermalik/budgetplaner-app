'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, Settings, Upload, Menu, X, History as HistoryIcon, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface SidebarProps {
    activeView: string;
    onChangeView: (view: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ activeView, onChangeView, isOpen, onClose }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'history', label: 'Verlauf', icon: HistoryIcon },
        { id: 'recurring', label: 'Fixkosten', icon: RefreshCw },
        { id: 'accounts', label: 'Konten', icon: Wallet },
        { id: 'data', label: 'Daten', icon: Upload },
        { id: 'settings', label: 'Einstellungen', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-full w-64 glass-strong transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="font-outfit text-2xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent drop-shadow-sm">
                                Pro Finance
                            </h1>
                            <p className="text-[10px] uppercase tracking-wider text-text-dim font-semibold mt-1">Premium Edition</p>
                        </div>
                        <button onClick={onClose} className="lg:hidden text-text-dim hover:text-text-main transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1 flex-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onChangeView(item.id);
                                        onClose();
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                        isActive
                                            ? "bg-accent/10 text-accent font-semibold"
                                            : "text-text-dim hover:text-text-main hover:bg-surface-hover"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full shadow-glow" />
                                    )}
                                    <Icon size={20} className={cn(
                                        "transition-colors duration-300",
                                        isActive ? "text-accent drop-shadow-sm" : "text-text-dim group-hover:text-text-main"
                                    )} />
                                    <span className="font-medium tracking-wide text-sm">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer / User Info could go here */}
                    <div className="pt-6 border-t border-surface-border">
                        <p className="text-xs text-text-dim/50 text-center">
                            v1.0.0 Pro
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}
