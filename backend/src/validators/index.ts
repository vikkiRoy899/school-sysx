import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createStudentSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  admissionNumber: z.string().min(1),
  rollNumber: z.string().optional(),
  classId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8),
});

export const markAttendanceSchema = z.object({
  classId: z.string().uuid(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
  subject: z.string().optional(),
  records: z.array(
    z.object({
      studentId: z.string().uuid(),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
      remarks: z.string().optional(),
    })
  ),
});

export const createFeeStructureSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid due date' }),
});

export const createExamSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  totalMarks: z.number().positive(),
});

export const recordGradesSchema = z.object({
  examId: z.string().uuid(),
  grades: z.array(
    z.object({
      studentId: z.string().uuid(),
      marks: z.number().min(0),
      remarks: z.string().optional(),
    })
  ),
});

export const createTimetableSchema = z.object({
  classId: z.string().uuid(),
  teacherId: z.string().uuid(),
  dayOfWeek: z.number().min(1).max(7),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  subject: z.string().min(1),
  room: z.string().optional(),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  targetRole: z.enum(['SUPER_ADMIN', 'BRANCH_ADMIN', 'TEACHER', 'PARENT', 'STUDENT']).optional(),
});

export const sendMessageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1),
});
