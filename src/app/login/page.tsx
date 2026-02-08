'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full mt-4" disabled={pending}>
            {pending ? 'Anmeldung läuft...' : 'Anmelden'}
        </Button>
    );
}

export default function LoginPage() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[--bg-color] p-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="font-outfit text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                        Willkommen zurück
                    </h1>
                    <p className="text-text-dim mt-2">Melde dich an, um fortzufahren</p>
                </div>

                <form action={dispatch} className="space-y-4">
                    <Input
                        label="Email"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="deine@email.com"
                        required
                    />
                    <Input
                        label="Passwort"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                    <SubmitButton />
                    {errorMessage && (
                        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                            <p className="text-sm text-danger">{errorMessage}</p>
                        </div>
                    )}
                </form>

                <div className="mt-6 text-center text-sm text-text-dim">
                    Noch kein Konto?{' '}
                    <Link href="/register" className="text-accent hover:underline">
                        Registrieren
                    </Link>
                </div>
            </Card>
        </div>
    );
}
