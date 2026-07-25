import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { CourseListPage } from '@/components/courses/CourseListPage';

import { Role } from '@/types/roles';



export const metadata: Metadata = {

  title: 'Courses',

};



export default function CoursesPage() {

  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <CourseListPage />

    </DashboardLayoutShell>

  );

}

