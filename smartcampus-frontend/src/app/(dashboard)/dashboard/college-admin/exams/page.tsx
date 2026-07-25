'use client';

import { useState } from 'react';
import { useExamDashboard, useExams, useRankList } from '@/hooks/useExams';
import { ExamDashboardCards } from '@/components/exams/ExamDashboardCards';
import { ExamTable } from '@/components/exams/ExamTable';
import { BulkMarksEntryForm } from '@/components/exams/BulkMarksEntryForm';
import { RankListTable } from '@/components/exams/RankListTable';
import { AddEditExamModal } from '@/components/exams/AddEditExamModal';
import { ExamRecord, ExamStatus, ExamType } from '@/types/exam';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus } from 'lucide-react';

export default function CollegeAdminExamsPage() {
  const [activeTab, setActiveTab] = useState<'schedules' | 'marks' | 'ranks'>('schedules');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExamStatus | undefined>();
  const [typeFilter, setTypeFilter] = useState<ExamType | undefined>();

  const [selectedExamForMarks, setSelectedExamForMarks] = useState<ExamRecord | null>(null);
  const [selectedExamForRank, setSelectedExamForRank] = useState<ExamRecord | null>(null);
  const [editingExam, setEditingExam] = useState<ExamRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: cards, isLoading: isCardsLoading } = useExamDashboard();
  const { data: examsData, isLoading: isExamsLoading } = useExams({
    page,
    limit: 10,
    search,
    status: statusFilter,
    examType: typeFilter,
  });

  const { data: rankData, isLoading: isRankLoading } = useRankList(selectedExamForRank?.id);

  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: async () => (await api.get('/departments')).data.data });
  const { data: courses = [] } = useQuery({ queryKey: ['courses'], queryFn: async () => (await api.get('/courses')).data.data });
  const { data: semesters = [] } = useQuery({ queryKey: ['semesters'], queryFn: async () => (await api.get('/semesters')).data.data });
  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: async () => (await api.get('/subjects')).data.data });
  const { data: faculty = [] } = useQuery({ queryKey: ['faculty'], queryFn: async () => (await api.get('/faculty')).data.data });

  const handleOpenAdd = () => {
    setEditingExam(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exam: ExamRecord) => {
    setEditingExam(exam);
    setIsModalOpen(true);
  };

  const handleOpenMarksEntry = (exam: ExamRecord) => {
    setSelectedExamForMarks(exam);
    setActiveTab('marks');
  };

  const handleOpenRankList = (exam: ExamRecord) => {
    setSelectedExamForRank(exam);
    setActiveTab('ranks');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
            Examination & Results Management
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Schedule exams, schedule subject slots, enter bulk marks, publish results, and compute GPA/CGPA rank lists.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Create Exam Schedule
        </button>
      </div>

      <ExamDashboardCards data={cards} isLoading={isCardsLoading} />

      <div className="flex border-b border-[var(--border)] overflow-x-auto">
        <button
          onClick={() => setActiveTab('schedules')}
          className={`border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'schedules' ? 'border-teal-600 text-teal-600' : 'border-transparent text-[var(--muted)]'
          }`}
        >
          All Exam Schedules
        </button>
        {selectedExamForMarks && (
          <button
            onClick={() => setActiveTab('marks')}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'marks' ? 'border-teal-600 text-teal-600' : 'border-transparent text-[var(--muted)]'
            }`}
          >
            Bulk Marks Entry ({selectedExamForMarks.examName})
          </button>
        )}
        {selectedExamForRank && (
          <button
            onClick={() => setActiveTab('ranks')}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'ranks' ? 'border-teal-600 text-teal-600' : 'border-transparent text-[var(--muted)]'
            }`}
          >
            Class Rank List ({selectedExamForRank.examName})
          </button>
        )}
      </div>

      {activeTab === 'schedules' && (
        <ExamTable
          exams={examsData?.data || []}
          total={examsData?.meta?.total || 0}
          page={page}
          limit={10}
          onPageChange={setPage}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
          onOpenMarksEntry={handleOpenMarksEntry}
          onOpenRankList={handleOpenRankList}
          onOpenEdit={handleOpenEdit}
          isLoading={isExamsLoading}
        />
      )}

      {activeTab === 'marks' && selectedExamForMarks && (
        <BulkMarksEntryForm
          exam={selectedExamForMarks}
          onSuccess={() => setActiveTab('schedules')}
        />
      )}

      {activeTab === 'ranks' && selectedExamForRank && (
        <RankListTable
          rankList={rankData?.rankList || []}
          examName={selectedExamForRank.examName}
          isLoading={isRankLoading}
        />
      )}

      {isModalOpen && (
        <AddEditExamModal
          examToEdit={editingExam}
          departments={departments}
          courses={courses}
          semesters={semesters}
          subjects={subjects}
          faculty={faculty}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
