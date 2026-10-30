import prisma from '../prisma/client.js';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export class AttendanceService {
  static async markAttendance(
    institutionId: string,
    branchId: string,
    data: {
      classId: string;
      date: string;
      subject?: string;
      records: Array<{ studentId: string; status: AttendanceStatus; remarks?: string }>;
    }
  ) {
    const dateObj = new Date(data.date);
    dateObj.setHours(0, 0, 0, 0);

    const operations = data.records.map((record) =>
      prisma.attendance.upsert({
        where: {
          studentId_date_subject: {
            studentId: record.studentId,
            date: dateObj,
            subject: data.subject || '',
          },
        },
        update: {
          status: record.status,
          remarks: record.remarks,
          classId: data.classId,
        },
        create: {
          studentId: record.studentId,
          classId: data.classId,
          date: dateObj,
          subject: data.subject,
          status: record.status,
          remarks: record.remarks,
        },
      })
    );

    const result = await prisma.$transaction(operations);

    // Automated absence alert trigger
    const absentRecords = data.records.filter(
      (r) => r.status === 'ABSENT' || r.status === 'LATE'
    );
    for (const record of absentRecords) {
      const student = await prisma.studentProfile.findUnique({
        where: { id: record.studentId },
        include: { guardian: { include: { user: true } } },
      });
      if (student?.guardian?.user) {
        const alertMsg = `Alert: Student ${student.admissionNumber} is marked ${record.status.toLowerCase()} on ${data.date}.`;
        await prisma.message.create({
          data: {
            senderId: institutionId, // system sender fallback
            receiverId: student.guardian.user.id,
            content: alertMsg,
          },
        });
      }
    }

    return result;
  }

  static async getAttendanceByClass(classId: string, date: string, institutionId: string) {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    return await prisma.attendance.findMany({
      where: { classId, date: dateObj },
      include: {
        student: {
          include: { user: true },
        },
      },
    });
  }

  static async getStudentAttendance(studentId: string, institutionId: string) {
    return await prisma.attendance.findMany({
      where: { studentId },
      include: { class: true },
    });
  }
}
