import React from 'react';
import Image from 'next/image';
import { Sparkles, Gift, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { ORIGINBI_ASSESSMENT_AMOUNT } from '@/lib/constants';

interface OriginBIHighlightBoxProps {
  compact?: boolean;
  variant?: 'default' | 'compact' | 'hero';
  className?: string;
}

export function OriginBIHighlightBox({ compact = false, variant = 'default', className = '' }: OriginBIHighlightBoxProps) {
  if (variant === 'hero') {
    return (
      <div className={`p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl ${className}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold tracking-wide whitespace-nowrap">
            <Sparkles size={12} className="text-brand-turquoise shrink-0" />
            <span>Worth ₹{ORIGINBI_ASSESSMENT_AMOUNT}</span>
            <span className="text-white/40">•</span>
            <span className="text-emerald-300 font-bold">100% Free with Registration</span>
          </div>
          <span className="text-[10px] font-bold text-brand-turquoise uppercase tracking-wider whitespace-nowrap">
            Zero Extra Cost
          </span>
        </div>

        <h4 className="font-heading font-bold text-sm sm:text-base text-white mb-1.5 flex items-center gap-1.5">
          <Sparkles size={15} className="text-brand-turquoise shrink-0" />
          <span>Discover Your Strengths with OriginBI</span>
        </h4>

        <p className="text-xs text-white/80 leading-relaxed mb-3">
          Register for Campus Square and get free access to the OriginBI Assessment (Actual value ₹{ORIGINBI_ASSESSMENT_AMOUNT} - completely free for attendees). You’ll receive an email to complete a short assessment. After finishing, download your personalised single-page result PDF on the university fair day spot - a clear snapshot of your strengths, working style, and career alignment to guide smarter choices.
        </p>

        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 text-[11px] text-white/70">
          <span className="truncate">A joint collaboration by <strong className="text-white">Atom Infinity</strong> & <strong className="text-white">OriginBI</strong></span>
          <span className="shrink-0 text-emerald-300 font-bold bg-white/10 px-2 py-0.5 rounded text-[10px] whitespace-nowrap">100% Free</span>
        </div>
      </div>
    );
  }

  if (compact || variant === 'compact') {
    return (
      <div className={`p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 via-white to-blue-50/60 border border-purple-200/80 shadow-sm text-left ${className}`}>
        {/* Top Badges: Single Clean Row without awkward wrapping */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-purple-200/90 text-brand-navy text-[11px] font-semibold whitespace-nowrap shadow-xs">
            <Sparkles size={12} className="text-brand-purple shrink-0" />
            <span>Worth ₹{ORIGINBI_ASSESSMENT_AMOUNT}</span>
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-full font-bold text-[10px]">Free</span>
          </div>
          <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider whitespace-nowrap bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full shrink-0">
            Included
          </span>
        </div>

        <h4 className="font-heading font-bold text-sm text-brand-navy mb-1.5 flex items-center gap-1.5">
          <Sparkles size={14} className="text-brand-purple shrink-0" />
          <span>Discover Your Strengths with OriginBI</span>
        </h4>

        <p className="text-xs text-brand-muted leading-relaxed mb-3">
          Register for Campus Square and get <strong className="text-brand-navy">free access</strong> to the OriginBI Assessment (Actual value ₹{ORIGINBI_ASSESSMENT_AMOUNT} - no payment needed). You’ll receive an email to take a short assessment and download your personalised single-page result PDF on the university fair day spot to guide smarter stream & career choices.
        </p>

        <div className="pt-2 border-t border-purple-100 flex items-center justify-between gap-2 text-[11px] text-brand-muted">
          <span className="truncate">Collaboration: <strong className="text-brand-navy">Atom Infinity</strong> & <strong className="text-brand-navy">OriginBI</strong></span>
          <span className="shrink-0 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded whitespace-nowrap text-[11px]">₹0 Free</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-purple-50/90 via-white to-indigo-50/50 border border-brand-purple/20 shadow-md relative overflow-hidden text-left ${className}`}>
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-purple/5 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-border/90 text-xs shadow-xs whitespace-nowrap">
            <Sparkles size={13} className="text-brand-purple shrink-0" />
            <span className="font-semibold text-brand-navy">OriginBI Assessment</span>
            <span className="h-3 w-px bg-brand-border"></span>
            <span className="font-bold text-brand-navy">Worth ₹{ORIGINBI_ASSESSMENT_AMOUNT}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
              100% Free
            </span>
          </div>
          <span className="text-xs font-bold text-brand-purple whitespace-nowrap">
            No Extra Payment
          </span>
        </div>

        <h3 className="font-heading font-extrabold text-lg sm:text-xl text-brand-navy mb-2 flex items-center gap-2">
          <Sparkles size={18} className="text-brand-purple shrink-0" />
          <span>Discover Your Strengths with OriginBI</span>
        </h3>

        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-4">
          Register for Campus Square and get <strong className="text-brand-navy font-semibold">free access to the OriginBI Assessment</strong> (Actual cost: <span className="line-through text-gray-400">₹{ORIGINBI_ASSESSMENT_AMOUNT}</span> - entirely free with your registration).
        </p>

        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-4">
          You’ll receive an email to complete a short assessment. After finishing, download your <strong className="text-brand-navy font-semibold">personalised single-page result PDF on the university fair day spot</strong> - a clear snapshot of your strengths, working style, and career alignment to guide smarter choices.
        </p>

        <div className="pt-3.5 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-brand-muted">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple"></span>
            <span>A joint collaboration by <strong className="text-brand-navy">Atom Infinity</strong> and <strong className="text-brand-navy">OriginBI Mindworks</strong>.</span>
          </div>
          <span className="font-semibold text-emerald-600 text-xs sm:text-right whitespace-nowrap">Automatic registration upon signup</span>
        </div>
      </div>
    </div>
  );
}
