'use client';

import { useFacultyList } from '@/hooks/useFaculty';
import { FacultyDetailsPage } from '@/components/faculty/FacultyDetailsPage';
import { Loading } from '@/components/Loading';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { getErrorMessage } from '@/utils/cn';

export function FacultyOwnProfilePage() {
  const { data, isLoading, isError, error, refetch } = useFacultyList({
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

  const faculty = data?.items[0];
  if (!faculty) {
    return (
      <EmptyState
        title="No faculty profile linked"
        description="Ask your college admin to create your faculty record using your account email."
      />
    );
  }

  return <FacultyDetailsPage facultyId={faculty.id} showAdminActions={false} />;
}
