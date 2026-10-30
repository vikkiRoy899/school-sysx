import { ParentService } from '../services/parent.service.js';
export class ParentController {
    static async getParents(req, res, next) {
        try {
            const parents = await ParentService.getParents(req.user.institutionId);
            res.json(parents);
        }
        catch (err) {
            next(err);
        }
    }
    static async linkStudent(req, res, next) {
        try {
            const { parentUserId, studentProfileId } = req.body;
            const result = await ParentService.linkStudentToParent(parentUserId, studentProfileId, req.user.institutionId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    }
}
//# sourceMappingURL=parent.controller.js.map