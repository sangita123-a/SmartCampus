import {
  Award,
  Bell,
  BookMarked,
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  Clock,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Library,
  UserCheck,
  UserRound,
  Users,
  Wallet,
  DollarSign,
  BarChart3,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Role } from '@/types/roles';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const overview = (href: string): NavItem => ({
  href,
  label: 'Overview',
  icon: LayoutDashboard,
});

export function getSidebarNav(role: Role): NavItem[] {
  switch (role) {
    case Role.SUPER_ADMIN:
      return [
        overview('/dashboard/super-admin'),
        {
          href: '/dashboard/modules',
          label: 'ERP Modules',
          icon: Layers,
        },
        {
          href: '/dashboard/super-admin/colleges',
          label: 'Colleges',
          icon: Building2,
        },
        {
          href: '/dashboard/super-admin/attendance',
          label: 'Attendance',
          icon: CalendarCheck,
        },
        {
          href: '/dashboard/super-admin/timetable',
          label: 'Timetable',
          icon: CalendarDays,
        },
        {
          href: '/dashboard/super-admin/finance',
          label: 'Finance & Fees',
          icon: DollarSign,
        },
        {
          href: '/dashboard/super-admin/exams',
          label: 'Examinations',
          icon: Award,
        },
        {
          href: '/dashboard/super-admin/library',
          label: 'Library System',
          icon: Library,
        },
        {
          href: '/dashboard/super-admin/notifications',
          label: 'Notifications',
          icon: Bell,
        },
        {
          href: '/dashboard/super-admin/reports',
          label: 'Reports & Analytics',
          icon: BarChart3,
        },
        {
          href: '/dashboard/ai',
          label: 'AI SmartCampus',
          icon: Sparkles,
        },
      ];
    case Role.COLLEGE_ADMIN:
      return [
        overview('/dashboard/college-admin'),
        {
          href: '/dashboard/modules',
          label: 'ERP Modules',
          icon: Layers,
        },
        {
          href: '/dashboard/college-admin/departments',
          label: 'Departments',
          icon: Layers,
        },
        {
          href: '/dashboard/college-admin/courses',
          label: 'Courses',
          icon: BookOpen,
        },
        {
          href: '/dashboard/college-admin/semesters',
          label: 'Semesters',
          icon: CalendarRange,
        },
        {
          href: '/dashboard/college-admin/subjects',
          label: 'Subjects',
          icon: BookMarked,
        },
        {
          href: '/dashboard/college-admin/students',
          label: 'Students',
          icon: GraduationCap,
        },
        {
          href: '/dashboard/college-admin/faculty',
          label: 'Faculty',
          icon: UserCheck,
        },
        {
          href: '/dashboard/college-admin/classrooms',
          label: 'Classrooms',
          icon: Clock,
        },
        {
          href: '/dashboard/college-admin/attendance',
          label: 'Attendance',
          icon: CalendarCheck,
        },
        {
          href: '/dashboard/college-admin/timetable',
          label: 'Timetable',
          icon: CalendarDays,
        },
        {
          href: '/dashboard/college-admin/finance',
          label: 'Fee & Finance',
          icon: Wallet,
        },
        {
          href: '/dashboard/college-admin/exams',
          label: 'Examinations',
          icon: Award,
        },
        {
          href: '/dashboard/college-admin/library',
          label: 'Library Management',
          icon: Library,
        },
        {
          href: '/dashboard/college-admin/notifications',
          label: 'Notifications Center',
          icon: Bell,
        },
        {
          href: '/dashboard/college-admin/reports',
          label: 'Reports & Analytics',
          icon: BarChart3,
        },
      ];
    case Role.FACULTY:
      return [
        overview('/dashboard/faculty'),
        { href: '/dashboard/faculty/profile', label: 'My Profile', icon: Users },
        {
          href: '/dashboard/faculty/subjects',
          label: 'My Subjects',
          icon: BookMarked,
        },
        {
          href: '/dashboard/faculty/attendance',
          label: 'Attendance',
          icon: CalendarCheck,
        },
        {
          href: '/dashboard/faculty/timetable',
          label: 'My Timetable',
          icon: CalendarDays,
        },
        {
          href: '/dashboard/faculty/exams',
          label: 'Marks Entry',
          icon: Award,
        },
        {
          href: '/dashboard/faculty/library',
          label: 'Library Search',
          icon: Library,
        },
        {
          href: '/dashboard/faculty/notifications',
          label: 'Notices',
          icon: Bell,
        },
        {
          href: '/dashboard/faculty/reports',
          label: 'Class Reports',
          icon: BarChart3,
        },
      ];
    case Role.STUDENT:
      return [
        overview('/dashboard/student'),
        { href: '/dashboard/student/profile', label: 'My Profile', icon: GraduationCap },
        {
          href: '/dashboard/student/subjects',
          label: 'Subjects',
          icon: BookMarked,
        },
        {
          href: '/dashboard/student/attendance',
          label: 'My Attendance',
          icon: CalendarCheck,
        },
        {
          href: '/dashboard/student/timetable',
          label: 'My Timetable',
          icon: CalendarDays,
        },
        {
          href: '/dashboard/student/finance',
          label: 'Fee Details',
          icon: Wallet,
        },
        {
          href: '/dashboard/student/exams',
          label: 'Exams & Results',
          icon: Award,
        },
        {
          href: '/dashboard/student/library',
          label: 'Library & Borrowing',
          icon: Library,
        },
        {
          href: '/dashboard/student/notifications',
          label: 'My Notices',
          icon: Bell,
        },
        {
          href: '/dashboard/student/reports',
          label: 'My Reports',
          icon: BarChart3,
        },
      ];
    case Role.PARENT:
      return [
        overview('/dashboard/parent'),
        {
          href: '/dashboard/parent/students',
          label: 'My Children',
          icon: UserRound,
        },
        {
          href: '/dashboard/parent/attendance',
          label: "Child's Attendance",
          icon: CalendarCheck,
        },
        {
          href: '/dashboard/parent/results',
          label: "Child's Results",
          icon: Award,
        },
        {
          href: '/dashboard/parent/fees',
          label: "Child's Fees",
          icon: Wallet,
        },
        {
          href: '/dashboard/parent/timetable',
          label: "Child's Timetable",
          icon: CalendarDays,
        },
        {
          href: '/dashboard/parent/notifications',
          label: 'Notices & Circulars',
          icon: Bell,
        },
        {
          href: '/dashboard/parent/reports',
          label: 'Academic Analytics',
          icon: BarChart3,
        },
        {
          href: '/dashboard/parent/profile',
          label: 'Guardian Profile',
          icon: Users,
        },
      ];
    case Role.LIBRARIAN:
      return [
        overview('/dashboard/librarian'),
        { href: '/dashboard/librarian', label: 'Library Catalog', icon: Library },
      ];
    case Role.ACCOUNTANT:
      return [
        overview('/dashboard/accountant'),
        { href: '/dashboard/accountant/finance', label: 'Fee Management', icon: Wallet },
      ];
    default:
      return [overview('/dashboard')];
  }
}
