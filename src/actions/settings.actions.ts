'use server';

import prisma from '@/lib/prisma';
import { AppSettings, SparkasseData } from '@/types';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

// --- Settings ---

export async function getSettings(): Promise<AppSettings | null> {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        const settings = await prisma.settings.findUnique({
            where: { userId: session.user.id },
        });

        if (!settings) return null;

        return {
            currency: settings.currency,
            theme: settings.theme as 'dark' | 'light' | 'auto',
            notifications: settings.notifications,
            budgetLimit: settings.budgetLimit,
        };
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return null;
    }
}

export async function updateSettings(data: Partial<AppSettings>): Promise<AppSettings | null> {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        const settings = await prisma.settings.upsert({
            where: { userId: session.user.id },
            update: {
                ...(data.currency && { currency: data.currency }),
                ...(data.theme && { theme: data.theme }),
                ...(data.notifications !== undefined && { notifications: data.notifications }),
                ...(data.budgetLimit !== undefined && { budgetLimit: data.budgetLimit }),
            },
            create: {
                userId: session.user.id,
                currency: data.currency || 'EUR',
                theme: data.theme || 'dark',
                notifications: data.notifications ?? true,
                budgetLimit: data.budgetLimit || 0,
            },
        });

        revalidatePath('/');
        return {
            currency: settings.currency,
            theme: settings.theme as 'dark' | 'light' | 'auto',
            notifications: settings.notifications,
            budgetLimit: settings.budgetLimit,
        };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return null;
    }
}

// --- Sparkasse ---

export async function getSparkasseData(): Promise<SparkasseData | null> {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        const data = await prisma.sparkasse.findUnique({ where: { userId: session.user.id } });
        if (!data) return null;

        return {
            balance: data.balance,
            goal: data.goal,
            monthlyDeposited: data.monthlyDeposited,
            settings: {
                autoSaveAmount: data.autoSaveAmount,
                autoSaveEnabled: data.autoSaveEnabled,
                autoSaveDay: data.autoSaveDay
            }
        };
    } catch (error) {
        return null;
    }
}

export async function updateSparkasse(data: Partial<SparkasseData> | { settings?: Partial<SparkasseData['settings']> }): Promise<SparkasseData | null> {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        // We can't reuse getSparkasseData directly inside here cleanly if we want to optimize, but let's just proceed with upsert
        const d = data as any;
        const settingsUpdate = d.settings || {};

        // Flatten the update object for Prisma
        const prismaUpdate: any = {};
        if ('balance' in d) prismaUpdate.balance = d.balance;
        if ('goal' in d) prismaUpdate.goal = d.goal;
        if ('monthlyDeposited' in d) prismaUpdate.monthlyDeposited = d.monthlyDeposited;

        if (settingsUpdate.autoSaveAmount !== undefined) prismaUpdate.autoSaveAmount = settingsUpdate.autoSaveAmount;
        if (settingsUpdate.autoSaveEnabled !== undefined) prismaUpdate.autoSaveEnabled = settingsUpdate.autoSaveEnabled;
        if (settingsUpdate.autoSaveDay !== undefined) prismaUpdate.autoSaveDay = settingsUpdate.autoSaveDay;

        const updated = await prisma.sparkasse.upsert({
            where: { userId: session.user.id },
            update: prismaUpdate,
            create: {
                userId: session.user.id,
                balance: d.balance || 0,
                goal: d.goal || 0,
                monthlyDeposited: d.monthlyDeposited || 0,
                autoSaveAmount: settingsUpdate.autoSaveAmount || 0,
                autoSaveEnabled: settingsUpdate.autoSaveEnabled || false,
                autoSaveDay: settingsUpdate.autoSaveDay || 1
            }
        });

        revalidatePath('/');
        return {
            balance: updated.balance,
            goal: updated.goal,
            monthlyDeposited: updated.monthlyDeposited,
            settings: {
                autoSaveAmount: updated.autoSaveAmount,
                autoSaveEnabled: updated.autoSaveEnabled,
                autoSaveDay: updated.autoSaveDay
            }
        };

    } catch (error) {
        console.error("Failed to update sparkasse:", error);
        return null;
    }
}
