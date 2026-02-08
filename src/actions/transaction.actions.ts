'use server';

import prisma from '@/lib/prisma';
import { Transaction } from '@/types';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getTransactions(): Promise<Transaction[]> {
    try {
        const session = await auth();
        if (!session?.user?.id) return [];

        const transactions = await prisma.transaction.findMany({
            where: { userId: session.user.id },
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
        const session = await auth();
        if (!session?.user?.id) return null;

        const transaction = await prisma.transaction.create({
            data: {
                text: data.text,
                amount: data.amount,
                category: data.category,
                date: data.date,
                month: data.month,
                accountId: data.accountId,
                userId: session.user.id,
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
        const session = await auth();
        if (!session?.user?.id) return null;

        const existing = await prisma.transaction.findUnique({ where: { id } });
        if (!existing || existing.userId !== session.user.id) return null;

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
        const session = await auth();
        if (!session?.user?.id) return false;

        const existing = await prisma.transaction.findUnique({ where: { id } });
        if (!existing || existing.userId !== session.user.id) return false;

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
