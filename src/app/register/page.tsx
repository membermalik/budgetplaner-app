'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { register } from '@/actions/register';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full mt-4" disabled={pending}>
            {pending ? 'Registrierung läuft...' : 'Registrieren'}
        </Button>
    );
}

export default function RegisterPage() {
    const [errorMessage, dispatch] = useFormState(register, undefined);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[--bg-color] p-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="font-outfit text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                        Konto erstellen
                    </h1>
                    <p className="text-text-dim mt-2">Werde Teil der Elite.</p>
                </div>

                <form action={dispatch} className="space-y-4">
                    <Input
                        label="Name"
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Max Mustermann"
                        required
                        minLength={2}
                    />
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
                        <div className="flex bg-danger/10 p-3 rounded-lg border border-danger/20 mt-4" aria-live="polite">
                            <p className="text-sm text-danger font-medium">{errorMessage}</p>
                        </div>
                    )}
                </form>

                <div className="mt-6 text-center text-sm text-text-dim">
                    Bereits registriert?{' '}
                    <Link href="/login" className="text-accent hover:underline">
                        Anmelden
                    </Link>
                </div>
            </Card>
        </div>
    );
}
