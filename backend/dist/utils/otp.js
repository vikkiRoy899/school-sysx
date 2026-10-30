import crypto from 'crypto';
export function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        otp += digits[randomBytes[i] % digits.length];
    }
    return otp;
}
export function generateTempPassword(length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let tempPass = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        tempPass += chars[randomBytes[i] % chars.length];
    }
    return tempPass;
}
//# sourceMappingURL=otp.js.map