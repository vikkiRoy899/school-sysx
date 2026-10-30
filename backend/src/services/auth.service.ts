import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import prisma from '../prisma/client.js';
import { config } from '../config/index.js';
import { generateOTP, generateTempPassword } from '../utils/otp.js';

export class AuthService {
  static async login(email: string, pass: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        institution: true,
        studentProfile: true,
        teacherProfile: true,
        parentProfile: true,
      },
    });

    if (!user || !user.isActive) {
      throw new Error('Invalid email or inactive user account');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const secret = new TextEncoder().encode(config.jwtSecret);
    const token = await new SignJWT({
      sub: user.id,
      institutionId: user.institutionId,
      branchId: user.branchId,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(config.jwtExpiresIn)
      .sign(secret);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        institutionId: user.institutionId,
        institutionName: user.institution.name,
        mustChangePassword: user.mustChangePassword,
        profile: user.studentProfile || user.teacherProfile || user.parentProfile,
      },
    };
  }

  static async generateStudentAccount(
    institutionId: string,
    branchId: string | null,
    data: {
      email: string;
      phone?: string;
      admissionNumber: string;
      rollNumber?: string;
      classId?: string;
    }
  ) {
    const otpSecret = generateOTP(6);
    const tempPassword = generateTempPassword(8);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        institutionId,
        branchId,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: 'STUDENT',
        otpSecret,
        mustChangePassword: true,
        studentProfile: {
          create: {
            admissionNumber: data.admissionNumber,
            rollNumber: data.rollNumber,
            classId: data.classId,
            otPasswordTemp: tempPassword,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    return {
      userId: user.id,
      email: user.email,
      otpSecret,
      tempPassword,
      admissionNumber: user.studentProfile?.admissionNumber,
    };
  }

  static async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) throw new Error('Current password does not match');

    const newHash = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
      },
    });

    return { success: true };
  }
}
