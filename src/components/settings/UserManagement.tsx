'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createUser } from '@/actions/admin.actions'; // We will create this
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserPlus } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} className="w-full">
            {pending ? 'Erstelle Benutzer...' : 'Benutzer anlegen'}
        </Button>
    );
}

export function UserManagement() {
    const [message, dispatch] = useFormState(createUser, undefined);

    return (
        <div className="space-y-6">
            <h4 className="font-outfit font-semibold text-text-main mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-accent" />
                Neuen Benutzer einladen
            </h4>

            <div className="p-6 rounded-2xl bg-surface border border-white/5">
                <p className="text-sm text-text-dim mb-6">
                    Erstelle hier manuell Accounts für weitere Familienmitglieder oder Mitarbeiter.
                    Sie können sich danach sofort mit diesen Daten einloggen.
                </p>

                <form action={dispatch} className="space-y-4 max-w-md">
                    <Input
                        label="Name"
                        name="name"
                        placeholder="Vorname Nachname"
                        required
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="neuer.user@example.com"
                        required
                    />
                    <Input
                        label="Passwort"
                        name="password"
                        type="password"
                        placeholder="Start-Passwort festlegen"
                        required
                        minLength={6}
                    />

                    <SubmitButton />

                    {message && (
                        <div className={`p-3 rounded-lg text-sm font-medium ${message.startsWith('Erfolg')
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
