import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { CourseDetailsPage } from '@/components/courses/CourseDetailsPage';

import { Role } from '@/types/roles';



export const metadata: Metadata = {

  title: 'Course Details',

};



interface PageProps {

  params: Promise<{ id: string }>;

}



export default async function CourseDetailsRoute({ params }: PageProps) {

  const { id } = await params;



  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <CourseDetailsPage courseId={id} />

    </DashboardLayoutShell>

  );

}

