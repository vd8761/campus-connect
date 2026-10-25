import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDiscCourseMatches } from '@/lib/recommendations/discCourseMatcher';
import { OnePageDiscUniversityReport } from '@/components/reports/OnePageDiscUniversityReport';
import { DiscReportPrintControls } from '@/components/reports/DiscReportPrintControls';
import { AlertCircle, ArrowLeft, BrainCircuit } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ participantId: string }>;
  searchParams?: Promise<{ eventId?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { participantId } = await params;
  const search = searchParams ? await searchParams : {};
  const report = await getDiscCourseMatches(participantId, search.eventId);

  if (!report) {
    return {
      title: 'DISC Fitment Report | Campus Square™',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `University Fitment Report - ${report.fullName} (${report.archetypeName}) | Campus Square™`,
    description: `Official ${report.totalUniversitiesCount}-University behavioral fitment pathway report for ${report.fullName} based on OriginBI psychometric DISC assessment.`,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export default async function DiscFitmentReportPage({ params, searchParams }: PageProps) {
  const { participantId } = await params;
  const search = searchParams ? await searchParams : {};
  const report = await getDiscCourseMatches(participantId, search.eventId);

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle size={28} />
          </div>
          <div>
            <h2 className="text-xl font-heading font-extrabold text-brand-navy">
              Assessment Report Unavailable
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              This candidate either has not completed the OriginBI psychometric DISC assessment yet,
              or the participant record could not be found.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/reports/recommendations"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-purple-800 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Return to DISC Profiles</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Print stylesheet to enforce strictly 1-page A4 formatting */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 4mm 5mm !important;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                height: auto !important;
              }
              .no-print {
                display: none !important;
              }
              .print-page-container header,
              .print-page-container footer,
              .report-header,
              .report-footer {
                display: flex !important;
                visibility: visible !important;
              }
              .print-page-container {
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                margin: 0 auto !important;
                padding: 2.5mm 3.5mm !important;
                border: 1px solid #1e153b !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                box-sizing: border-box !important;
              }
              thead {
                display: table-row-group !important;
              }
            }
          `,
        }}
      />

      {/* Screen Toolbar Controls */}
      <DiscReportPrintControls
        participantName={report.fullName}
        archetypeName={report.archetypeName}
      />

      {/* 1-Page Report Preview */}
      <main className="flex-1 flex justify-center items-start p-4 sm:p-6 print:p-0">
        <OnePageDiscUniversityReport report={report} />
      </main>
    </div>
  );
}
