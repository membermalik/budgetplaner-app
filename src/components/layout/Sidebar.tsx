'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Wallet, Settings, Upload, Menu, X, History as HistoryIcon, RefreshCw, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { logout } from '@/actions/auth.actions';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/verlauf', label: 'Verlauf', icon: HistoryIcon },
        { href: '/fixkosten', label: 'Fixkosten', icon: RefreshCw },
        { href: '/konten', label: 'Konten', icon: Wallet },
        { href: '/daten', label: 'Daten', icon: Upload },
        { href: '/einstellungen', label: 'Einstellungen', icon: Settings },
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
                "fixed top-0 left-0 z-50 h-full w-64 border-r border-surface-border bg-surface/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="font-outfit text-2xl font-bold text-text-main tracking-tight">
                                Pro <span className="text-accent">Finance</span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-wider text-text-dim font-semibold mt-1">Premium Edition</p>
                        </div>
                        <button onClick={onClose} className="lg:hidden text-text-dim hover:text-text-main transition-colors p-2 rounded-lg hover:bg-surface-hover">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1.5 flex-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                                        isActive
                                            ? "bg-accent/10 text-accent font-semibold shadow-sm"
                                            : "text-text-dim hover:text-text-main hover:bg-surface-hover"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-accent rounded-r-full" />
                                    )}
                                    <Icon size={20} className={cn(
                                        "transition-colors duration-200",
                                        isActive ? "text-accent" : "text-text-dim group-hover:text-text-main"
                                    )} />
                                    <span className="font-medium tracking-wide text-sm">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="pt-6 mt-auto border-t border-surface-border">
                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-dim hover:text-danger hover:bg-danger/10 transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-danger focus-visible:outline-none"
                        >
                            <LogOut size={20} className="group-hover:text-danger transition-colors duration-200" />
                            <span className="font-medium tracking-wide text-sm group-hover:text-danger transition-colors duration-200">Abmelden</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
