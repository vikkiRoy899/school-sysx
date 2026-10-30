import prisma from '../prisma/client.js';
import { generateReportCardPDF } from '../utils/pdf.js';

export class ExamService {
  static async createExam(institutionId: string, data: any) {
    return await prisma.exam.create({
      data: {
        institutionId,
        title: data.title,
        subject: data.subject,
        date: new Date(data.date),
        totalMarks: data.totalMarks,
      },
    });
  }

  static async getExams(institutionId: string) {
    return await prisma.exam.findMany({
      where: { institutionId },
    });
  }

  static async recordGrades(examId: string, institutionId: string, grades: any[]) {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, institutionId },
    });
    if (!exam) throw new Error('Exam not found in institution');

    const operations = grades.map((grade: any) =>
      prisma.grade.upsert({
        where: {
          examId_studentId: {
            examId,
            studentId: grade.studentId,
          },
        },
        update: {
          marks: grade.marks,
          remarks: grade.remarks,
        },
        create: {
          examId,
          studentId: grade.studentId,
          marks: grade.marks,
          remarks: grade.remarks,
        },
      })
    );

    return await prisma.$transaction(operations);
  }

  static async generateReportCard(examId: string, studentId: string, institutionId: string) {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, institutionId },
    });
    if (!exam) throw new Error('Exam not found');

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: { user: true, class: true },
    });
    if (!student) throw new Error('Student not found');

    const grades = await prisma.grade.findMany({
      where: { examId, studentId },
      include: { exam: true },
    });

    const pdfBuffer = await generateReportCardPDF({
      institutionName: 'Institution', // to be populated from institution name
      studentName: student.user.email,
      admissionNumber: student.admissionNumber,
      rollNumber: student.rollNumber || undefined,
      className: student.class?.name || 'Unassigned',
      examTitle: exam.title,
      grades: grades.map((g: any) => ({
        subject: exam.subject,
        marks: g.marks,
        totalMarks: exam.totalMarks,
        remarks: g.remarks || undefined,
      })),
    });

    return pdfBuffer;
  }
}
