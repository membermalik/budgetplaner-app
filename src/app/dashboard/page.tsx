'use client';

import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { ReportsSection } from '@/components/dashboard/ReportsSection';
import { PageContainer } from '@/components/layout/PageContainer';

export default function DashboardPage() {
    return (
        <PageContainer className="grid grid-cols-1 gap-6">
            <BalanceCard />
            <ChartsSection />
            <ReportsSection />
        </PageContainer>
    );
}
