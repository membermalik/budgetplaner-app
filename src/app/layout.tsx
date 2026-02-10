import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { RecurringEvaluator } from '@/components/layout/RecurringEvaluator';

import { StoreInitializer } from '@/components/layout/StoreInitializer';
import { Toaster } from '@/components/ui/Toaster';

export const metadata: Metadata = {
    title: 'Budgetplaner | Pro Finance',
    description: 'Deine persönliche Finanzverwaltung - Transaktionen, Sparen & Analyse',
};

import { AppLayout } from '@/components/layout/AppLayout';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
            <body className="font-inter antialiased bg-background text-text-main min-h-screen">
                <ThemeProvider>
                    <StoreInitializer />
                    <RecurringEvaluator />
                    <Toaster position="bottom-right" theme="dark" richColors />
                    <AppLayout>
                        {children}
                    </AppLayout>
                </ThemeProvider>
            </body>
        </html>
    );
}
