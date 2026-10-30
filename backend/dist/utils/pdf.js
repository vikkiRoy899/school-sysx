import PDFDocument from 'pdfkit';
import { Buffer } from 'node:buffer';
export function generateReportCardPDF(data) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));
        // Header
        doc.fontSize(20).text(data.institutionName, { align: 'center' });
        doc.fontSize(14).text(`Academic Report Card - ${data.examTitle}`, { align: 'center' });
        doc.moveDown();
        // Student Info
        doc.fontSize(10);
        doc.text(`Student Name: ${data.studentName}`);
        doc.text(`Admission No: ${data.admissionNumber}`);
        if (data.rollNumber)
            doc.text(`Roll No: ${data.rollNumber}`);
        doc.text(`Class: ${data.className}`);
        doc.moveDown();
        // Table Header
        doc.fontSize(11).text('Subject', 50, doc.y, { continued: true });
        doc.text('Marks Obtained', 250, doc.y, { continued: true });
        doc.text('Max Marks', 380, doc.y, { continued: true });
        doc.text('Remarks', 480, doc.y);
        doc.moveDown(0.5);
        doc.lineBetween(50, doc.y, 550, doc.y);
        doc.moveDown(0.5);
        // Table Rows
        let grandTotal = 0;
        let grandMax = 0;
        data.grades.forEach((item) => {
            grandTotal += item.marks;
            grandMax += item.totalMarks;
            doc.text(item.subject, 50, doc.y, { continued: true });
            doc.text(item.marks.toString(), 250, doc.y, { continued: true });
            doc.text(item.totalMarks.toString(), 380, doc.y, { continued: true });
            doc.text(item.remarks || '-', 480, doc.y);
            doc.moveDown(0.3);
        });
        doc.moveDown(0.5);
        doc.lineBetween(50, doc.y, 550, doc.y);
        doc.moveDown(0.5);
        // Summary
        const percentage = grandMax > 0 ? ((grandTotal / grandMax) * 100).toFixed(2) : '0';
        doc.fontSize(11).text(`Grand Total: ${grandTotal} / ${grandMax} (${percentage}%)`, { align: 'right' });
        doc.end();
    });
}
//# sourceMappingURL=pdf.js.map