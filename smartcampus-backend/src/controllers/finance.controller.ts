import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { feeCategoryService } from '../services/feeCategory.service';
import { feeStructureService } from '../services/feeStructure.service';
import { studentFeeService } from '../services/studentFee.service';
import { paymentService } from '../services/payment.service';
import { financeDashboardService } from '../services/financeDashboard.service';

export class FinanceController {
  // Fee Categories
  listCategories = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const result = await feeCategoryService.listCategories(collegeId, req.query);
    res.json({ success: true, ...result });
  });

  getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await feeCategoryService.getCategoryById(req.params.id, collegeId);
    res.json({ success: true, data });
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.collegeId || req.body.collegeId;
    const data = await feeCategoryService.createCategory(collegeId, req.body);
    res.status(201).json({ success: true, data });
  });

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await feeCategoryService.updateCategory(req.params.id, collegeId, req.body);
    res.json({ success: true, data });
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    await feeCategoryService.deleteCategory(req.params.id, collegeId);
    res.json({ success: true, message: 'Fee category deleted successfully' });
  });

  // Fee Structures
  listStructures = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const result = await feeStructureService.listStructures(collegeId, req.query);
    res.json({ success: true, ...result });
  });

  getStructureById = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await feeStructureService.getStructureById(req.params.id, collegeId);
    res.json({ success: true, data });
  });

  createStructure = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.collegeId || req.body.collegeId;
    const data = await feeStructureService.createStructure(collegeId, req.body);
    res.status(201).json({ success: true, data });
  });

  updateStructure = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await feeStructureService.updateStructure(req.params.id, collegeId, req.body);
    res.json({ success: true, data });
  });

  deleteStructure = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    await feeStructureService.deleteStructure(req.params.id, collegeId);
    res.json({ success: true, message: 'Fee structure deleted successfully' });
  });

  // Student Fees
  generateFees = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.collegeId || req.body.collegeId;
    const result = await studentFeeService.generateSemesterFees(collegeId, req.body.feeStructureId);
    res.status(201).json({ success: true, ...result });
  });

  listStudentFees = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const result = await studentFeeService.listStudentFees(collegeId, req.query);
    res.json({ success: true, ...result });
  });

  getStudentFeeById = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await studentFeeService.getStudentFeeById(req.params.id, collegeId);
    res.json({ success: true, data });
  });

  getStudentLedger = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await studentFeeService.getStudentLedger(req.params.studentId, collegeId);
    res.json({ success: true, data });
  });

  // Payments & Receipts
  collectPayment = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await paymentService.collectPayment(collegeId, req.body);
    res.status(201).json({ success: true, data });
  });

  listPayments = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const result = await paymentService.listPayments(collegeId, req.query);
    res.json({ success: true, ...result });
  });

  getPaymentById = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await paymentService.getPaymentById(req.params.id, collegeId);
    res.json({ success: true, data });
  });

  // Dashboard & Reports
  getDashboardCards = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await financeDashboardService.getDashboardCards(collegeId);
    res.json({ success: true, data });
  });

  getCollectionReports = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const collegeId = user?.role === 'SUPER_ADMIN' ? null : user?.collegeId || null;
    const data = await financeDashboardService.getCollectionReports(collegeId);
    res.json({ success: true, data });
  });
}

export const financeController = new FinanceController();
