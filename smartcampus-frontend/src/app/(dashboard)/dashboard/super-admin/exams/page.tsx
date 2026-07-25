'use client';

import { useState } from 'react';
import { useExamDashboard, useExams, useRankList } from '@/hooks/useExams';
import { ExamDashboardCards } from '@/components/exams/ExamDashboardCards';
import { ExamTable } from '@/components/exams/ExamTable';
import { RankListTable } from '@/components/exams/RankListTable';
import { ExamRecord } from '@/types/exam';

export default function SuperAdminExamsPage() {
  const [selectedExamForRank, setSelectedExamForRank] = useState<ExamRecord | null>(null);

  const { data: cards, isLoading: isCardsLoading } = useExamDashboard();
  const { data: examsData, isLoading: isExamsLoading } = useExams({ limit: 10 });
  const { data: rankData, isLoading: isRankLoading } = useRankList(selectedExamForRank?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Super Admin - Master Examination & Results Overview
        </h1>
        <p className="text-xs text-[var(--muted)]">Global examination metrics, pass/fail ratios, published result logs, and institution rank lists.</p>
      </div>

      <ExamDashboardCards data={cards} isLoading={isCardsLoading} />

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Master Examination Schedules
          </h2>
          <ExamTable
            exams={examsData?.data || []}
            total={examsData?.meta?.total || 0}
            page={1}
            limit={10}
            onPageChange={() => {}}
            onSearchChange={() => {}}
            onStatusFilterChange={() => {}}
            onTypeFilterChange={() => {}}
            onOpenMarksEntry={() => {}}
            onOpenRankList={(ex) => setSelectedExamForRank(ex)}
            onOpenEdit={() => {}}
            isLoading={isExamsLoading}
          />
        </div>

        {selectedExamForRank && (
          <div>
            <h2 className="mb-3 text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
              Rank List ({selectedExamForRank.examName})
            </h2>
            <RankListTable
              rankList={rankData?.rankList || []}
              examName={selectedExamForRank.examName}
              isLoading={isRankLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
