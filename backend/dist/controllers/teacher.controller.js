import { TeacherService } from '../services/teacher.service.js';
export class TeacherController {
    static async getTeachers(req, res, next) {
        try {
            const teachers = await TeacherService.getTeachers(req.user.institutionId, req.user.branchId, req.user.role);
            res.json(teachers);
        }
        catch (err) {
            next(err);
        }
    }
    static async getTeacherById(req, res, next) {
        try {
            const teacher = await TeacherService.getTeacherById(req.params.id, req.user.institutionId);
            if (!teacher)
                return res.status(404).json({ error: 'Teacher not found' });
            res.json(teacher);
        }
        catch (err) {
            next(err);
        }
    }
}
//# sourceMappingURL=teacher.controller.js.map