import prisma from '../prisma/client.js';
export type FeeStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE';

export class FeeService {
  static async createFeeStructure(institutionId: string, data: any) {
    return await prisma.feeStructure.create({
      data: {
        institutionId,
        name: data.name,
        amount: data.amount,
        dueDate: new Date(data.dueDate),
      },
    });
  }

  static async getFeeStructures(institutionId: string) {
    return await prisma.feeStructure.findMany({
      where: { institutionId },
    });
  }

  static async createInvoice(studentId: string, feeStructureId: string) {
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
    });
    if (!feeStructure) throw new Error('Fee structure not found');

    return await prisma.invoice.create({
      data: {
        studentId,
        feeStructureId,
        amount: feeStructure.amount,
        status: 'PENDING',
      },
    });
  }

  static async getInvoices(institutionId: string, studentId?: string) {
    const where: any = {
      student: { institutionId },
    };
    if (studentId) where.studentId = studentId;
    return await prisma.invoice.findMany({
      where,
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
        feeStructure: true,
      },
    });
  }

  static async updateInvoiceStatus(invoiceId: string, status: FeeStatus) {
    return await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
        paidAt: status === 'PAID' || status === 'PARTIAL' ? new Date() : null,
      },
    });
  }

  static async getRevenueAnalytics(institutionId: string) {
    const invoices = await prisma.invoice.findMany({
      where: {
        student: { institutionId },
      },
      include: { feeStructure: true },
    });

    const totalCollected = invoices
      .filter((inv: any) => inv.status === 'PAID' || inv.status === 'PARTIAL')
      .reduce((sum: number, inv: any) => sum + inv.amount, 0);

    const totalPending = invoices
      .filter((inv: any) => inv.status === 'PENDING' || inv.status === 'OVERDUE')
      .reduce((sum: number, inv: any) => sum + inv.amount, 0);

    return {
      totalInvoices: invoices.length,
      totalCollected,
      totalPending,
      breakdown: invoices.map((inv: any) => ({
        id: inv.id,
        studentId: inv.studentId,
        status: inv.status,
        amount: inv.amount,
        paidAt: inv.paidAt,
      })),
    };
  }
}
