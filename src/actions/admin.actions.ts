'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';

const CreateUserSchema = z.object({
    name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
    email: z.string().email('Ungültige Email-Adresse'),
    password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
});

export type ActionState = {
    error?: string;
    success?: string;
};

export async function createUser(prevState: ActionState | undefined, formData: FormData) {
    // 1. Check if current user is authenticated
    const session = await auth();
    if (!session?.user?.email) {
        return { error: 'Fehler: Nicht authentifiziert.' };
    }

    // 2. Validate Input
    const validatedFields = CreateUserSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return { error: 'Ungültige Eingaben.' };
    }

    const { name, email, password } = validatedFields.data;

    try {
        // 3. Check for duplicates
        const existingUser = await (prisma as any).user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: 'Fehler: Diese Email existiert bereits.' };
        }

        // 4. Create User
        const hashedPassword = await bcrypt.hash(password, 10);
        await (prisma as any).user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
            },
        });

        return { success: 'Benutzer wurde erfolgreich erstellt!' };
    } catch (error) {
        console.error('Create User Error:', error);
        return { error: 'Datenbankfehler beim Erstellen des Benutzers.' };
    }
}

export async function getUsers() {
    const session = await auth();
    if (!session?.user?.email) return [];

    try {
        const users = await (prisma as any).user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: {
                    select: {
                        accounts: true,
                        transactions: true,
                    }
                }
            }
        });
        return users;
    } catch (error) {
        console.error('Fetch Users Error:', error);
        return [];
    }
}
