'use client';

import { useEffect } from 'react';
import { useBudgetStore } from '@/store/budgetStore';

export function RecurringEvaluator() {
    const { checkRecurringTransactions, isLoading } = useBudgetStore();

    useEffect(() => {
        if (!isLoading) {
            checkRecurringTransactions();
        }
    }, [checkRecurringTransactions, isLoading]);

    return null; // This component renders nothing
}
