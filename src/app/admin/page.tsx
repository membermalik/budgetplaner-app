'use client';

import { useFormState } from 'react-dom';
import { createUser, getUsers } from '@/actions/admin.actions';
import { useEffect, useState } from 'react';
import { Lock, Plus, Users, ShieldAlert } from 'lucide-react';
import { SubmitButton } from '@/components/auth/SubmitButton';

interface Client {
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
    _count: {
        accounts: number;
        transactions: number;
    };
}

export default function AdminPage() {
    const [state, formAction] = useFormState(createUser, undefined);
    const [clients, setClients] = useState<Client[]>([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        getUsers().then((data) => setClients(data as any));
    }, [state]); // Refresh list when a new user is created

    return (
        <div className="min-h-screen bg-black text-white p-6 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex items-center justify-between border-b border-gray-800 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Lock className="w-8 h-8 text-blue-500" />
                            Admin Gateway
                        </h1>
                        <p className="text-gray-400 mt-2">Manage exclusive client access.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Neuen Kunden anlegen
                    </button>
                </header>

                {/* Create Client Form */}
                {showForm && (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 animate-fade-in">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-400" />
                            Client Onboarding
                        </h2>
                        <form action={formAction} className="grid md:grid-cols-3 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    placeholder="Max Mustermann"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    placeholder="client@mail.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Initial Password</label>
                                <input
                                    name="password"
                                    type="text"
                                    required
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    placeholder="SecurePassword123"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <SubmitButton>Account erstellen</SubmitButton>
                                {state?.error && (
                                    <p className="mt-4 text-red-400 flex items-center gap-2 text-sm bg-red-400/10 p-3 rounded-lg">
                                        <ShieldAlert className="w-4 h-4" />
                                        {state.error}
                                    </p>
                                )}
                                {state?.success && (
                                    <p className="mt-4 text-emerald-400 text-sm bg-emerald-400/10 p-3 rounded-lg">
                                        {state.success}
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* Client List */}
                <div className="bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                        <Users className="w-5 h-5 text-purple-400" />
                        <h2 className="font-semibold text-lg">Active Clients</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-900/50 text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Registered</th>
                                    <th className="px-6 py-4 font-medium text-center">Stats</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {clients.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No clients found. Create your first exclusive member above.
                                        </td>
                                    </tr>
                                ) : (
                                    clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-white group-hover:text-blue-400 transition-colors">
                                                {client.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 font-mono">
                                                {client.email}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(client.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                                                        {client._count.accounts} Acc
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                                                        {client._count.transactions} Tx
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
