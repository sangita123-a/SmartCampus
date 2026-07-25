'use client';

import { useState } from 'react';
import { useExams, useStudentMarksheet } from '@/hooks/useExams';
import { ExamTable } from '@/components/exams/ExamTable';
import { MarksheetModal } from '@/components/exams/MarksheetModal';
import { ExamRecord } from '@/types/exam';

export default function ParentExamsPage() {
  const [selectedExamForMarksheet, setSelectedExamForMarksheet] = useState<ExamRecord | null>(null);

  const { data: examsData, isLoading: isExamsLoading } = useExams({ limit: 10, isPublished: true });

  const studentId = 'clstudent001';
  const { data: marksheetData } = useStudentMarksheet(studentId, selectedExamForMarksheet?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          {"Child's Examination Results & Marksheets"}
        </h1>
        <p className="text-xs text-[var(--muted)]">Review published examination statements, grade points, and semester performance for your child.</p>
      </div>

      <ExamTable
        exams={examsData?.data || []}
        total={examsData?.meta?.total || 0}
        page={1}
        limit={10}
        onPageChange={() => {}}
        onSearchChange={() => {}}
        onStatusFilterChange={() => {}}
        onTypeFilterChange={() => {}}
        onOpenMarksEntry={(ex) => setSelectedExamForMarksheet(ex)}
        onOpenRankList={() => {}}
        onOpenEdit={() => {}}
        isLoading={isExamsLoading}
      />

      {selectedExamForMarksheet && marksheetData && (
        <MarksheetModal
          marksheet={marksheetData}
          onClose={() => setSelectedExamForMarksheet(null)}
        />
      )}
    </div>
  );
}
