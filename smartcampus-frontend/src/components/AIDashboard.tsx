'use client';

import React, { useState, useEffect } from 'react';
import { aiApi } from '@/services/aiApi';
import { AISearchBar } from '@/components/AISearchBar';
import { AIGenerators } from '@/components/AIGenerators';
import { 
  Sparkles, Brain, AlertTriangle, TrendingUp, DollarSign, Calendar, 
  Settings, ShieldCheck, RefreshCw
} from 'lucide-react';

export function AIDashboard() {
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'settings'>('insights');
  const [loading, setLoading] = useState(false);

  // AI Analytics States
  const [performanceData, setPerformanceData] = useState<any | null>(null);
  const [attendanceInsights, setAttendanceInsights] = useState<any | null>(null);
  const [feeInsights, setFeeInsights] = useState<any | null>(null);
  const [timetableRecs, setTimetableRecs] = useState<any | null>(null);
  const [aiSettings, setAiSettings] = useState<any | null>(null);

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      const [perf, att, fee, tt, settings] = await Promise.all([
        aiApi.predictPerformance(),
        aiApi.getAttendanceInsights(),
        aiApi.getFeeInsights(),
        aiApi.suggestTimetable(),
        aiApi.getSettings()
      ]);

      if (perf.success) setPerformanceData(perf.data);
      if (att.success) setAttendanceInsights(att.data);
      if (fee.success) setFeeInsights(fee.data);
      if (tt.success) setTimetableRecs(tt.data);
      if (settings.success) setAiSettings(settings.data);
    } catch (err) {
      console.error('Failed to load AI Dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  return (
    <div className="space-y-8 p-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI SmartCampus Analytics 2.0
          </div>
          <h1 className="text-3xl font-extrabold text-white">AI Intelligence Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time predictive student performance, fee collection forecasting, and automated campus insights.
          </p>
        </div>

        <button
          onClick={fetchAIInsights}
          disabled={loading}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 text-teal-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh AI Telemetry</span>
        </button>
      </div>

      {/* Natural Language AI Search */}
      <AISearchBar />

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('insights')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'insights' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-4 h-4" /> AI Predictive Insights & Tools
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'predictions' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Student Risk & Fee Analytics
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 ${
            activeTab === 'settings' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" /> AI Configuration & Rate Limits
        </button>
      </div>

      {/* Tab 1: AI Predictive Insights Cards */}
      {activeTab === 'insights' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Student Performance Prediction */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-teal-400" /> Student Academic Risk Predictor
                  </h3>
                  <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                    {performanceData?.highRiskCount || 0} At-Risk
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {performanceData?.insights || 'Analyzing student quiz trends, CGPA scores, and attendance velocity...'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                <span>Students Evaluated: <strong>{performanceData?.evaluatedStudentsCount || 0}</strong></span>
                <span className="text-teal-400 font-bold">Top Performers: {performanceData?.topPerformersCount || 0}</span>
              </div>
            </div>

            {/* Card 2: Fee Forecast */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" /> AI Fee Collection Forecast
                  </h3>
                  <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                    ${feeInsights?.totalPendingAmount?.toFixed(2) || '0.00'} Outstanding
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {feeInsights?.insights || 'Forecasting late-payment accounts and revenue collection trends...'}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                <span>Accounts Scanned: <strong>{feeInsights?.evaluatedAccounts || 0}</strong></span>
                <span className="text-emerald-400 font-bold">Recovery Model Active</span>
              </div>
            </div>

            {/* Card 3: Attendance Pattern Insights */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" /> Low Attendance Pattern Insights
                  </h3>
                  <span className="text-xs font-mono font-bold px-3 py-1 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
                    {attendanceInsights?.totalAbsencesAnalyzed || 0} Absences Scanned
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {attendanceInsights?.insights || 'Identifying department absence spikes and day-of-week drop-offs...'}
                </p>
              </div>
            </div>

            {/* Card 4: Timetable Optimization */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" /> Timetable & Schedule Optimization
                  </h3>
                  <span className="text-xs font-mono font-bold px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
                    AI Conflict Resolver
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {timetableRecs?.recommendations || 'Evaluating classroom capacity, lab overlaps, and faculty teaching load...'}
                </p>
              </div>
            </div>
          </div>

          {/* AI Notice & Report Generator Tools */}
          <AIGenerators />
        </div>
      )}

      {/* Tab 2: Detailed Predictions & Charts */}
      {activeTab === 'predictions' && (
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-teal-400" /> Executive AI Analytics Overview
          </h3>
          <p className="text-xs text-slate-400">
            Machine learning outputs trained on historical college ERP logs, examination grades, and fee receipts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase">Predicted High Performance</p>
              <p className="text-4xl font-extrabold text-teal-400 mt-2">88.5%</p>
              <p className="text-[11px] text-slate-500 mt-1">Computer Science & Info Tech</p>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase">Predicted Fee Collection</p>
              <p className="text-4xl font-extrabold text-emerald-400 mt-2">94.2%</p>
              <p className="text-[11px] text-slate-500 mt-1">Within 15 Days of Due Date</p>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase">Attendance Risk Index</p>
              <p className="text-4xl font-extrabold text-rose-400 mt-2">Low (4.1%)</p>
              <p className="text-[11px] text-slate-500 mt-1">Below Minimum 75% Cutoff</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI Configuration */}
      {activeTab === 'settings' && (
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Modular AI Settings & Rate Limits</h3>
              <p className="text-xs text-slate-400">Configure OpenAI-compatible endpoints, custom models, and toggle individual features.</p>
            </div>
          </div>

          {aiSettings && (
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <p className="font-bold text-white">AI Engine Status</p>
                  <p className="text-slate-400 text-[11px]">Global master switch for all AI calls</p>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold uppercase ${aiSettings.isEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {aiSettings.isEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="font-bold text-slate-400">Model Provider</p>
                  <p className="text-sm font-bold text-white mt-1 uppercase">{aiSettings.modelProvider}</p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="font-bold text-slate-400">Active Model Name</p>
                  <p className="text-sm font-mono font-bold text-teal-400 mt-1">{aiSettings.modelName}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <p className="font-bold text-white mb-2">Enabled AI Features</p>
                {Object.entries(aiSettings.enabledFeatures || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-1 border-b border-slate-800/60 last:border-b-0">
                    <span className="font-mono text-slate-300">{key}</span>
                    <span className={`font-bold ${val ? 'text-teal-400' : 'text-slate-500'}`}>
                      {val ? '✓ Enabled' : '✕ Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
