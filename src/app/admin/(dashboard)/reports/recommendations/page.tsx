import prisma from '@/lib/prisma';
import { BrainCircuit } from 'lucide-react';
import { DiscProfilesTable } from './DiscProfilesTable';

export const dynamic = 'force-dynamic';

export default async function DiscReportsPage() {
  let allStudents: any[] = [];

  try {
    allStudents = await prisma.participant.findMany({
      include: {
        assessmentResult: true,
        boothVisits: {
          include: {
            university: true,
            event: true,
          },
        },
        _count: {
          select: { boothVisits: true },
        },
      },
      orderBy: [{ assessmentResult: { completedAt: 'desc' } }, { fullName: 'asc' }],
    });
  } catch (error) {
    console.warn('Database query failed on DISC reports page:', error);
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Clean Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold mb-2">
            <BrainCircuit size={14} />
            <span>Origin BI Behavioral Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy tracking-tight">
            DISC Behavioral Profiles
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Psychometric evaluations, raw DISC scores, and Origin BI value-wise breakdowns.
          </p>
        </div>
      </div>

      {/* Full-Width Interactive Data Table */}
      <DiscProfilesTable participants={allStudents} />
    </div>
  );
}
