'use client';

import { Printer, FileSpreadsheet } from 'lucide-react';
import { exportToCSV } from '@/utils/export';

interface Props {
  title: string;
  exportData?: Record<string, unknown>[];
  exportFilename?: string;
}

export function ReportExportHeader({ title, exportData, exportFilename = 'report' }: Props) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (exportData && exportData.length > 0) {
      exportToCSV(exportFilename, exportData);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4 print:hidden">
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">{title}</h2>
        <p className="text-xs text-[var(--muted)]">Real-time analytical data query generated from live database.</p>
      </div>

      <div className="flex items-center gap-2">
        {exportData && (
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <FileSpreadsheet className="h-4 w-4" /> Export CSV / Excel
          </button>
        )}
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Printer className="h-4 w-4 text-teal-600" /> Print PDF
        </button>
      </div>
    </div>
  );
}
