import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { RecurringEvaluator } from '@/components/layout/RecurringEvaluator';

import { StoreInitializer } from '@/components/layout/StoreInitializer';

export const metadata: Metadata = {
    title: 'Budgetplaner | Pro Finance',
    description: 'Deine persönliche Finanzverwaltung - Transaktionen, Sparen & Analyse',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
            <body>
                <ThemeProvider>
                    <StoreInitializer />
                    <RecurringEvaluator />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
