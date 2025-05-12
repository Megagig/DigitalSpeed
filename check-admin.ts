import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (adminUser) {
      console.log('Admin user exists:');
      console.log({
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        hasPassword: !!adminUser.password,
      });
    } else {
      console.log('Admin user does not exist');
    }
  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
