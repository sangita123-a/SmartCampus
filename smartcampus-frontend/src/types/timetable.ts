export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export type TimetableStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELLED';

export interface TimetableSlot {
  id: string;
  collegeId: string;
  departmentId: string;
  courseId: string;
  semesterId: string;
  subjectId: string;
  facultyId: string;
  classroomId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  academicYear: string;
  status: TimetableStatus;
  createdAt: string;
  updatedAt: string;
  department?: { id: string; name: string; code: string };
  course?: { id: string; name: string; code: string };
  semester?: { id: string; name: string; semesterNumber: number };
  subject?: { id: string; subjectName: string; subjectCode: string };
  faculty?: { id: string; firstName: string; lastName: string; employeeId?: string };
  classroom?: { id: string; roomNumber: string; roomName: string; building: string };
}

export interface TimetableDashboardCards {
  todayClasses: number;
  weeklyClasses: number;
  totalClassrooms: number;
  occupiedClassrooms: number;
  availableClassrooms: number;
  totalFacultyAssigned: number;
  todayDayOfWeek: DayOfWeek;
}

export interface WeeklyTimetableGrid {
  entries: TimetableSlot[];
  weeklyGrid: Record<DayOfWeek, TimetableSlot[]>;
}

export interface TimetableQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  courseId?: string;
  semesterId?: string;
  subjectId?: string;
  facultyId?: string;
  classroomId?: string;
  dayOfWeek?: DayOfWeek;
  academicYear?: string;
  status?: TimetableStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
