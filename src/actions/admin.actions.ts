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

export async function createUser(prevState: string | undefined, formData: FormData) {
    // 1. Check if current user is authenticated
    const session = await auth();
    if (!session?.user?.email) {
        return 'Fehler: Nicht authentifiziert.';
    }

    // 2. Validate Input
    const validatedFields = CreateUserSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return 'Ungültige Eingaben.';
    }

    const { name, email, password } = validatedFields.data;

    try {
        // 3. Check for duplicates
        const existingUser = await (prisma as any).user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return 'Fehler: Diese Email existiert bereits.';
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

        return 'Erfolg: Benutzer wurde erstellt!';
    } catch (error) {
        console.error('Create User Error:', error);
        return 'Datenbankfehler beim Erstellen des Benutzers.';
    }
}
