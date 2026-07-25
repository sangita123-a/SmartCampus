import { AttendanceMethod, AttendanceStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export interface IBiometricAdapter {
  verifyDeviceSignature?(deviceId: string, signature: string): boolean;
  processBiometricPing(payload: BiometricPayload): Promise<any>;
}

export interface BiometricPayload {
  deviceId: string;
  collegeId: string;
  biometricId: string; // studentId or employeeId
  timestamp: string;
  subjectId?: string;
  status?: AttendanceStatus;
}

export class BiometricAttendanceService implements IBiometricAdapter {
  async processBiometricPing(payload: BiometricPayload) {
    const { collegeId, biometricId, timestamp, subjectId, status = AttendanceStatus.PRESENT } = payload;

    const student = await prisma.student.findFirst({
      where: {
        collegeId,
        OR: [{ studentId: biometricId }, { rollNumber: biometricId }],
      },
    });

    if (!student) {
      throw new AppError(`Biometric ID ${biometricId} not recognized in college ${collegeId}`, 404);
    }

    const attendanceDate = new Date(timestamp || Date.now());
    attendanceDate.setHours(0, 0, 0, 0);

    const targetSubjectId = subjectId || student.courseId; // Fallback or assigned subject

    return prisma.attendance.upsert({
      where: {
        studentId_subjectId_attendanceDate: {
          studentId: student.id,
          subjectId: targetSubjectId,
          attendanceDate,
        },
      },
      create: {
        collegeId: student.collegeId,
        departmentId: student.departmentId,
        courseId: student.courseId,
        semesterId: student.semesterId,
        subjectId: targetSubjectId,
        facultyId: student.departmentId, // linked department context
        studentId: student.id,
        attendanceDate,
        attendanceStatus: status,
        attendanceMethod: AttendanceMethod.BIOMETRIC,
        remarks: `Biometric log from device ${payload.deviceId}`,
      },
      update: {
        attendanceStatus: status,
        attendanceMethod: AttendanceMethod.BIOMETRIC,
        remarks: `Updated via Biometric log device ${payload.deviceId}`,
      },
    });
  }
}

export const biometricAttendanceService = new BiometricAttendanceService();
