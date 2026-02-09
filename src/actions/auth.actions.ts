'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

const RegisterSchema = z.object({
    email: z.string().email({ message: 'Ungültige Email-Adresse' }),
    password: z.string().min(6, { message: 'Passwort muss mindestens 6 Zeichen lang sein' }),
    name: z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein' }),
});

export async function register(prevState: string | undefined, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return 'Fehler bei der Validierung. Bitte überprüfe deine Eingaben.';
    }

    const { email, password, name } = validatedFields.data;

    try {
        const existingUser = await (prisma as any).user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return 'Email wird bereits verwendet.';
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await (prisma as any).user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return 'Datenbankfehler bei der Registrierung.';
    }

    // Attempt login after registration
    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Ungültige Anmeldedaten.';
                default:
                    return 'Etwas ist schief gelaufen.';
            }
        }
        throw error;
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData.entries()),
            redirectTo: '/dashboard',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Ungültige Anmeldedaten.';
                default:
                    return 'Etwas ist schief gelaufen.';
            }
        }
        throw error;
    }
}

export async function logout() {
    await signOut({ redirectTo: '/' });
}
