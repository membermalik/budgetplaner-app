'use server';

import prisma from '@/lib/prisma';
import { Account, AccountType } from '@/types';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

// --- Accounts ---

export async function getAccounts(): Promise<Account[]> {
    try {
        const session = await auth();
        if (!session?.user?.id) return [];

        const accounts = await prisma.account.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
        });

        return accounts.map((account: any) => ({
            ...account,
            createdAt: account.createdAt.toISOString(),
            updatedAt: account.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error('Failed to fetch accounts:', error);
        return [];
    }
}

export async function createAccount(data: Omit<Account, 'id' | 'createdAt'>): Promise<Account | null> {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        const account = await prisma.account.create({
            data: {
                name: data.name,
                type: data.type,
                balance: data.balance,
                currency: data.currency,
                color: data.color,
                userId: session.user.id,
            },
        });

        revalidatePath('/');
        return {
            ...account,
            createdAt: account.createdAt.toISOString(),
            updatedAt: account.updatedAt.toISOString(),
        };
    } catch (error) {
        console.error('Failed to create account:', error);
        return null;
    }
}

export async function updateAccount(id: string, data: Partial<Account>): Promise<Account | null> {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        const existing = await prisma.account.findUnique({ where: { id } });
        if (!existing || existing.userId !== session.user.id) return null;

        const account = await prisma.account.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.type && { type: data.type }),
                ...(data.balance !== undefined && { balance: data.balance }),
                ...(data.currency && { currency: data.currency }),
                ...(data.color && { color: data.color }),
            },
        });

        revalidatePath('/');
        return {
            ...account,
            createdAt: account.createdAt.toISOString(),
            updatedAt: account.updatedAt.toISOString(),
        };
    } catch (error) {
        console.error('Failed to update account:', error);
        return null;
    }
}

export async function deleteAccount(id: string): Promise<boolean> {
    try {
        const session = await auth();
        if (!session?.user?.id) return false;

        const existing = await prisma.account.findUnique({ where: { id } });
        if (!existing || existing.userId !== session.user.id) return false;

        await prisma.account.delete({
            where: { id },
        });
        revalidatePath('/');
        return true;
    } catch (error) {
        console.error('Failed to delete account:', error);
        return false;
    }
}

// --- Account Types ---
// Ideally these would be in the DB too, but for now we might keep them static or in DB if model exists
// We defined AccountType model in prisma, so let's use it.

export async function getAccountTypes(): Promise<AccountType[]> {
    try {
        const types = await prisma.accountType.findMany();
        return types;
    } catch (error) {
        return [];
    }
}

export async function seedAccountTypes(types: AccountType[]) {
    // Helper to seed initial types
    try {
        for (const t of types) {
            await prisma.accountType.upsert({
                where: { id: t.id },
                update: {},
                create: t
            })
        }
    } catch (error) {
        console.error("Failed to seed account types", error);
    }
}
