'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CreateUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function createClient(prevState: any, formData: FormData) {
    const session = await auth();

    // 1. Check if user is logged in
    if (!session?.user?.email) {
        return { error: 'Unauthorized' };
    }

    // 2. Check if user is ADMIN
    // Note: We need to extend the session type to include role, 
    // but for now we'll check the DB directly for security.
    const adminUser = await (prisma as any).user.findUnique({
        where: { email: session.user.email },
    });

    if (adminUser?.role !== 'ADMIN') {
        return { error: 'Forbidden: Only Admins can create users.' };
    }

    // 3. Validate Input
    const validatedFields = CreateUserSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    const { name, email, password } = validatedFields.data;

    // 4. Check uniqueness
    const existingUser = await (prisma as any).user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: 'User already exists' };
    }

    // 5. Create User
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await (prisma as any).user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER', // Default role is USER
            },
        });

        revalidatePath('/admin');
        return { success: 'Client created successfully!' };
    } catch (error) {
        console.error(error);
        return { error: 'Database Error: Failed to create user.' };
    }
}

export async function getClients() {
    const session = await auth();
    if (!session?.user?.email) return [];

    const adminUser = await (prisma as any).user.findUnique({
        where: { email: session.user.email },
    });

    if (adminUser?.role !== 'ADMIN') return [];

    return await (prisma as any).user.findMany({
        where: { role: 'USER' },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            _count: {
                select: { accounts: true, transactions: true },
            }
        }
    });
}
