'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

const RegisterSchema = z.object({
    name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
    email: z.string().email('Ungültige Email-Adresse'),
    password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
});

export async function register(prevState: string | undefined, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return 'Ungültige Eingaben. Bitte überprüfen.';
    }

    const { name, email, password } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return 'Diese Email wird bereits verwendet.';
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER', // Default role
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return 'Datenbankfehler. Bitte versuche es später erneut.';
    }

    redirect('/login?registered=true');
}
