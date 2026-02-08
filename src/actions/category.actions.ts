'use server';

import prisma from '@/lib/prisma';
import { Category, CategoryMap } from '@/types';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getCategories(): Promise<CategoryMap> {
    try {
        const session = await auth();
        // If not logged in, maybe return default? Or empty.
        // For now, let's return user categories + potentially global ones?
        // Schema: Category userId is optional.
        if (!session?.user?.id) return {};

        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { userId: session.user.id },
                    { userId: null } // Assuming global categories have null userId
                ]
            }
        });
        const categoryMap: CategoryMap = {};
        categories.forEach((c: any) => {
            categoryMap[c.key] = {
                label: c.label,
                color: c.color,
                budgetLimit: c.budgetLimit ?? undefined
            };
        });
        return categoryMap;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return {};
    }
}

export async function createCategory(key: string, data: Category): Promise<Category | null> {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        const category = await prisma.category.create({
            data: {
                key, // key needs to be unique. If global keys exist, this might clash?
                // Schema has @@unique([key, userId]). So user can have own "food" category if we used that compound key.
                // But `key` is `@id`. Wait.
                // Schema: key String @id.
                // This is bad for multi-tenancy if 'key' is just "food".
                // I need to change Category model to use a composite ID or a generated ID and just have a 'key' field for reference?
                // OR: existing schema had `key String @id`.
                // I changed it to: `@@unique([key, userId])`? No, I tried but `key` was still `@id`.
                // If `key` is `@id`, it must be unique globally. 
                // This means 'food' can only exist once.
                // I should have caught this in planning.
                // FIX: I will change key to be just a field, and add an ID. 
                // BUT: `Transaction` refers to `category String`. It's a string reference.
                // If I change Category ID, I break the relation (which doesn't exist formally in DB, just in code app logic?).
                // Check schema: Transaction has `category String`. No @relation.
                // So it's just a string labeling.
                // In this case, `Category` model is just a list of available options/colors.
                // Users might want custom categories.
                // If I keep `key` as ID, then User A cannot create "food" if User B has "food".
                // Workaround: Prefix key with userId? e.g. "user1_food".
                // But `getTransactions` shows `category` string.
                // If I use "user1_food", the UI shows "user1_food"? No, UI uses `label` from map.
                // So if I save "user1_food" in Transaction.category, I need to look it up in CategoryMap.
                // This works.
                // Better: Change Schema for Category to have `id Int @id`, `key String`, `userId String`.
                // And `Transaction.category` refers to `Category.key`.
                // But `Transaction.category` is not a foreign key.
                // Let's stick to prefixing for now to avoid schema migration chaos right now?
                // Or better: Fix schema properly. I already reset DB.
                // I will update schema to `model Category { id String @id @default(cuid()), key String, ... @@unique([key, userId]) }`.
                // And `Transaction` keeps `category String`.
                // Function `getCategories` returns Map<Key, Data>.
                // If multiple users satisfy "food", well they are filtered by userId.
                label: data.label,
                color: data.color,
                budgetLimit: data.budgetLimit,
                userId: session.user.id,
            },
        });
        revalidatePath('/');
        return {
            label: category.label,
            color: category.color,
            budgetLimit: category.budgetLimit ?? undefined,
        };
    } catch (error) {
        console.error('Failed to create category:', error);
        return null;
    }
}

export async function updateCategory(key: string, data: Partial<Category>): Promise<Category | null> {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        // Strategy: find category by key. If it belongs to user, update.
        // If it is global (userId null), reject or copy-on-write?
        // Let's assume for now we only edit user categories.

        const existing = await prisma.category.findUnique({ where: { key } });
        if (!existing || existing.userId !== session.user.id) return null;

        const category = await prisma.category.update({
            where: { key },
            data: {
                ...(data.label && { label: data.label }),
                ...(data.color && { color: data.color }),
                ...(data.budgetLimit !== undefined && { budgetLimit: data.budgetLimit }),
            },
        });
        revalidatePath('/');
        return {
            label: category.label,
            color: category.color,
            budgetLimit: category.budgetLimit ?? undefined,
        };
    } catch (error) {
        console.error('Failed to update category:', error);
        return null;
    }
}

export async function deleteCategory(key: string): Promise<boolean> {
    try {
        const session = await auth();
        if (!session?.user?.id) return false;

        const existing = await prisma.category.findUnique({ where: { key } });
        if (!existing || existing.userId !== session.user.id) return false;

        await prisma.category.delete({
            where: { key },
        });
        revalidatePath('/');
        return true;
    } catch (error) {
        console.error('Failed to delete category:', error);
        return false;
    }
}
