'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Award, ShieldCheck, CheckCircle2, Compass, BrainCircuit } from 'lucide-react';
import { DiscProfileFitmentReport } from '@/lib/recommendations/discCourseMatcher';

interface OnePageDiscUniversityReportProps {
  report: DiscProfileFitmentReport;
}

export function OnePageDiscUniversityReport({ report }: OnePageDiscUniversityReportProps) {
  const {
    fullName,
    stream,
    eventTitle,
    eventCity,
    examRefNo,
    completedAt,
    scores,
    traitCode,
    archetypeName,
    archetypeColor,
    behavioralOrientation,
    executiveSummary,
    strengths,
    matchedUniversities,
  } = report;

  // Always ensure Campus Square has trademark symbol ™
  const displayEventTitle = (eventTitle || 'Campus Square™ - University Fair')
    .replace(/Campus Square(?!™)/g, 'Campus Square™');

  // Clean up fitReason into a crisp 1-line insight without repetitive blend boilerplate
  const getCleanInsight = (rawReason?: string): string => {
    if (!rawReason) return '';
    const parts = rawReason.split(/\.\s+/);
    const core = parts.length > 1 ? parts.slice(1).join('. ') : parts[0];
    const inIndex = core.search(/\s+in\s+[A-Z]/);
    const trimmed = inIndex !== -1 ? core.substring(0, inIndex) : core;
    return trimmed.trim().replace(/\.+$/, '') + '.';
  };

  // Clean student brief by stripping psychometric acronyms and trait blend jargon
  const cleanStudentBrief = (text?: string): string => {
    if (!text) return '';
    return text
      .replace(/\s*\([A-Z]{1,2}\)/g, '')
      .replace(/\b(ID|SC|DI|DC|DS|IS|IC|SD|SI|CS|CD|CI)\s+style\b/gi, 'profile')
      .replace(/\b(ID|SC|DI|DC|DS|IS|IC|SD|SI|CS|CD|CI)\s+blend\b/gi, 'strengths')
      .replace(/\b(ID|SC|DI|DC|DS|IS|IC|SD|SI|CS|CD|CI)\b(?=\s+trait|\s+profile)/g, '')
      .replace(/\bblend of\s+(?:Influence|Dominance|Steadiness|Conscientiousness)(?:\s+and\s+(?:Influence|Dominance|Steadiness|Conscientiousness))?/gi, 'learning orientation')
      .replace(/\b(Dominance|Influence|Steadiness|Conscientiousness)\s+traits?\b/gi, 'strengths')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  // Group matched universities into High-to-Low Fitment Tiers for clear student & parent understanding
  const fitmentTiers = [
    {
      id: 'tier-strongest',
      title: 'Tier 1: Strongest Fit (Optimal Match)',
      rangeLabel: '92% – 98%',
      parentGuide: 'Highest cognitive & academic alignment with student strengths',
      pillBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      headerGradient: 'bg-gradient-to-r from-emerald-800 via-teal-900 to-[#1e153b] text-white',
      universities: matchedUniversities.filter((u) => u.matchScore >= 92),
    },
    {
      id: 'tier-strong',
      title: 'Tier 2: Strong Fit (High Potential)',
      rangeLabel: '85% – 91%',
      parentGuide: 'High compatibility courses matching secondary problem-solving & communication traits',
      pillBg: 'bg-blue-50 text-blue-800 border-blue-300',
      headerGradient: 'bg-gradient-to-r from-blue-900 via-indigo-950 to-[#1e153b] text-white',
      universities: matchedUniversities.filter((u) => u.matchScore >= 85 && u.matchScore < 92),
    },
    {
      id: 'tier-recommended',
      title: 'Tier 3: Recommended Fit (Exploratory Pathways)',
      rangeLabel: '76% – 84%',
      parentGuide: 'Solid complementary pathways providing balanced career growth & broad foundation',
      pillBg: 'bg-purple-50 text-purple-800 border-purple-300',
      headerGradient: 'bg-gradient-to-r from-purple-900 via-violet-950 to-[#1e153b] text-white',
      universities: matchedUniversities.filter((u) => u.matchScore < 85),
    },
  ].filter((tier) => tier.universities.length > 0);

  return (
    <div className="w-full flex justify-center py-4 print:py-0 bg-slate-100 print:bg-white text-slate-900 font-sans">
      {/* 
        A4 Container:
        Standard A4 dimensions: 210mm x 297mm.
        At screen: constrained to max-w-[820px] to mirror A4 portrait perfectly.
      */}
      <div
        id="official-disc-report-page"
        className="print-page-container bg-white w-full max-w-[800px] p-3.5 sm:p-4 print:p-2.5 shadow-xl print:shadow-none border border-slate-300 print:border-[1.5px] print:border-[#1e153b] rounded-lg print:rounded-none flex flex-col justify-between text-xs leading-tight relative overflow-hidden"
      >
        {/* Subtle Decorative OriginBI Corner Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100/60 to-transparent pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-100/60 to-transparent pointer-events-none -z-0" />

        <div className="relative z-10 flex-1 flex flex-col justify-between">
          {/* ========================================================= */}
          {/* 1. CO-BRANDED HEADER & EVENT IDENTITY                      */}
          {/* ========================================================= */}
          <header className="report-header border-b-[1.5px] border-[#1e153b] pb-1.5 mb-1.5 flex flex-col justify-start">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Campus Square™ Main Logo + Co-branding note */}
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-32 shrink-0">
                  <Image
                    src="/campus-square-logo-transparent.png"
                    alt="Campus Square™"
                    fill
                    className="object-contain object-left"
                    priority
                    unoptimized
                  />
                </div>
                <div className="border-l border-slate-300 pl-2 hidden sm:block">
                  <p className="text-[8.5px] font-bold uppercase tracking-wider text-purple-900 leading-tight">
                    A Joint Collaboration
                  </p>
                  <p className="text-[9.5px] font-extrabold text-[#1e153b] leading-tight">
                    Atom Infinity ✕ OriginBI Mindworks
                  </p>
                </div>
              </div>

              {/* Right: Partner Logos + Confidentiality Badge */}
              <div className="flex items-center gap-2 text-right">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="relative h-6 w-16">
                    <Image
                      src="/atom-logo.png"
                      alt="Atom Infinity"
                      fill
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                  <span className="text-slate-300 font-bold text-xs">✕</span>
                  <div className="relative h-6 w-18">
                    <Image
                      src="/Origin-BI-Logo-01.png"
                      alt="OriginBI"
                      fill
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Title Strip & Document Meta Bar */}
            <div className="mt-1 pt-1 border-t border-slate-150 flex flex-row items-center justify-between gap-1.5">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.2 rounded-full bg-purple-100 text-purple-900 text-[8.5px] font-bold">
                  <BrainCircuit size={10} className="text-purple-700" />
                  <span>Student Academic Potential & Fitment Assessment</span>
                </div>
                <h1 className="text-sm sm:text-base font-heading font-black text-[#1e153b] tracking-tight mt-0.5 leading-tight">
                  University Course Fitment Pathway Report
                </h1>
                <p className="text-[9.5px] text-slate-500 font-semibold flex items-center gap-1">
                  <span>{displayEventTitle}</span>
                  {eventCity && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-purple-900 font-bold">{eventCity} Edition</span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[8.5px] text-slate-600 font-medium shrink-0 flex-wrap">
                <div className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                  <span className="text-slate-400">Ref: </span>
                  <span className="font-mono font-bold text-[#1e153b]">{examRefNo}</span>
                </div>
                <div className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                  <span className="text-slate-400">Edition: </span>
                  <span className="font-bold text-purple-900">{eventCity || 'Tamil Nadu'}</span>
                </div>
                <div className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                  <span className="text-slate-400">Date: </span>
                  <span className="font-semibold text-slate-800">{completedAt}</span>
                </div>
              </div>
            </div>
          </header>

          {/* ========================================================= */}
          {/* 2. CANDIDATE PROFILE & STUDENT BRIEF                       */}
          {/* ========================================================= */}
          <section className="bg-gradient-to-r from-purple-50/70 via-white to-indigo-50/50 rounded-lg p-2 border border-purple-200/80 mb-1">
            <div className="flex flex-row items-stretch gap-2.5">
              {/* Left Column: Student identity & Badges (Fixed 28% width) */}
              <div className="w-[28%] shrink-0 border-r border-purple-200/80 pr-2 flex flex-col justify-center gap-1.5">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[7.5px] uppercase font-bold text-slate-500 tracking-wider">
                      Candidate Profile
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[6.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <ShieldCheck size={7.5} />
                      Verified
                    </span>
                  </div>
                  <h2 className="text-sm font-extrabold text-[#1e153b] break-words mt-0.5 leading-tight">
                    {fullName}
                  </h2>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 font-bold text-[7.5px]">
                    Stream: {stream || 'Higher Secondary'}
                  </span>
                  {archetypeName && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200/60 font-bold text-[7.5px]">
                      {archetypeName} Profile
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Brief About Student & Key Academic Strengths (72% width) */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                {/* Brief About Student */}
                <div className="bg-white/95 rounded p-1.5 border border-purple-150">
                  <p className="text-[7.5px] text-slate-700 leading-snug">
                    <strong className="text-[#1e153b] font-bold">Student Brief: </strong>
                    {cleanStudentBrief(executiveSummary)}
                  </p>
                </div>

                {/* Key Academic & Learning Strengths */}
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <Sparkles size={7.5} className="text-purple-700" />
                    <span className="text-[7px] uppercase font-bold text-purple-900 tracking-wider">
                      Key Academic & Learning Strengths
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {strengths.map((str, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-purple-50 border border-purple-200/70 text-[6.5px] font-semibold text-purple-900"
                      >
                        <CheckCircle2 size={6.5} className="text-purple-600 shrink-0" />
                        <span>{str}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 3. GROUPED UNIVERSITY-WISE PATHWAY MAPPING TABLE          */}
          {/* ========================================================= */}
          <section className="flex-1 flex flex-col justify-start">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1">
                <Award size={10} className="text-purple-800" />
                <h3 className="text-[9.5px] font-heading font-black text-[#1e153b] uppercase tracking-wide">
                  Exhibiting Universities: Matched Programs & Academic Fit Rationale
                </h3>
              </div>
              <span className="text-[8px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.2 rounded-full border border-purple-200">
                {matchedUniversities.length} Universities Mapped
              </span>
            </div>

            {/* Strictly Formatted Grouped Table - 100% Width, Zero Overflow */}
            <div className="w-full border border-slate-250 rounded overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <colgroup>
                  <col className="w-[5%]" />
                  <col className="w-[31%]" />
                  <col className="w-[50%]" />
                  <col className="w-[14%]" />
                </colgroup>
                <thead className="bg-[#1e153b] text-white text-[8px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-0.5 px-1 text-center">#</th>
                    <th className="py-0.5 px-2">University & Campus</th>
                    <th className="py-0.5 px-2">Best-Fit Degree & Student Insight</th>
                    <th className="py-0.5 px-1 text-center">Fitment Match</th>
                  </tr>
                </thead>
                <tbody className="text-[8.5px]">
                  {fitmentTiers.map((tier) => (
                    <React.Fragment key={tier.id}>
                      {/* Tier Divider Header */}
                      <tr className={`${tier.headerGradient} text-white`}>
                        <td colSpan={4} className="py-0.5 px-2">
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1 min-w-0">
                              <span className="font-heading font-black text-[8px] uppercase tracking-wider">
                                {tier.title}
                              </span>
                              <span className="text-[7px] opacity-80 truncate hidden sm:inline">
                                • {tier.parentGuide}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[7px] font-bold bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                                {tier.rangeLabel}
                              </span>
                              <span className="text-[7px] font-semibold bg-white/10 px-1 py-0.2 rounded-full">
                                {tier.universities.length} {tier.universities.length === 1 ? 'College' : 'Colleges'}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Tier University Rows */}
                      {tier.universities.map((uni, idx) => {
                        const isEven = idx % 2 === 0;

                        return (
                          <tr
                            key={uni.universityId}
                            className={`${
                              isEven ? 'bg-white' : 'bg-slate-50/60'
                            } hover:bg-purple-50/50 transition-colors border-b border-slate-150 last:border-b-0`}
                          >
                            {/* Rank # */}
                            <td className="py-0.5 px-1 text-center font-bold font-mono text-slate-500 text-[8px] align-middle">
                              {uni.rank || idx + 1}
                            </td>

                            {/* University & Location - Full Visibility without ellipsis */}
                            <td className="py-0.5 px-2 align-middle">
                              <p className="font-extrabold text-[#1e153b] leading-tight text-[8.5px] break-words">
                                {uni.universityName}
                              </p>
                              <div className="flex items-center gap-1 text-[7px] text-slate-500 font-medium leading-none mt-0.5 flex-wrap">
                                <span>{uni.universityCity}</span>
                                {uni.boothNumber && (
                                  <span className="font-bold text-purple-900 bg-purple-50 px-1 py-0.2 rounded border border-purple-200/50">
                                    Booth #{uni.boothNumber}
                                  </span>
                                )}
                                {uni.isVisited && (
                                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200/60">
                                    ✓ Preferred
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Course, Level, Domain & Plain-English Fit Insight */}
                            <td className="py-0.5 px-2 align-middle">
                              <div className="flex items-center gap-1 flex-wrap leading-tight">
                                <span className="font-bold text-slate-900 text-[8.5px]">
                                  {uni.courseName}
                                </span>
                                <span className="text-[6.5px] font-bold text-slate-600 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                                  {uni.level || 'UG'}
                                </span>
                                <span className="text-[6.5px] font-semibold text-purple-800 bg-purple-50 px-1 py-0.2 rounded border border-purple-200/60">
                                  {uni.category}
                                </span>
                              </div>
                              {uni.fitReason && (
                                <p className="text-[7px] text-slate-600 leading-tight mt-0.5 break-words">
                                  <span className="font-bold text-purple-900">Why it matches: </span>
                                  {getCleanInsight(uni.fitReason)}
                                </p>
                              )}
                            </td>

                            {/* Match Score & Fit Pill */}
                            <td className="py-0.5 px-1 text-center align-middle">
                              <div className="inline-flex flex-col items-center justify-center">
                                <span className="font-mono font-black text-[#1e153b] text-[9px] leading-tight">
                                  {uni.matchScore}%
                                </span>
                                <span
                                  className={`text-[6.5px] font-extrabold px-1.5 py-0.2 rounded-full leading-none border mt-0.5 whitespace-nowrap ${tier.pillBg}`}
                                >
                                  {tier.id === 'tier-strongest'
                                    ? 'Strongest Fit'
                                    : tier.id === 'tier-strong'
                                    ? 'Strong Fit'
                                    : 'Recommended'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 4. ACADEMIC ADVISORY & FAIR COUNSELING STRIP              */}
          {/* ========================================================= */}
          <section className="grid grid-cols-2 gap-1.5 mt-1 pt-1 border-t border-slate-200">
            <div className="p-1 rounded bg-slate-50 border border-slate-200">
              <p className="text-[8px] font-bold text-[#1e153b] uppercase flex items-center gap-1">
                <Compass size={8.5} className="text-purple-700" />
                <span>Advisory for University Booth Visits</span>
              </p>
              <p className="text-[7px] text-slate-600 mt-0.5 leading-snug">
                Present this verified 1-page profile at each university booth. Admissions deans prioritize candidates with documented academic strengths and career clarity for merit scholarships.
              </p>
            </div>

            <div className="p-1 rounded bg-purple-50/60 border border-purple-200/70">
              <p className="text-[8px] font-bold text-purple-950 uppercase flex items-center gap-1">
                <Sparkles size={8.5} className="text-purple-700" />
                <span>Career Architecture Recommendation</span>
              </p>
              <p className="text-[7px] text-slate-700 mt-0.5 leading-snug">
                Focus course inquiries on hands-on project studios and leadership tracks that activate your {archetypeName} profile strengths.
              </p>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 5. FOOTER & TRADEMARK CERTIFICATION                       */}
          {/* ========================================================= */}
          <footer className="report-footer mt-1 pt-1 border-t border-slate-300 flex items-center justify-between text-[7px] text-slate-500 font-medium">
            <div>
              <span className="font-bold text-[#1e153b]">Campus Square™ - A University Fair Series</span>
              <span className="mx-1">•</span>
              <span>A Joint Collaboration by Atom Infinity and OriginBI Mindworks</span>
            </div>
            <div className="font-mono text-purple-900 font-bold">
              Powered by OriginBI™ Behavioral Assessment Engine
            </div>
            <div className="font-bold text-slate-700">
              Page 1 of 1 (Strictly Confidential)
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
