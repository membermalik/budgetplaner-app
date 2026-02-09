const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'livepro@test.com'; // or the user'z email

    // Update the first user we find to be ADMIN if we can't find specific email
    // Or just update the one we just created in the test
    try {
        // Let's just update all users to ADMIN for now for simplicity of the first user
        // Or better, let's find the user the user is logged in as. 
        // Assuming 'membermalik' or similar.

        // Let's just create a new ADMIN user for the user to login with
        // actually, user likely wants THEIR account to be admin. 

        const user = await prisma.user.findFirst();
        if (user) {
            console.log(`Promoting user ${user.email} to ADMIN...`);
            await prisma.user.update({
                where: { id: user.id },
                data: { role: 'ADMIN' },
            });
            console.log('Success!');
        } else {
            console.log('No users found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
