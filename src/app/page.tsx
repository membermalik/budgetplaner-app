'use client';

import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { ChartsSection } from '@/components/dashboard/ChartsSection';

export default function Dashboard() {
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
}
