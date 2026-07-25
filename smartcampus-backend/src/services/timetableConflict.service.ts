import { DayOfWeek, PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

export interface ConflictCheckParams {
  collegeId: string;
  facultyId: string;
  classroomId: string;
  courseId: string;
  semesterId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  excludeTimetableId?: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictType?: 'FACULTY' | 'CLASSROOM' | 'SECTION' | 'OVERLAP';
  reason?: string;
}

export class TimetableConflictService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Checks for schedule conflicts across Faculty, Classroom, and Section.
   * Throws an AppError with 400 if a conflict is detected.
   */
  public async validateNoConflict(params: ConflictCheckParams): Promise<void> {
    const result = await this.checkConflict(params);
    if (result.hasConflict) {
      throw new AppError(`Timetable Conflict Detected: ${result.reason}`, 400);
    }
  }

  /**
   * Internal conflict calculation logic.
   */
  public async checkConflict(params: ConflictCheckParams): Promise<ConflictCheckResult> {
    const {
      collegeId,
      facultyId,
      classroomId,
      semesterId,
      dayOfWeek,
      startTime,
      endTime,
      excludeTimetableId,
    } = params;

    // Fetch active timetable slots for the same college and day
    const existingSlots = await this.prisma.timetable.findMany({
      where: {
        collegeId,
        dayOfWeek,
        status: 'ACTIVE',
        id: excludeTimetableId ? { not: excludeTimetableId } : undefined,
      },
      include: {
        faculty: true,
        classroom: true,
        subject: true,
        semester: true,
      },
    });

    for (const slot of existingSlots) {
      const isTimeOverlapping = this.isTimeOverlap(
        startTime,
        endTime,
        slot.startTime,
        slot.endTime
      );

      if (!isTimeOverlapping) continue;

      // 1. Check Faculty Conflict
      if (slot.facultyId === facultyId) {
        return {
          hasConflict: true,
          conflictType: 'FACULTY',
          reason: `Faculty ${slot.faculty.firstName} ${slot.faculty.lastName} is already assigned to ${slot.subject.subjectName} in Room ${slot.classroom.roomNumber} from ${slot.startTime} to ${slot.endTime} on ${dayOfWeek}.`,
        };
      }

      // 2. Check Classroom Conflict
      if (slot.classroomId === classroomId) {
        return {
          hasConflict: true,
          conflictType: 'CLASSROOM',
          reason: `Classroom ${slot.classroom.roomNumber} (${slot.classroom.roomName}) is already occupied by ${slot.subject.subjectName} from ${slot.startTime} to ${slot.endTime} on ${dayOfWeek}.`,
        };
      }

      // 3. Check Section / Semester Conflict
      if (slot.semesterId === semesterId) {
        return {
          hasConflict: true,
          conflictType: 'SECTION',
          reason: `Students in ${slot.semester.name} already have ${slot.subject.subjectName} scheduled from ${slot.startTime} to ${slot.endTime} on ${dayOfWeek}.`,
        };
      }
    }

    return { hasConflict: false };
  }

  /**
   * Determines if two time intervals [startA, endA) and [startB, endB) overlap.
   */
  private isTimeOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
    return startA < endB && endA > startB;
  }
}
