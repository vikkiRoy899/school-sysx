import QRCode from 'qrcode';
export async function generateStudentQRCode(data) {
    const payload = JSON.stringify(data);
    return await QRCode.toDataURL(payload, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 200,
        color: { dark: '#000000', light: '#ffffff' },
    });
}
export async function generateQRCodeBuffer(data) {
    const payload = JSON.stringify(data);
    return await QRCode.toBuffer(payload, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 200,
        color: { dark: '#000000', light: '#ffffff' },
    });
}
//# sourceMappingURL=qr.js.map