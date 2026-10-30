export type FeeStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE';
export declare class FeeService {
    static createFeeStructure(institutionId: string, data: any): Promise<any>;
    static getFeeStructures(institutionId: string): Promise<any>;
    static createInvoice(studentId: string, feeStructureId: string): Promise<any>;
    static getInvoices(institutionId: string, studentId?: string): Promise<any>;
    static updateInvoiceStatus(invoiceId: string, status: FeeStatus): Promise<any>;
    static getRevenueAnalytics(institutionId: string): Promise<{
        totalInvoices: any;
        totalCollected: any;
        totalPending: any;
        breakdown: any;
    }>;
}
//# sourceMappingURL=fee.service.d.ts.map