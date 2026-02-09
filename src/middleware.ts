import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
    // Protect all routes EXCEPT:
    // - / (Landing Page)
    // - /api (API routes)
    // - /_next (Static files)
    // - /login (Auth page)
    // - /register (Register page)
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|register|$).*)'],
};
