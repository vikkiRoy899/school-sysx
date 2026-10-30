import prisma from '../prisma/client.js';
export class FeeService {
    static async createFeeStructure(institutionId, data) {
        return await prisma.feeStructure.create({
            data: {
                institutionId,
                name: data.name,
                amount: data.amount,
                dueDate: new Date(data.dueDate),
            },
        });
    }
    static async getFeeStructures(institutionId) {
        return await prisma.feeStructure.findMany({
            where: { institutionId },
        });
    }
    static async createInvoice(studentId, feeStructureId) {
        const feeStructure = await prisma.feeStructure.findUnique({
            where: { id: feeStructureId },
        });
        if (!feeStructure)
            throw new Error('Fee structure not found');
        return await prisma.invoice.create({
            data: {
                studentId,
                feeStructureId,
                amount: feeStructure.amount,
                status: 'PENDING',
            },
        });
    }
    static async getInvoices(institutionId, studentId) {
        const where = {
            student: { institutionId },
        };
        if (studentId)
            where.studentId = studentId;
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
    static async updateInvoiceStatus(invoiceId, status) {
        return await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                status,
                paidAt: status === 'PAID' || status === 'PARTIAL' ? new Date() : null,
            },
        });
    }
    static async getRevenueAnalytics(institutionId) {
        const invoices = await prisma.invoice.findMany({
            where: {
                student: { institutionId },
            },
            include: { feeStructure: true },
        });
        const totalCollected = invoices
            .filter((inv) => inv.status === 'PAID' || inv.status === 'PARTIAL')
            .reduce((sum, inv) => sum + inv.amount, 0);
        const totalPending = invoices
            .filter((inv) => inv.status === 'PENDING' || inv.status === 'OVERDUE')
            .reduce((sum, inv) => sum + inv.amount, 0);
        return {
            totalInvoices: invoices.length,
            totalCollected,
            totalPending,
            breakdown: invoices.map((inv) => ({
                id: inv.id,
                studentId: inv.studentId,
                status: inv.status,
                amount: inv.amount,
                paidAt: inv.paidAt,
            })),
        };
    }
}
//# sourceMappingURL=fee.service.js.map