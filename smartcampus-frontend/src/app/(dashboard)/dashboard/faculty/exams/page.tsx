'use client';

import { useState } from 'react';
import { useExams } from '@/hooks/useExams';
import { ExamTable } from '@/components/exams/ExamTable';
import { BulkMarksEntryForm } from '@/components/exams/BulkMarksEntryForm';
import { ExamRecord } from '@/types/exam';

export default function FacultyExamsPage() {
  const [selectedExamForMarks, setSelectedExamForMarks] = useState<ExamRecord | null>(null);

  const { data: examsData, isLoading } = useExams({ limit: 10 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Faculty Marks Entry Portal
        </h1>
        <p className="text-xs text-[var(--muted)]">Select an examination schedule to submit student marks for your assigned subjects.</p>
      </div>

      {selectedExamForMarks ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedExamForMarks(null)}
            className="text-xs font-semibold text-teal-600 hover:underline"
          >
            ← Back to Exam Schedules
          </button>
          <BulkMarksEntryForm
            exam={selectedExamForMarks}
            onSuccess={() => setSelectedExamForMarks(null)}
          />
        </div>
      ) : (
        <ExamTable
          exams={examsData?.data || []}
          total={examsData?.meta?.total || 0}
          page={1}
          limit={10}
          onPageChange={() => {}}
          onSearchChange={() => {}}
          onStatusFilterChange={() => {}}
          onTypeFilterChange={() => {}}
          onOpenMarksEntry={(ex) => setSelectedExamForMarks(ex)}
          onOpenRankList={() => {}}
          onOpenEdit={() => {}}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
