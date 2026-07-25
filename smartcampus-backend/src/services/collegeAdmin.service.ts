import { FacultyStatus, StudentStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { AuthUserPayload } from '../types/express';
import { Role as AppRole } from '../types/roles';

export interface CollegeAdminDashboardStats {
  totalDepartments: number;
  totalCourses: number;
  totalSemesters: number;
  activeStudents: number;
  activeFaculty: number;
  college: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export class CollegeAdminService {
  public async getDashboardStats(
    actor: AuthUserPayload
  ): Promise<CollegeAdminDashboardStats> {
    const collegeId = this.resolveCollegeId(actor);

    const [
      totalDepartments,
      totalCourses,
      totalSemesters,
      activeStudents,
      activeFaculty,
      college,
    ] = await Promise.all([
      prisma.department.count({ where: { collegeId } }),
      prisma.course.count({ where: { collegeId } }),
      prisma.semester.count({ where: { course: { collegeId } } }),
      prisma.student.count({
        where: { collegeId, status: StudentStatus.ACTIVE },
      }),
      prisma.faculty.count({
        where: { collegeId, status: FacultyStatus.ACTIVE },
      }),
      prisma.college.findUnique({
        where: { id: collegeId },
        select: { id: true, name: true, code: true },
      }),
    ]);

    return {
      totalDepartments,
      totalCourses,
      totalSemesters,
      activeStudents,
      activeFaculty,
      college,
    };
  }

  private resolveCollegeId(actor: AuthUserPayload): string {
    if (actor.role === AppRole.SUPER_ADMIN) {
      throw new AppError(
        'College Admin dashboard is scoped to a college. Use Super Admin dashboard instead.',
        400
      );
    }

    if (!actor.collegeId) {
      throw new AppError('Your account is not linked to a college', 403);
    }

    return actor.collegeId;
  }
}

export const collegeAdminService = new CollegeAdminService();
