export type RoomType = 'LECTURE_HALL' | 'LABORATORY' | 'SEMINAR_HALL' | 'AUDITORIUM' | 'OTHER';
export type ClassroomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'INACTIVE';

export interface Classroom {
  id: string;
  collegeId: string;
  roomNumber: string;
  roomName: string;
  building: string;
  floor: number;
  capacity: number;
  roomType: RoomType;
  status: ClassroomStatus;
  createdAt: string;
  updatedAt: string;
  _count?: {
    timetables: number;
  };
}

export interface ClassroomQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  roomType?: RoomType;
  status?: ClassroomStatus;
  building?: string;
  minCapacity?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
