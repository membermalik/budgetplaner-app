'use client';

import { usePathname } from 'next/navigation';
import { Home, BarChart3, Plus, Settings, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface MobileNavProps {
    onOpenSettings: () => void;
    onOpenTransaction?: () => void;
    showReports: boolean;
    toggleReports: () => void;
}

export function MobileNav({
    onOpenSettings,
    onOpenTransaction,
    showReports,
    toggleReports
}: MobileNavProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
            {/* Gradient Fade Top */}
            <div className="absolute bottom-full left-0 right-0 h-12 bg-gradient-to-t from-[--bg-color] to-transparent pointer-events-none" />

            <div className="bg-[--bg-color]/80 backdrop-blur-xl border-t border-white/[0.05] px-4 py-2 pb-safe-area-inset-bottom">
                <div className="flex items-center justify-between max-w-sm mx-auto">
                    {/* Home */}
                    <button
                        onClick={() => !showReports && window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
                            !showReports ? "text-accent" : "text-text-dim hover:text-text-main"
                        )}
                    >
                        <Home size={22} className={!showReports ? "fill-accent/20" : ""} />
                        <span className="text-[10px] font-medium">Home</span>
                    </button>

                    {/* Stats */}
                    <button
                        onClick={toggleReports}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
                            showReports ? "text-accent" : "text-text-dim hover:text-text-main"
                        )}
                    >
                        <BarChart3 size={22} className={showReports ? "fill-accent/20" : ""} />
                        <span className="text-[10px] font-medium">Statistik</span>
                    </button>

                    {/* Add FAB */}
                    <div className="relative -top-6">
                        <Button
                            variant="primary"
                            onClick={onOpenTransaction}
                            className="w-14 h-14 rounded-full flex items-center justify-center p-0 shadow-[0_8px_20px_rgba(99,102,241,0.4)] border-4 border-[--bg-color]"
                        >
                            <Plus size={28} />
                        </Button>
                    </div>

                    {/* Future: Goals or something else */}
                    <button
                        className="flex flex-col items-center gap-1 p-2 rounded-xl text-text-dim hover:text-text-main transition-colors"
                        // Placeholder for future feature
                        onClick={() => { }}
                    >
                        <TrendingUp size={22} />
                        <span className="text-[10px] font-medium">Ziele</span>
                    </button>

                    {/* Settings */}
                    <button
                        onClick={onOpenSettings}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl text-text-dim hover:text-text-main transition-colors"
                    >
                        <Settings size={22} />
                        <span className="text-[10px] font-medium">Optionen</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
