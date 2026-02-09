const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Creating/Updating test user...');

    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        // Update password if user exists
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                role: 'ADMIN' // Ensure test user is admin for full access
            },
        });
        console.log(`Test user updated: ${email} / ${password} (ADMIN)`);
    } else {
        // Create new user
        await prisma.user.create({
            data: {
                name: 'Test Benutzer',
                email,
                password: hashedPassword,
                role: 'ADMIN',
                image: 'https://avatar.vercel.sh/test',
            },
        });
        console.log(`Test user created: ${email} / ${password} (ADMIN)`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
