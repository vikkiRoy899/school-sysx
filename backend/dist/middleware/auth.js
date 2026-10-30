import { jwtVerify } from 'jose';
import { config } from '../config/index.js';
export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }
    try {
        const secret = new TextEncoder().encode(config.jwtSecret);
        const { payload } = await jwtVerify(token, secret);
        req.user = {
            userId: payload.sub,
            institutionId: payload.institutionId,
            branchId: payload.branchId || null,
            role: payload.role,
        };
        next();
    }
    catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}
export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions for this operation' });
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map