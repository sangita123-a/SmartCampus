'use client';

import { useState } from 'react';
import { useExams, useHallTicket, useStudentMarksheet } from '@/hooks/useExams';
import { ExamTable } from '@/components/exams/ExamTable';
import { MarksheetModal } from '@/components/exams/MarksheetModal';
import { HallTicketModal } from '@/components/exams/HallTicketModal';
import { ExamRecord } from '@/types/exam';

export default function StudentExamsPage() {
  const [selectedExamForMarksheet, setSelectedExamForMarksheet] = useState<ExamRecord | null>(null);
  const [selectedExamForHallTicket, setSelectedExamForHallTicket] = useState<ExamRecord | null>(null);

  const { data: examsData, isLoading: isExamsLoading } = useExams({ limit: 10, isPublished: true });

  // Dummy current studentId for demonstration; in real app extracted from auth session
  const studentId = 'clstudent001';

  const { data: marksheetData } = useStudentMarksheet(studentId, selectedExamForMarksheet?.id);
  const { data: hallTicketData } = useHallTicket(studentId, selectedExamForHallTicket?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          My Exam Schedules & Official Marksheets
        </h1>
        <p className="text-xs text-[var(--muted)]">View upcoming examination schedules, download printable hall tickets, and view official semester marksheets.</p>
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
        onOpenRankList={(ex) => setSelectedExamForHallTicket(ex)}
        onOpenEdit={() => {}}
        isLoading={isExamsLoading}
      />

      {selectedExamForMarksheet && marksheetData && (
        <MarksheetModal
          marksheet={marksheetData}
          onClose={() => setSelectedExamForMarksheet(null)}
        />
      )}

      {selectedExamForHallTicket && hallTicketData && (
        <HallTicketModal
          hallTicket={hallTicketData}
          onClose={() => setSelectedExamForHallTicket(null)}
        />
      )}
    </div>
  );
}
