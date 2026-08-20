import JSbarcode from 'jsbarcode';

export function generateBarcode(value: string): string {
  const canvas = document.createElement('canvas');
  JSbarcode(canvas, value, {
    format: 'CODE128',
    width: 2,
    height: 50,
    displayValue: true,
  });
  return canvas.toDataURL('image/png');
}

export function generateQRCode(text: string): string {
  // QR generation handled by react-qr-code component
  return text;
}
