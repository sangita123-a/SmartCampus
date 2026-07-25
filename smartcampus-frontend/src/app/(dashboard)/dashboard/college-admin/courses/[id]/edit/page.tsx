import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { EditCoursePage } from '@/components/courses/EditCoursePage';

import { Role } from '@/types/roles';



export const metadata: Metadata = {

  title: 'Edit Course',

};



interface PageProps {

  params: Promise<{ id: string }>;

}



export default async function EditCourseRoute({ params }: PageProps) {

  const { id } = await params;



  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <EditCoursePage courseId={id} />

    </DashboardLayoutShell>

  );

}

