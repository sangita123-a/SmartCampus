'use client';

import { useStudents } from '@/hooks/useStudents';
import { StudentDetailsPage } from '@/components/students/StudentDetailsPage';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { getErrorMessage } from '@/utils/cn';

export function StudentOwnProfilePage() {
  const { data, isLoading, isError, error, refetch } = useStudents({
    page: 1,
    limit: 1,
  });

  if (isLoading) return <Loading label="Loading your profile..." />;
  if (isError) {
    return (
      <ErrorState
        message={getErrorMessage(error, 'Failed to load profile')}
        onRetry={() => refetch()}
      />
    );
  }

  const student = data?.items[0];
  if (!student) {
    return (
      <EmptyState
        title="No student profile linked"
        description="Ask your college admin to create your student record and link it to your account email."
      />
    );
  }

  return (
    <StudentDetailsPage
      studentId={student.id}
      showAdminActions={false}
    />
  );
}
