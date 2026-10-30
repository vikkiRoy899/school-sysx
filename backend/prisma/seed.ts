/**
 * Demo seed for the School & Coaching Management System.
 *
 *   npm run db:seed --workspace=backend     (or: npx prisma db seed)
 *
 * Idempotent: if an institution already exists the script exits without
 * touching your data. All demo users share the password `admin123`.
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'admin123';

function startOfToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function inDays(days: number): Date {
  const d = startOfToday();
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

async function main() {
  const existing = await prisma.institution.findFirst();
  if (existing) {
    console.log(`Database already seeded (institution: ${existing.name}). Nothing to do.`);
    return;
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const institution = await prisma.institution.create({
    data: { name: 'Test School', type: 'SCHOOL', code: 'TEST001' },
  });

  const branch = await prisma.branch.create({
    data: {
      institutionId: institution.id,
      name: 'Main Branch',
      address: '123 School St',
      contactInfo: '+91 90000 00000',
    },
  });

  const klass = await prisma.class.create({
    data: {
      institutionId: institution.id,
      branchId: branch.id,
      name: 'Class 10',
      section: 'A',
    },
  });

  const superAdmin = await prisma.user.create({
    data: {
      institutionId: institution.id,
      email: 'admin@testschool.com',
      role: 'SUPER_ADMIN',
      passwordHash,
      otpSecret: '123456',
    },
  });

  await prisma.user.create({
    data: {
      institutionId: institution.id,
      branchId: branch.id,
      email: 'branch@testschool.com',
      role: 'BRANCH_ADMIN',
      passwordHash,
    },
  });

  const teacher = await prisma.user.create({
    data: {
      institutionId: institution.id,
      branchId: branch.id,
      email: 'teacher@testschool.com',
      role: 'TEACHER',
      passwordHash,
      teacherProfile: {
        create: {
          employeeId: 'EMP001',
          qualification: 'M.Ed',
          specialization: 'Mathematics',
        },
      },
    },
    include: { teacherProfile: true },
  });

  const parent = await prisma.user.create({
    data: {
      institutionId: institution.id,
      branchId: branch.id,
      email: 'parent@testschool.com',
      role: 'PARENT',
      passwordHash,
      parentProfile: { create: { occupation: 'Engineer' } },
    },
    include: { parentProfile: true },
  });

  const studentEmails = ['student1@testschool.com', 'student2@testschool.com'];
  const students = [];

  for (const [index, email] of studentEmails.entries()) {
    const student = await prisma.user.create({
      data: {
        institutionId: institution.id,
        branchId: branch.id,
        email,
        role: 'STUDENT',
        passwordHash,
        studentProfile: {
          create: {
            admissionNumber: `ADM00${index + 1}`,
            rollNumber: `R00${index + 1}`,
            classId: klass.id,
            guardianId: parent.parentProfile?.id,
          },
        },
      },
      include: { studentProfile: true },
    });
    students.push(student);
  }

  // Attendance for today
  await prisma.attendance.createMany({
    data: students.map((student, index) => ({
      studentId: student.studentProfile!.id,
      classId: klass.id,
      date: startOfToday(),
      status: index === 1 ? 'ABSENT' : 'PRESENT',
      subject: 'Mathematics',
    })),
  });

  // Fees: one paid invoice, one pending
  const term = await prisma.feeStructure.create({
    data: {
      institutionId: institution.id,
      name: 'Tuition — Term 1',
      amount: 12000,
      dueDate: inDays(14),
    },
  });

  await prisma.invoice.create({
    data: {
      studentId: students[0].studentProfile!.id,
      feeStructureId: term.id,
      amount: term.amount,
      status: 'PAID',
      paidAt: new Date(),
    },
  });

  await prisma.invoice.create({
    data: {
      studentId: students[1].studentProfile!.id,
      feeStructureId: term.id,
      amount: term.amount,
      status: 'PENDING',
    },
  });

  // Exam + grades
  const exam = await prisma.exam.create({
    data: {
      institutionId: institution.id,
      title: 'Midterm 2026',
      subject: 'Mathematics',
      date: inDays(-7),
      totalMarks: 100,
    },
  });

  await prisma.grade.createMany({
    data: [
      { examId: exam.id, studentId: students[0].studentProfile!.id, marks: 86, remarks: 'Excellent' },
      { examId: exam.id, studentId: students[1].studentProfile!.id, marks: 72 },
    ],
  });

  // Timetable
  await prisma.timetable.create({
    data: {
      classId: klass.id,
      teacherId: teacher.teacherProfile!.id,
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '10:00',
      subject: 'Mathematics',
      room: '101',
    },
  });

  // Announcement
  await prisma.announcement.create({
    data: {
      institutionId: institution.id,
      creatorId: superAdmin.id,
      title: 'Welcome to the portal',
      content: 'Term 1 fee invoices have been issued. Please review them in the Fees section.',
      targetRole: 'PARENT',
    },
  });

  console.log('Seed data created successfully');
  console.log(`  Institution : ${institution.name} (${institution.code})`);
  console.log(`  Branch      : ${branch.name}`);
  console.log('  Logins      : admin@testschool.com (SUPER_ADMIN)');
  console.log('                branch@testschool.com / teacher@testschool.com / parent@testschool.com');
  console.log('                student1@testschool.com / student2@testschool.com');
  console.log(`  Password    : ${DEMO_PASSWORD}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
