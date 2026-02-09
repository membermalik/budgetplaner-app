import Link from 'next/link';
import { ArrowRight, BarChart3, Lock, Zap } from 'lucide-react';
import { HeroSection } from '@/components/landing/HeroSection';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Header */}
            <header className="px-6 lg:px-8 h-16 flex items-center justify-between border-b border-gray-800/50 backdrop-blur-md fixed w-full z-50 bg-black/50">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        ProFinance
                    </span>
                </div>
                <nav className="flex gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="mailto:contact@member-business.de"
                        className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Kontakt
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="flex-grow pt-32 pb-16 px-6 lg:px-8 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />

                <div className="max-w-3xl mx-auto">
                    <HeroSection />
                </div>

                {/* Feature Grid */}
                <div className="max-w-5xl mx-auto mt-32 grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Lock className="w-6 h-6 text-emerald-400" />,
                            title: "Bank-Level Security",
                            desc: "Ihre Daten sind durch modernste Verschlüsselung und strikte Zugriffsrichtlinien geschützt."
                        },
                        {
                            icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
                            title: "Echtzeit Analytics",
                            desc: "Verfolgen Sie Einnahmen, Ausgaben und Vermögensentwicklung live in Ihrem Dashboard."
                        },
                        {
                            icon: <Zap className="w-6 h-6 text-amber-400" />,
                            title: "High Performance",
                            desc: "Blitzschnelle Ladezeiten und sofortige Synchronisation für ein optimales Erlebnis."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Member Business. All rights reserved. (v1.1)</p>
            </footer>
        </div>
    );
}
