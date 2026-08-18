import prisma from '@/lib/prisma';
import { AiReportGenerator } from './AiReportGenerator';
import { Users, FileText, CheckCircle2 } from 'lucide-react';
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
      }
    });

    if (studentId) {
      selectedStudent = await prisma.participant.findUnique({
        where: { id: studentId },
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
    console.warn("Database connection failed on Recommendations page (Network blocked). Showing empty state.");
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-brand-navy">AI Recommendations</h1>
        <p className="text-brand-muted mt-1">Generate course mappings based on Origin BI DISC Assessments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Student List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm h-[calc(100vh-200px)] flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-brand-navy flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-teal" />
                Eligible Students
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {students.length > 0 ? (
                students.map(student => (
                  <Link 
                    key={student.id} 
                    href={`/admin/reports/recommendations?studentId=${student.id}`}
                    className={`block p-3 rounded-xl mb-1 transition-colors ${studentId === student.id ? 'bg-brand-teal/10 border border-brand-teal/20' : 'hover:bg-gray-50 border border-transparent'}`}
                  >
                    <div className="font-medium text-brand-navy">{student.fullName}</div>
                    <div className="flex gap-3 text-xs text-brand-muted mt-1">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Profile: {student.assessmentResult?.primaryTrait}</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {student._count.boothVisits} Booths</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center p-6 text-brand-muted text-sm">
                  No students found with both an assessment and booth visits.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Generation */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="space-y-6">
              {/* Student Overview */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-heading font-bold text-brand-navy mb-4">{selectedStudent.fullName}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Assessment Profile</p>
                    <p className="font-bold text-brand-purple">{selectedStudent.assessmentResult?.profileType}</p>
                    <p className="text-sm font-medium mt-1">Primary Trait: {selectedStudent.assessmentResult?.primaryTrait}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Visited Universities</p>
                    <ul className="text-sm font-medium space-y-1">
                      {selectedStudent.boothVisits.map((visit: any) => (
                        <li key={visit.id} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {visit.university.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI Generator */}
              <AiReportGenerator participantId={selectedStudent.id} />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 h-full flex flex-col items-center justify-center p-8 text-center shadow-sm">
              <Users className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="text-xl font-heading font-bold text-brand-navy mb-2">Select a Student</h3>
              <p className="text-brand-muted max-w-md">
                Choose a student from the list to view their DISC profile, visited booths, and generate AI course recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
