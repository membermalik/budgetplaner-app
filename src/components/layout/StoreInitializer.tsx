'use client';

import { useEffect, useRef } from 'react';
import { useBudgetStore } from '@/store/budgetStore';

export function StoreInitializer() {
    const initialized = useRef(false);
    const fetchInitialData = useBudgetStore((state) => state.fetchInitialData);

    useEffect(() => {
        if (!initialized.current) {
            fetchInitialData();
            initialized.current = true;
        }
    }, [fetchInitialData]);

    return null;
}
