import { StudentService } from '../services/student.service.js';
import { generateStudentQRCode } from '../utils/qr.js';
export class StudentController {
    static async getStudents(req, res, next) {
        try {
            const students = await StudentService.getStudents(req.user.institutionId, req.user.branchId, req.user.role);
            res.json(students);
        }
        catch (err) {
            next(err);
        }
    }
    static async getStudentById(req, res, next) {
        try {
            const student = await StudentService.getStudentById(req.params.id, req.user.institutionId);
            if (!student)
                return res.status(404).json({ error: 'Student not found' });
            res.json(student);
        }
        catch (err) {
            next(err);
        }
    }
    static async getStudentIDCard(req, res, next) {
        try {
            const student = await StudentService.getStudentById(req.params.id, req.user.institutionId);
            if (!student || !student.studentProfile) {
                return res.status(404).json({ error: 'Student profile not found' });
            }
            const qrPayload = await StudentService.generateQRData(student);
            const qrCodeDataUrl = await generateStudentQRCode(qrPayload);
            res.json({
                idCard: {
                    institutionId: student.institutionId,
                    studentId: student.id,
                    email: student.email,
                    admissionNumber: student.studentProfile.admissionNumber,
                    rollNumber: student.studentProfile.rollNumber,
                    className: student.studentProfile.class?.name || 'Unassigned',
                    qrCodeDataUrl,
                },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
//# sourceMappingURL=student.controller.js.map