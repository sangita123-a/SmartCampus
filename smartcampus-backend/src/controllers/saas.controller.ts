import { Request, Response, NextFunction } from 'express';
import { SaasService } from '../services/saas.service';
import { PaymentService } from '../services/payment.service';
import { InvoiceService } from '../services/invoice.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SaasController {
  // Public Plans
  public static async getPlans(_req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await SaasService.getPlans();
      res.json({ success: true, data: plans });
    } catch (error) {
      next(error);
    }
  }

  // Validate Coupon
  public static async validateCoupon(req: Request, res: Response, _next: NextFunction) {
    try {
      const { code, amount } = req.query;
      if (!code) {
        res.status(400).json({ success: false, message: 'Coupon code is required' });
        return;
      }
      const result = await SaasService.validateCoupon(String(code), Number(amount || 199));
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Invalid coupon' });
    }
  }

  // College Onboarding & Tenant Provisioning
  public static async registerCollege(req: Request, res: Response, _next: NextFunction) {
    try {
      const result = await SaasService.registerAndProvisionTenant(req.body);
      res.status(201).json({
        success: true,
        message: 'College registered and tenant provisioned successfully!',
        data: {
          collegeId: result.college.id,
          collegeName: result.college.name,
          collegeCode: result.college.code,
          adminEmail: result.adminUser.email,
          invoiceNumber: result.invoice.invoiceNumber,
          total: result.invoice.total
        }
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Registration failed' });
    }
  }

  // Create Payment Checkout Intent/Order
  public static async createPaymentOrder(req: Request, res: Response, _next: NextFunction) {
    try {
      const { amount, currency, provider, receipt } = req.body;
      const adapter = PaymentService.getAdapter(provider || 'razorpay');
      const order = await adapter.createOrder({
        amount: Number(amount),
        currency: currency || 'USD',
        receipt: receipt || `receipt_${Date.now()}`
      });
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Verify Payment & Update Invoice/Subscription
  public static async verifyPayment(req: Request, res: Response, _next: NextFunction) {
    try {
      const { provider, payload, invoiceId } = req.body;
      const adapter = PaymentService.getAdapter(provider || 'razorpay');
      const verification = await adapter.verifyPayment(payload);

      if (verification.success && invoiceId) {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            paymentId: verification.transactionId
          }
        });
      }

      res.json({ success: true, data: verification });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Download Invoice PDF
  public static async downloadInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { invoiceId } = req.params;
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { college: true, subscription: true }
      });

      if (!invoice) {
        res.status(404).json({ success: false, message: 'Invoice not found' });
        return;
      }

      const pdfBuffer = await InvoiceService.generateInvoicePDFBuffer({
        invoiceNumber: invoice.invoiceNumber,
        collegeName: invoice.college.name,
        collegeEmail: invoice.college.email,
        planName: invoice.subscription?.planName || 'SmartCampus Subscription',
        amount: Number(invoice.amount),
        tax: Number(invoice.tax),
        discount: Number(invoice.discount),
        total: Number(invoice.total),
        status: invoice.status,
        date: invoice.createdAt.toISOString().split('T')[0],
        dueDate: invoice.dueDate.toISOString().split('T')[0]
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Invoice-${invoice.invoiceNumber}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  // Blog Endpoints
  public static async getBlogPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, search } = req.query;
      const posts = await SaasService.getBlogPosts(category as string, search as string);
      res.json({ success: true, data: posts });
    } catch (error) {
      next(error);
    }
  }

  public static async getBlogPostBySlug(req: Request, res: Response, _next: NextFunction) {
    try {
      const { slug } = req.params;
      const post = await SaasService.getBlogPostBySlug(slug);
      res.json({ success: true, data: post });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  // Contact Form Submission
  public static async submitContact(req: Request, res: Response, _next: NextFunction) {
    try {
      const submission = await SaasService.submitContact(req.body);
      res.status(201).json({
        success: true,
        message: 'Thank you! Your inquiry has been received. Our SaaS team will contact you shortly.',
        data: submission
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Submission failed' });
    }
  }
}
