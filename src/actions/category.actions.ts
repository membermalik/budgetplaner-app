'use server';

import prisma from '@/lib/prisma';
import { Category, CategoryMap } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getCategories(): Promise<CategoryMap> {
    try {
        const categories = await prisma.category.findMany();
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
        const category = await prisma.category.create({
            data: {
                key,
                label: data.label,
                color: data.color,
                budgetLimit: data.budgetLimit,
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
