import { Router } from 'express';
import { SaasController } from '../controllers/saas.controller';

const router = Router();

// Public Plans & Pricing
router.get('/plans', SaasController.getPlans);
router.get('/coupons/validate', SaasController.validateCoupon);

// College Self-Registration & Tenant Provisioning
router.post('/register', SaasController.registerCollege);

// Payment Gateway Adapters & Invoicing
router.post('/payment/create-order', SaasController.createPaymentOrder);
router.post('/payment/verify', SaasController.verifyPayment);
router.get('/invoices/:invoiceId/download', SaasController.downloadInvoice);

// Blog & CMS
router.get('/blog', SaasController.getBlogPosts);
router.get('/blog/:slug', SaasController.getBlogPostBySlug);

// Contact & Demo Form Submissions
router.post('/contact', SaasController.submitContact);

export default router;
