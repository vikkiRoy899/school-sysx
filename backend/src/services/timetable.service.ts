import prisma from '../prisma/client.js';

export class TimetableService {
  static async createSchedule(data: {
    classId: string;
    teacherId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    subject: string;
    room?: string;
  }) {
    // Conflict detection: teacher busy on same day and overlapping time
    const teacherConflicts = await prisma.timetable.findMany({
      where: {
        teacherId: data.teacherId,
        dayOfWeek: data.dayOfWeek,
        OR: [
          {
            startTime: { lte: data.startTime },
            endTime: { gt: data.startTime },
          },
          {
            startTime: { lt: data.endTime },
            endTime: { gte: data.endTime },
          },
        ],
      },
    });

    if (teacherConflicts.length > 0) {
      throw new Error('Teacher schedule conflict detected for specified time and day');
    }

    // Room conflict detection if room is provided
    if (data.room) {
      const roomConflicts = await prisma.timetable.findMany({
        where: {
          room: data.room,
          dayOfWeek: data.dayOfWeek,
          OR: [
            {
              startTime: { lte: data.startTime },
              endTime: { gt: data.startTime },
            },
            {
              startTime: { lt: data.endTime },
              endTime: { gte: data.endTime },
            },
          ],
        },
      });

      if (roomConflicts.length > 0) {
        throw new Error('Room allocation conflict detected for specified time and day');
      }
    }

    return await prisma.timetable.create({
      data: {
        classId: data.classId,
        teacherId: data.teacherId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        subject: data.subject,
        room: data.room,
      },
    });
  }

  static async getTimetableByClass(classId: string) {
    return await prisma.timetable.findMany({
      where: { classId },
      include: {
        teacher: { include: { user: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  static async getTimetableByTeacher(teacherId: string) {
    return await prisma.timetable.findMany({
      where: { teacherId },
      include: { class: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }
}
