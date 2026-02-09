import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
        newUser: '/register',
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') ||
                nextUrl.pathname.startsWith('/konten') ||
                nextUrl.pathname.startsWith('/verlauf') ||
                nextUrl.pathname.startsWith('/fixkosten') ||
                nextUrl.pathname.startsWith('/daten') ||
                nextUrl.pathname.startsWith('/einstellungen') ||
                nextUrl.pathname.startsWith('/admin');

            const isLoginPage = nextUrl.pathname.startsWith('/login');

            // Allow public access to landing page
            if (nextUrl.pathname === '/') return true;

            if (isLoginPage) {
                if (isLoggedIn) {
                    return Response.redirect(new URL('/', nextUrl));
                }
                return true;
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated to login
            }
            return true;
        },
        session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
} satisfies NextAuthConfig;
