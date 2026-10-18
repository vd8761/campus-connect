'use client';

import React from 'react';
import Link from 'next/link';
import { Printer, ArrowLeft, Download, Sparkles, AlertCircle } from 'lucide-react';

interface DiscReportPrintControlsProps {
  participantName: string;
  archetypeName: string;
}

export function DiscReportPrintControls({
  participantName,
  archetypeName,
}: DiscReportPrintControlsProps) {
  return (
    <div className="no-print sticky top-0 z-50 bg-[#1e153b] text-white shadow-md border-b border-purple-900/60 py-3 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/admin/reports/recommendations"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Profiles</span>
          </Link>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{participantName}</p>
            <p className="text-[11px] text-purple-300 truncate">
              {archetypeName} • University Pathway Fitment
            </p>
          </div>
        </div>

        {/* Right: Print / PDF Action & Print Tip */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Printer size={15} />
            <span>Print / Save 1-Page PDF</span>
          </button>
        </div>
      </div>

      {/* Helpful Print Setting Hint Banner */}
      <div className="max-w-5xl mx-auto mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 flex-wrap gap-2">
        <span className="flex items-center gap-1.5 text-purple-200">
          <Sparkles size={13} className="shrink-0 text-amber-400" />
          <span>
            <strong>1-Page PDF Instructions:</strong> In your print dialog, select <strong>Destination: Save as PDF</strong>, <strong>Margins: Default or Minimum</strong>, and ensure <strong>Background graphics</strong> is checked so all match badges and tier colors appear.
          </span>
        </span>
      </div>
    </div>
  );
}
