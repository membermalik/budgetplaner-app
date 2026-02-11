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

        // Use interactive transaction to ensure both succeed or fail
        const transaction = await prisma.$transaction(async (tx) => {
            // 1. Create Transaction
            const newTransaction = await tx.transaction.create({
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

            // 2. Update Account Balance (if accountId is provided)
            if (data.accountId) {
                await tx.account.update({
                    where: { id: data.accountId },
                    data: {
                        balance: {
                            increment: data.amount // Adds positive, subtracts negative
                        }
                    }
                });
            }

            return newTransaction;
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

        const transaction = await prisma.$transaction(async (tx) => {
            // 1. Calculate Balance Adjustments
            const oldAmount = existing.amount;
            const newAmount = data.amount !== undefined ? data.amount : existing.amount;

            const oldAccountId = existing.accountId;
            const newAccountId = data.accountId !== undefined ? (data.accountId || null) : existing.accountId;

            // Scenario A: Account changed
            if (oldAccountId !== newAccountId) {
                // Revert effect on old account
                if (oldAccountId) {
                    await tx.account.update({
                        where: { id: oldAccountId },
                        data: { balance: { decrement: oldAmount } }
                    });
                }
                // Apply effect on new account
                if (newAccountId) {
                    await tx.account.update({
                        where: { id: newAccountId },
                        data: { balance: { increment: newAmount } }
                    });
                }
            }
            // Scenario B: Same Account, Amount changed
            else if (newAccountId && oldAmount !== newAmount) {
                const diff = newAmount - oldAmount;
                await tx.account.update({
                    where: { id: newAccountId },
                    data: { balance: { increment: diff } }
                });
            }

            // 2. Update Transaction
            return await tx.transaction.update({
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

        await prisma.$transaction(async (tx) => {
            // 1. Revert Balance on Linked Account
            if (existing.accountId) {
                await tx.account.update({
                    where: { id: existing.accountId },
                    data: {
                        balance: {
                            decrement: existing.amount // Reverse the effect
                        }
                    }
                });
            }

            // 2. Delete Transaction
            await tx.transaction.delete({
                where: { id },
            });
        });

        revalidatePath('/');
        return true;
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        return false;
    }
}
