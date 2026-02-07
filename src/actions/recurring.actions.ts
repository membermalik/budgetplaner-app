'use server';

import prisma from '@/lib/prisma';
import { RecurringTransaction } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getRecurringTransactions(): Promise<RecurringTransaction[]> {
    try {
        const transactions = await prisma.recurringTransaction.findMany();
        return transactions.map((t: any) => ({
            ...t,
            interval: t.interval as 'monthly', // Cast for now as only monthly is supported
        }));
    } catch (error) {
        console.error('Failed to fetch recurring transactions:', error);
        return [];
    }
}

export async function createRecurringTransaction(data: Omit<RecurringTransaction, 'id' | 'lastExecuted' | 'isActive'>): Promise<RecurringTransaction | null> {
    try {
        const transaction = await prisma.recurringTransaction.create({
            data: {
                text: data.text,
                amount: data.amount,
                category: data.category,
                interval: data.interval,
                dayOfMonth: data.dayOfMonth,
                startDate: data.startDate,
                endDate: data.endDate,
                isActive: true,
                lastExecuted: null,
            },
        });
        revalidatePath('/');
        return {
            ...transaction,
            interval: transaction.interval as 'monthly',
            endDate: transaction.endDate ?? undefined,
        };
    } catch (error) {
        console.error('Failed to create recurring transaction:', error);
        return null;
    }
}

export async function updateRecurringTransaction(id: string, data: Partial<RecurringTransaction>): Promise<RecurringTransaction | null> {
    try {
        const transaction = await prisma.recurringTransaction.update({
            where: { id },
            data: {
                ...(data.text && { text: data.text }),
                ...(data.amount !== undefined && { amount: data.amount }),
                ...(data.category && { category: data.category }),
                ...(data.dayOfMonth !== undefined && { dayOfMonth: data.dayOfMonth }),
                ...(data.startDate && { startDate: data.startDate }),
                ...(data.endDate !== undefined && { endDate: data.endDate }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
                ...(data.lastExecuted !== undefined && { lastExecuted: data.lastExecuted }),
            },
        });
        revalidatePath('/');
        return {
            ...transaction,
            interval: transaction.interval as 'monthly',
            endDate: transaction.endDate ?? undefined,
        };
    } catch (error) {
        console.error('Failed to update recurring transaction:', error);
        return null;
    }
}

export async function deleteRecurringTransaction(id: string): Promise<boolean> {
    try {
        await prisma.recurringTransaction.delete({
            where: { id },
        });
        revalidatePath('/');
        return true;
    } catch (error) {
        console.error('Failed to delete recurring transaction:', error);
        return false;
    }
}
