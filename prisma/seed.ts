import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin.email);

  // Create categories
  const categories = [
    { name: 'Web Development', description: 'Articles about web development' },
    { name: 'Design', description: 'Articles about design' },
    { name: 'Marketing', description: 'Articles about digital marketing' },
    { name: 'Business', description: 'Articles about business and entrepreneurship' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Created categories');

  // Create tags
  const tags = [
    { name: 'JavaScript' },
    { name: 'React' },
    { name: 'Next.js' },
    { name: 'TypeScript' },
    { name: 'CSS' },
    { name: 'UI/UX' },
    { name: 'SEO' },
    { name: 'Productivity' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  console.log('Created tags');

  // Create default settings
  const settings = [
    { key: 'site_name', value: 'DigitalSpeed' },
    { key: 'site_description', value: 'A modern digital agency' },
    { key: 'contact_email', value: 'info@digitalspeed.com' },
    { key: 'contact_phone', value: '(123) 456-7890' },
    { key: 'contact_address', value: '123 Digital Street, Tech City, TC 12345' },
    { key: 'social_facebook', value: 'https://facebook.com/' },
    { key: 'social_twitter', value: 'https://twitter.com/' },
    { key: 'social_instagram', value: 'https://instagram.com/' },
    { key: 'social_linkedin', value: 'https://linkedin.com/' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('Created default settings');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
