const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const institution = await prisma.institution.create({
    data: {
      name: 'Test School',
      type: 'SCHOOL',
      code: 'TEST001',
    },
  });

  const passwordHash = require('bcryptjs').hashSync('admin123', 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@testschool.com',
      role: 'SUPER_ADMIN',
      institutionId: institution.id,
      passwordHash,
      otpSecret: '123456',
      mustChangePassword: true,
    },
  });

  const branch = await prisma.branch.create({
    data: {
      institutionId: institution.id,
      name: 'Main Branch',
      address: '123 School St',
    },
  });

  await prisma.user.create({
    data: {
      email: 'branch@testschool.com',
      role: 'BRANCH_ADMIN',
      branchId: branch.id,
      institutionId: institution.id,
      passwordHash,
      otpSecret: '123457',
      mustChangePassword: true,
    },
  });

  console.log('✅ Seed data created successfully');
  console.log('🏫 Institution:', institution.name);
  console.log('👤 Super Admin:', superAdmin.email);
  console.log('👤 Branch Admin: branch@testschool.com');
  console.log('🔑 Password: admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
