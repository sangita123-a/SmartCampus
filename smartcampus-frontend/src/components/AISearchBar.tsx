'use client';

import React, { useState } from 'react';
import { aiApi } from '@/services/aiApi';
import { Search, Sparkles, Loader2, UserCheck, AlertTriangle, ArrowRight } from 'lucide-react';

export function AISearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setSearchResult(null);

    try {
      const res = await aiApi.naturalLanguageSearch(query);
      if (res.success) {
        setSearchResult(res.data);
      }
    } catch (err) {
      alert('Natural Language Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-4 text-teal-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try AI Search: "Show students with attendance below 75%", "Who has pending fees?"'
          className="w-full pl-12 pr-32 py-4 bg-slate-900/90 border border-teal-500/30 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xl backdrop-blur-md"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>AI Search</span>
        </button>
      </form>

      {/* Search Result Box */}
      {searchResult && (
        <div className="mt-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl animate-in fade-in duration-300 text-slate-100">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Search Insights ({searchResult.queryType})
            </span>
            {searchResult.threshold && (
              <span className="text-xs font-semibold px-3 py-1 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
                Threshold: &lt; {searchResult.threshold}%
              </span>
            )}
          </div>

          {searchResult.answer && (
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {searchResult.answer}
            </p>
          )}

          {Array.isArray(searchResult.results) && searchResult.results.length > 0 && (
            <div className="space-y-2 mt-3">
              {searchResult.results.map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-800/60 rounded-xl flex items-center justify-between border border-slate-700/50 text-xs">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-teal-400" />
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-slate-400 text-[11px]">ID: {item.studentId || item.rollNumber} | Dept: {item.department || 'N/A'}</p>
                    </div>
                  </div>
                  {item.attendancePercentage !== undefined && (
                    <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg">
                      {item.attendancePercentage}% Attendance
                    </span>
                  )}
                  {item.remainingAmount !== undefined && (
                    <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                      ${item.remainingAmount} Due
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
