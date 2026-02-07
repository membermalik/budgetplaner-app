'use server';

import prisma from '@/lib/prisma';
import { Transaction } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getTransactions(): Promise<Transaction[]> {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { date: 'desc' },
        });

        return transactions.map((t: any) => ({
            ...t,
            // Ensure types match
            accountId: t.accountId ?? undefined,
        }));
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return [];
    }
}

export async function createTransaction(data: Omit<Transaction, 'id'>): Promise<Transaction | null> {
    try {
        const transaction = await prisma.transaction.create({
            data: {
                text: data.text,
                amount: data.amount,
                category: data.category,
                date: data.date,
                month: data.month,
                accountId: data.accountId,
            },
        });

        revalidatePath('/');
        return {
            ...transaction,
            accountId: transaction.accountId ?? undefined,
        };
    } catch (error) {
        console.error('Failed to create transaction:', error);
        return null;
    }
}

export async function updateTransaction(id: number, data: Partial<Transaction>): Promise<Transaction | null> {
    try {
        const transaction = await prisma.transaction.update({
            where: { id },
            data: {
                ...(data.text && { text: data.text }),
                ...(data.amount !== undefined && { amount: data.amount }),
                ...(data.category && { category: data.category }),
                ...(data.date && { date: data.date }),
                ...(data.month && { month: data.month }),
                ...(data.accountId !== undefined && { accountId: data.accountId }),
            },
        });

        revalidatePath('/');
        return {
            ...transaction,
            accountId: transaction.accountId ?? undefined,
        };
    } catch (error) {
        console.error('Failed to update transaction:', error);
        return null;
    }
}

export async function deleteTransaction(id: number): Promise<boolean> {
    try {
        await prisma.transaction.delete({
            where: { id },
        });
        revalidatePath('/');
        return true;
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        return false;
    }
}
