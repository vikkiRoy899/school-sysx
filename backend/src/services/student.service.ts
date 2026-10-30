import prisma from '../prisma/client.js';
import { StudentQRData } from '../utils/qr.js';

export class StudentService {
  static async getStudents(institutionId: string, branchId: string | null, role: string) {
    const where: any = { institutionId };
    if (role === 'BRANCH_ADMIN' && branchId) {
      where.branchId = branchId;
    }
    return await prisma.user.findMany({
      where: { ...where, role: 'STUDENT' },
      include: {
        studentProfile: {
          include: {
            class: true,
            guardian: true,
          },
        },
      },
    });
  }

  static async createStudent(institutionId: string, branchId: string, data: any) {
    return await prisma.user.create({
      data: {
        institutionId,
        branchId,
        email: data.email,
        phone: data.phone,
        passwordHash: data.passwordHash,
        role: 'STUDENT',
        studentProfile: {
          create: {
            admissionNumber: data.admissionNumber,
            rollNumber: data.rollNumber,
            classId: data.classId,
            otPasswordTemp: data.otPasswordTemp,
          },
        },
      },
      include: { studentProfile: true },
    });
  }

  static async getStudentById(studentId: string, institutionId: string) {
    const user = await prisma.user.findFirst({
      where: { id: studentId, institutionId, role: 'STUDENT' },
      include: {
        studentProfile: {
          include: {
            class: true,
            guardian: true,
            attendance: true,
            grades: { include: { exam: true } },
            invoices: { include: { feeStructure: true } },
          },
        },
      },
    });
    return user;
  }

  static async updateStudent(studentId: string, institutionId: string, data: any) {
    const user = await prisma.user.update({
      where: { id: studentId, institutionId },
      data: {
        phone: data.phone,
        studentProfile: {
          update: {
            rollNumber: data.rollNumber,
            classId: data.classId,
          },
        },
      },
      include: { studentProfile: true },
    });
    return user;
  }

  static async deleteStudent(studentId: string, institutionId: string) {
    return await prisma.user.delete({
      where: { id: studentId, institutionId },
    });
  }

  static async generateQRData(student: any): Promise<StudentQRData> {
    return {
      admissionNumber: student.studentProfile.admissionNumber,
      studentId: student.id,
      institutionId: student.institutionId,
      fullName: student.email, // or actual name if added
      className: student.studentProfile.class?.name,
    };
  }
}
