'use server';

import prisma from '@/lib/prisma';
import { RecurringTransaction } from '@/types';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getRecurringTransactions(): Promise<RecurringTransaction[]> {
    try {
        const session = await auth();
        if (!session?.user?.id) return [];

        const transactions = await prisma.recurringTransaction.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });
        return transactions.map((t: any) => ({
            ...t,
            interval: t.interval as 'monthly',
            history: t.history ? JSON.parse(t.history) : [],
        }));
    } catch (error) {
        console.error('Failed to fetch recurring transactions:', error);
        return [];
    }
}

export async function createRecurringTransaction(data: Omit<RecurringTransaction, 'id' | 'lastExecuted' | 'isActive' | 'history'>): Promise<RecurringTransaction | null> {
    // Remove try/catch to let Next.js Error Boundary / UI see the real error
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized: No session found");
    }

    // Use prisma.recurringTransaction.create
    // Note: If Prisma Client is outdated, this will throw "Unknown argument"
    const transaction = await prisma.recurringTransaction.create({
        data: {
            text: data.text,
            amount: data.amount,
            category: data.category,
            interval: data.interval,
            dayOfMonth: data.dayOfMonth,
            startDate: data.startDate,
            endDate: data.endDate,
            noticePeriod: data.noticePeriod,
            notes: data.notes,
            // history: '[]', // Let default value handle this
            isActive: true,
            lastExecuted: null,
            userId: session.user.id,
        },
    });

    revalidatePath('/');

    return {
        ...transaction,
        interval: transaction.interval as 'monthly',
        endDate: transaction.endDate ?? undefined,
        noticePeriod: transaction.noticePeriod ?? undefined,
        notes: transaction.notes ?? undefined,
        history: [], // Return empty array for FE
    };
}

export async function updateRecurringTransaction(id: string, data: Partial<RecurringTransaction>): Promise<RecurringTransaction | null> {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        const existing = await prisma.recurringTransaction.findUnique({ where: { id } });
        if (!existing || existing.userId !== session.user.id) return null;

        // Change Detection
        const changes: string[] = [];
        if (data.amount !== undefined && data.amount !== existing.amount) {
            changes.push(`Betrag: ${existing.amount}€ -> ${data.amount}€`);
        }
        if (data.text && data.text !== existing.text) {
            changes.push(`Titel: ${existing.text} -> ${data.text}`);
        }
        if (data.dayOfMonth !== undefined && data.dayOfMonth !== existing.dayOfMonth) {
            changes.push(`Tag: ${existing.dayOfMonth}. -> ${data.dayOfMonth}.`);
        }
        if (data.isActive !== undefined && data.isActive !== existing.isActive) {
            changes.push(`Status: ${existing.isActive ? 'Aktiv' : 'Pausiert'} -> ${data.isActive ? 'Aktiv' : 'Pausiert'}`);
        }

        let newHistory = existing.history;
        if (changes.length > 0) {
            const currentHistory = existing.history ? JSON.parse(existing.history) : [];
            const newEntry = {
                date: new Date().toISOString(),
                changes
            };
            // Keep only last 20 entries to save space
            const updatedHistoryList = [newEntry, ...currentHistory].slice(0, 20);
            newHistory = JSON.stringify(updatedHistoryList);
        }

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
                ...(data.noticePeriod !== undefined && { noticePeriod: data.noticePeriod }),
                ...(data.notes !== undefined && { notes: data.notes }),
                history: newHistory,
            },
        });
        revalidatePath('/');
        return {
            ...transaction,
            interval: transaction.interval as 'monthly',
            endDate: transaction.endDate ?? undefined,
            noticePeriod: transaction.noticePeriod ?? undefined,
            notes: transaction.notes ?? undefined,
            history: JSON.parse(transaction.history),
        };
    } catch (error) {
        console.error('Failed to update recurring transaction:', error);
        return null;
    }
}

export async function deleteRecurringTransaction(id: string): Promise<boolean> {
    try {
        const session = await auth();
        if (!session?.user?.id) return false;

        const existing = await prisma.recurringTransaction.findUnique({ where: { id } });
        if (!existing || existing.userId !== session.user.id) return false;

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
