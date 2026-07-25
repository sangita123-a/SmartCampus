import { Request, Response } from 'express';
import { TenantRequest } from '../middlewares/tenant.middleware';
import { attendanceService } from '../services/attendance.service';
import { qrAttendanceService } from '../services/qrAttendance.service';
import { biometricAttendanceService } from '../services/biometricAttendance.service';
import { asyncHandler } from '../utils/asyncHandler';

export class AttendanceController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const result = await attendanceService.listAttendance(tenantReq.tenantId || null, req.query as any);

    res.status(200).json({
      success: true,
      message: 'Attendance records fetched successfully',
      data: result.attendance,
      meta: result.meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const record = await attendanceService.getAttendanceById(req.params.id, tenantReq.tenantId || null);

    res.status(200).json({
      success: true,
      message: 'Attendance record details fetched successfully',
      data: record,
    });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const record = await attendanceService.createAttendance(tenantReq.tenantId || req.body.collegeId, req.body);

    res.status(201).json({
      success: true,
      message: 'Attendance record created successfully',
      data: record,
    });
  });

  bulkMark = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const result = await attendanceService.bulkMarkAttendance(tenantReq.tenantId || req.body.collegeId, req.body);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const record = await attendanceService.updateAttendance(req.params.id, tenantReq.tenantId || null, req.body);

    res.status(200).json({
      success: true,
      message: 'Attendance record updated successfully',
      data: record,
    });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    await attendanceService.deleteAttendance(req.params.id, tenantReq.tenantId || null);

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully',
    });
  });

  dashboard = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const cards = await attendanceService.getDashboardCards(tenantReq.tenantId || null);

    res.status(200).json({
      success: true,
      message: 'Attendance dashboard cards fetched successfully',
      data: cards,
    });
  });

  getStudentPercentage = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const studentId = (req.query.studentId as string) || req.params.studentId;
    const result = await attendanceService.getStudentPercentage(studentId, tenantReq.tenantId || null);

    res.status(200).json({
      success: true,
      message: 'Student attendance percentage fetched successfully',
      data: result,
    });
  });

  getFacultySummary = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const facultyId = (req.query.facultyId as string) || req.params.facultyId;
    const result = await attendanceService.getFacultySummary(facultyId, tenantReq.tenantId || null);

    res.status(200).json({
      success: true,
      message: 'Faculty attendance summary fetched successfully',
      data: result,
    });
  });

  createQRSession = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const session = await qrAttendanceService.createSession(
      req.body.facultyId,
      tenantReq.tenantId || req.body.collegeId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: 'QR Code attendance session generated successfully',
      data: session,
    });
  });

  scanQRAttendance = asyncHandler(async (req: Request, res: Response) => {
    const tenantReq = req as TenantRequest;
    const record = await qrAttendanceService.scanSession(
      req.body.sessionCode,
      req.body.studentId,
      tenantReq.tenantId || null
    );

    res.status(200).json({
      success: true,
      message: 'Attendance scanned & recorded successfully via QR code',
      data: record,
    });
  });

  biometricPing = asyncHandler(async (req: Request, res: Response) => {
    const record = await biometricAttendanceService.processBiometricPing(req.body);

    res.status(200).json({
      success: true,
      message: 'Biometric ping processed successfully',
      data: record,
    });
  });
}

export const attendanceController = new AttendanceController();
