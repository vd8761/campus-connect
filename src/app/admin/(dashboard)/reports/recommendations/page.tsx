import prisma from '@/lib/prisma';
import { AiReportGenerator } from './AiReportGenerator';
import { Users, FileText, CheckCircle2, Building2, BrainCircuit, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RecommendationsReportPage({ searchParams }: { searchParams: { studentId?: string } }) {
  const { studentId } = await searchParams;

  let students: any[] = [];
  let selectedStudent = null;

  try {
    // Get all students who have completed the assessment AND visited booths
    students = await prisma.participant.findMany({
      where: {
        assessmentResult: { isNot: null },
        boothVisits: { some: {} }
      },
      include: {
        assessmentResult: true,
        _count: {
          select: { boothVisits: true }
        }
      },
      orderBy: { fullName: 'asc' }
    });

    const activeId = studentId || (students.length > 0 ? students[0].id : null);

    if (activeId) {
      selectedStudent = await prisma.participant.findUnique({
        where: { id: activeId },
        include: {
          assessmentResult: true,
          boothVisits: {
            include: {
              university: true,
              event: true
            }
          }
        }
      });
    }
  } catch (error) {
    console.warn("Database connection failed on Recommendations page. Showing fallback.");
  }

  const activeStudentId = selectedStudent?.id;

  const getTraitBadge = (trait: string) => {
    switch (trait?.toLowerCase()) {
      case 'dominance':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'influence':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'steadiness':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'compliance':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-brand-purple/10 text-brand-purple border-brand-purple/20';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-brand-border/80 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold mb-2">
            <BrainCircuit size={14} />
            <span>Origin BI DISC Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy tracking-tight">
            AI Course Recommendations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Synthesize behavioral DISC psychometrics with attended university booths to generate personalized course mappings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-brand-border/80 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 md:p-5 border-b border-brand-border/60 bg-brand-light/30 flex items-center justify-between">
            <h2 className="font-heading font-bold text-brand-navy flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-brand-purple" />
              <span>Eligible Students ({students.length})</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              DISC Complete
            </span>
          </div>
          
          <div className="divide-y divide-brand-border/40 max-h-[600px] overflow-y-auto no-scrollbar">
            {students.length > 0 ? (
              students.map(student => {
                const isSelected = activeStudentId === student.id;
                const trait = student.assessmentResult?.primaryTrait || 'General';
                const initials = student.fullName
                  ? student.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
                  : 'S';

                return (
                  <Link 
                    key={student.id} 
                    href={`/admin/reports/recommendations?studentId=${student.id}`}
                    className={`block p-4 transition-all duration-150 ${
                      isSelected 
                        ? 'bg-brand-purple/10 border-l-4 border-l-brand-purple border-b border-brand-border/40' 
                        : 'hover:bg-brand-light/50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected 
                          ? 'bg-brand-purple text-white shadow-xs' 
                          : 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20'
                      }`}>
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-brand-navy text-sm truncate">
                            {student.fullName}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTraitBadge(trait)}`}>
                            {trait}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-brand-muted mt-1">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Building2 className="w-3 h-3 text-brand-purple" /> 
                            {student._count.boothVisits} Booths
                          </span>
                          <span className="text-[11px] truncate text-slate-500">
                            {student.stream || student.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center p-8 text-brand-muted">
                <Users size={32} className="mx-auto text-brand-muted/40 mb-2" />
                <p className="font-bold text-brand-navy text-sm">No eligible students found</p>
                <p className="text-xs text-brand-muted mt-1">
                  Students will appear once they complete an assessment and scan booths.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Generation (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedStudent ? (
            <>
              {/* Student Overview Card */}
              <div className="bg-white rounded-2xl border border-brand-border/80 p-6 md:p-7 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-brand-border/60">
                  <div>
                    <h2 className="text-xl md:text-2xl font-heading font-extrabold text-brand-navy tracking-tight">
                      {selectedStudent.fullName}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span>{selectedStudent.email}</span>
                      <span>•</span>
                      <span>{selectedStudent.mobile}</span>
                      {selectedStudent.currentStandard && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-brand-purple">{selectedStudent.currentStandard}</span>
                        </>
                      )}
                    </p>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getTraitBadge(selectedStudent.assessmentResult?.primaryTrait || '')}`}>
                    <GraduationCap size={13} />
                    <span>{selectedStudent.assessmentResult?.profileType || 'Student'}</span>
                  </span>
                </div>

                {/* 2 Grid Cards: DISC Breakdown & Visited Booths */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  {/* DISC Breakdown */}
                  <div className="p-4 bg-brand-light/40 rounded-xl border border-brand-border/70">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2.5">
                      DISC Psychometric Scores
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-white p-2.5 rounded-lg border border-brand-border/60">
                        <span className="text-[10px] font-bold text-rose-600 block">D</span>
                        <span className="text-base font-extrabold text-brand-navy">
                          {Math.round(selectedStudent.assessmentResult?.scoreD || 0)}%
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-brand-border/60">
                        <span className="text-[10px] font-bold text-purple-600 block">I</span>
                        <span className="text-base font-extrabold text-brand-navy">
                          {Math.round(selectedStudent.assessmentResult?.scoreI || 0)}%
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-brand-border/60">
                        <span className="text-[10px] font-bold text-emerald-600 block">S</span>
                        <span className="text-base font-extrabold text-brand-navy">
                          {Math.round(selectedStudent.assessmentResult?.scoreS || 0)}%
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-brand-border/60">
                        <span className="text-[10px] font-bold text-blue-600 block">C</span>
                        <span className="text-base font-extrabold text-brand-navy">
                          {Math.round(selectedStudent.assessmentResult?.scoreC || 0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visited Universities */}
                  <div className="p-4 bg-brand-light/40 rounded-xl border border-brand-border/70">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2.5">
                      Visited Booths ({selectedStudent.boothVisits.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-[76px] overflow-y-auto no-scrollbar">
                      {selectedStudent.boothVisits.map((visit: any) => (
                        <span 
                          key={visit.id} 
                          className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white px-2.5 py-1 rounded-lg border border-brand-border/60 text-brand-navy"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate max-w-[170px]">{visit.university.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Report Generator Box */}
              <AiReportGenerator participantId={selectedStudent.id} />
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-brand-border/80 h-80 flex flex-col items-center justify-center p-8 text-center shadow-2xs">
              <div className="w-16 h-16 bg-brand-purple/10 text-brand-purple rounded-2xl flex items-center justify-center mb-4 border border-brand-purple/20">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-brand-navy mb-2">Select a Student</h3>
              <p className="text-brand-muted max-w-md text-sm">
                Choose a student from the list to view their DISC profile, visited booths, and generate AI course recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
