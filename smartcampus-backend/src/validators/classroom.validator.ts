import { z } from 'zod';
import { ClassroomStatus, RoomType } from '@prisma/client';

export const classroomQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  roomType: z.nativeEnum(RoomType).optional(),
  status: z.nativeEnum(ClassroomStatus).optional(),
  building: z.string().optional(),
  minCapacity: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  sortBy: z.string().optional().default('roomNumber'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const createClassroomSchema = z.object({
  collegeId: z.string().optional(),
  roomNumber: z.string({ required_error: 'Room number is required' }),
  roomName: z.string({ required_error: 'Room name is required' }),
  building: z.string({ required_error: 'Building is required' }),
  floor: z.number().int().min(0).optional().default(1),
  capacity: z.number().int().positive({ message: 'Capacity must be greater than 0' }),
  roomType: z.nativeEnum(RoomType).optional().default(RoomType.LECTURE_HALL),
  status: z.nativeEnum(ClassroomStatus).optional().default(ClassroomStatus.AVAILABLE),
});

export const updateClassroomSchema = z.object({
  roomNumber: z.string().optional(),
  roomName: z.string().optional(),
  building: z.string().optional(),
  floor: z.number().int().min(0).optional(),
  capacity: z.number().int().positive().optional(),
  roomType: z.nativeEnum(RoomType).optional(),
  status: z.nativeEnum(ClassroomStatus).optional(),
});

export const classroomIdParamSchema = z.object({
  id: z.string({ required_error: 'Classroom ID is required' }),
});
