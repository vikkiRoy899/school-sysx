import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const institution = await prisma.institution.create({
    data: {
      name: 'Test School',
      type: 'SCHOOL',
      code: 'TEST001',
    },
  });

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@testschool.com',
      role: 'SUPER_ADMIN',
      institutionId: institution.id,
      otpSecret: '123456',
      mustChangePassword: true,
      studentProfile: {
        create: {
          admissionNumber: 'ADM001',
          rollNumber: 'R001',
        },
      },
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
      otpSecret: '123457',
      mustChangePassword: true,
      teacherProfile: {
        create: {
          employeeId: 'EMP001',
          qualification: 'M.Ed',
          specialization: 'Mathematics',
        },
      },
    },
  });

  console.log('Seed data created successfully');
  console.log('Institution:', institution.name);
  console.log('Super Admin:', superAdmin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
