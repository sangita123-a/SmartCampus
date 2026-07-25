'use client';

import React, { useState } from 'react';
import { aiApi } from '@/services/aiApi';
import { Bell, FileText, Send, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

export function AIGenerators() {
  // Notification Generator state
  const [notifType, setNotifType] = useState('ANNOUNCEMENT');
  const [audience, setAudience] = useState('ALL_STUDENTS');
  const [details, setDetails] = useState('');
  const [generatingNotif, setGeneratingNotif] = useState(false);
  const [generatedNotif, setGeneratedNotif] = useState<string | null>(null);

  // Report Summarizer state
  const [rawReport, setRawReport] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [reportSummary, setReportSummary] = useState<string | null>(null);

  const handleGenerateNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || generatingNotif) return;
    setGeneratingNotif(true);
    setGeneratedNotif(null);
    try {
      const res = await aiApi.generateNotification(notifType, audience, details);
      if (res.success) {
        setGeneratedNotif(res.data.draftNotification);
      }
    } catch (err) {
      alert('Notification generation failed.');
    } finally {
      setGeneratingNotif(false);
    }
  };

  const handleSummarizeReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawReport.trim() || summarizing) return;
    setSummarizing(true);
    setReportSummary(null);
    try {
      const res = await aiApi.summarizeReport(rawReport);
      if (res.success) {
        setReportSummary(res.data.summary);
      }
    } catch (err) {
      alert('Report summarization failed.');
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
      {/* AI Notification Generator */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Bell className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-bold text-white">AI Notification & Notice Generator</h3>
          </div>

          <form onSubmit={handleGenerateNotif} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Notice Type</label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ANNOUNCEMENT">General Announcement</option>
                  <option value="HOLIDAY_NOTICE">Holiday Notice</option>
                  <option value="EXAM_NOTICE">Exam Notice</option>
                  <option value="FEE_REMINDER">Fee Reminder Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ALL_STUDENTS">All Students</option>
                  <option value="FACULTY">Faculty Members</option>
                  <option value="PARENTS">Guardians & Parents</option>
                  <option value="COLLEGE_ADMIN">Department Heads</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold text-xs">Key Details / Bullet Points</label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g. Mid-semester exams begin August 10th. Admit cards available in student portal."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={generatingNotif || !details.trim()}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {generatingNotif ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Draft Notice with AI</span>
            </button>
          </form>

          {generatedNotif && (
            <div className="mt-4 p-4 bg-slate-950 border border-teal-500/30 rounded-2xl animate-in fade-in duration-300">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI Drafted Notice
              </span>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{generatedNotif}</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Report Summarizer */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">AI Report Summarizer</h3>
          </div>

          <form onSubmit={handleSummarizeReport} className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold text-xs">Paste Report / Log Text</label>
              <textarea
                rows={5}
                value={rawReport}
                onChange={(e) => setRawReport(e.target.value)}
                placeholder="Paste raw attendance logs, financial breakdown text, or semester result metrics here..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={summarizing || !rawReport.trim()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {summarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Summarize & Extract Action Items</span>
            </button>
          </form>

          {reportSummary && (
            <div className="mt-4 p-4 bg-slate-950 border border-emerald-500/30 rounded-2xl animate-in fade-in duration-300">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI Summary & Action Plan
              </span>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{reportSummary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
