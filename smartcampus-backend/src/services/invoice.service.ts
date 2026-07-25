import PDFDocument from 'pdfkit';

export interface InvoicePDFData {
  invoiceNumber: string;
  collegeName: string;
  collegeEmail: string;
  planName: string;
  amount: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  date: string;
  dueDate: string;
}

export class InvoiceService {
  public static generateInvoicePDFBuffer(data: InvoicePDFData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk: any) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err: any) => reject(err));

        // Header
        doc.fillColor('#2563EB').fontSize(24).text('SmartCampus SaaS Platform', 50, 45);
        doc.fillColor('#4B5563').fontSize(10).text('Commercial Multi-Tenant College ERP', 50, 75);
        doc.text('https://smartcampus.io | support@smartcampus.io', 50, 90);

        doc.fillColor('#111827').fontSize(20).text('INVOICE', 400, 45, { align: 'right' });
        doc.fontSize(10).text(`Invoice #: ${data.invoiceNumber}`, 400, 70, { align: 'right' });
        doc.text(`Date: ${data.date}`, 400, 85, { align: 'right' });
        doc.text(`Status: ${data.status.toUpperCase()}`, 400, 100, { align: 'right' });

        doc.moveTo(50, 125).lineTo(550, 125).strokeColor('#E5E7EB').stroke();

        // Billed To
        doc.fontSize(12).fillColor('#111827').text('Billed To:', 50, 140);
        doc.fontSize(10).fillColor('#374151').text(data.collegeName, 50, 158);
        doc.text(data.collegeEmail, 50, 172);

        // Table Header
        let y = 220;
        doc.rect(50, y, 500, 25).fill('#F3F4F6');
        doc.fillColor('#111827').fontSize(10).text('Subscription Description', 60, y + 7);
        doc.text('Amount ($)', 450, y + 7, { align: 'right' });

        // Item
        y += 35;
        doc.fillColor('#374151').text(`SmartCampus ${data.planName} Plan Subscription`, 60, y);
        doc.text(`$${data.amount.toFixed(2)}`, 450, y, { align: 'right' });

        // Totals
        y += 40;
        doc.moveTo(50, y).lineTo(550, y).strokeColor('#E5E7EB').stroke();
        
        y += 15;
        doc.text('Subtotal:', 350, y);
        doc.text(`$${data.amount.toFixed(2)}`, 450, y, { align: 'right' });

        y += 18;
        doc.text('Tax:', 350, y);
        doc.text(`$${data.tax.toFixed(2)}`, 450, y, { align: 'right' });

        if (data.discount > 0) {
          y += 18;
          doc.text('Discount:', 350, y);
          doc.text(`-$${data.discount.toFixed(2)}`, 450, y, { align: 'right' });
        }

        y += 22;
        doc.fontSize(12).fillColor('#111827').text('Total Due:', 350, y);
        doc.fontSize(12).fillColor('#2563EB').text(`$${data.total.toFixed(2)}`, 450, y, { align: 'right' });

        // Footer
        doc.fontSize(9).fillColor('#9CA3AF').text('Thank you for subscribing to SmartCampus SaaS Platform.', 50, 700, { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
