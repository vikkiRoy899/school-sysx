import { AttendanceService } from '../services/attendance.service.js';
import { markAttendanceSchema } from '../validators/index.js';
export class AttendanceController {
    static async markAttendance(req, res, next) {
        try {
            const validated = markAttendanceSchema.parse(req.body);
            const result = await AttendanceService.markAttendance(req.user.institutionId, req.user.branchId || '', validated);
            res.status(200).json({ message: 'Attendance recorded successfully', records: result });
        }
        catch (err) {
            next(err);
        }
    }
    static async getAttendanceByClass(req, res, next) {
        try {
            const { classId, date } = req.query;
            if (!classId || !date) {
                return res.status(400).json({ error: 'classId and date queries are required' });
            }
            const attendance = await AttendanceService.getAttendanceByClass(classId, date, req.user.institutionId);
            res.json(attendance);
        }
        catch (err) {
            next(err);
        }
    }
    static async getStudentAttendance(req, res, next) {
        try {
            const studentId = req.params.studentId || req.user.userId;
            const attendance = await AttendanceService.getStudentAttendance(studentId, req.user.institutionId);
            res.json(attendance);
        }
        catch (err) {
            next(err);
        }
    }
}
//# sourceMappingURL=attendance.controller.js.map