import crypto from 'crypto';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { AttendanceMethod, AttendanceStatus } from '@prisma/client';

export class QRAttendanceService {
  /**
   * Faculty generates a dynamic QR Code session for a specific class slot.
   */
  async createSession(facultyId: string, collegeId: string, data: any) {
    const { departmentId, courseId, semesterId, subjectId, durationMinutes = 15 } = data;

    const sessionCode = crypto.randomBytes(6).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    // Deactivate previous active sessions for this subject
    await prisma.qRAttendanceSession.updateMany({
      where: { subjectId, collegeId, isActive: true },
      data: { isActive: false },
    });

    const session = await prisma.qRAttendanceSession.create({
      data: {
        collegeId,
        departmentId,
        courseId,
        semesterId,
        subjectId,
        facultyId,
        sessionCode,
        expiresAt,
        isActive: true,
      },
    });

    return session;
  }

  /**
   * Student scans the QR Code session to mark attendance.
   */
  async scanSession(sessionCode: string, studentId: string, collegeId: string | null) {
    const session = await prisma.qRAttendanceSession.findUnique({
      where: { sessionCode },
    });

    if (!session || !session.isActive) {
      throw new AppError('Invalid or expired QR Attendance Session', 400);
    }

    if (new Date() > session.expiresAt) {
      await prisma.qRAttendanceSession.update({
        where: { id: session.id },
        data: { isActive: false },
      });
      throw new AppError('This QR Attendance Session has expired', 400);
    }

    if (collegeId && session.collegeId !== collegeId) {
      throw new AppError('QR Session belongs to another college', 403);
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new AppError('Student profile not found', 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert student attendance record with QR_CODE method
    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_subjectId_attendanceDate: {
          studentId,
          subjectId: session.subjectId,
          attendanceDate: today,
        },
      },
      create: {
        collegeId: session.collegeId,
        departmentId: session.departmentId,
        courseId: session.courseId,
        semesterId: session.semesterId,
        subjectId: session.subjectId,
        facultyId: session.facultyId,
        studentId,
        attendanceDate: today,
        attendanceStatus: AttendanceStatus.PRESENT,
        attendanceMethod: AttendanceMethod.QR_CODE,
        remarks: 'Scanned via QR Code',
      },
      update: {
        attendanceStatus: AttendanceStatus.PRESENT,
        attendanceMethod: AttendanceMethod.QR_CODE,
        remarks: 'Updated via QR Code scan',
      },
      include: {
        student: { select: { firstName: true, lastName: true, rollNumber: true } },
        subject: { select: { subjectName: true, subjectCode: true } },
      },
    });

    return attendance;
  }
}

export const qrAttendanceService = new QRAttendanceService();
