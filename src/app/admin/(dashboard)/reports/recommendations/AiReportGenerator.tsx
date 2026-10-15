'use client';

import { useState } from 'react';
import { generateAiCourseMapping } from './actions';
import { Button } from '@/components/ui/Button';
import { Sparkles, Printer, AlertCircle, CheckCircle2, Award } from 'lucide-react';

interface AiReportGeneratorProps {
  participantId: string;
  initialData?: {
    profileType: string;
    primaryTrait: string;
    recommendations: any[];
  } | null;
}

export function AiReportGenerator({ participantId, initialData }: AiReportGeneratorProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<any>(initialData || null);

  async function handleGenerate() {
    setIsPending(true);
    setError('');
    
    const result = await generateAiCourseMapping(participantId);
    
    if (!result || result.error) {
      setError(result?.error || 'Failed to generate recommendations.');
    } else {
      setReport(result);
    }
    
    setIsPending(false);
  }

  if (report && report.recommendations && report.recommendations.length > 0) {
    return (
      <div className="bg-white rounded-2xl border border-brand-purple/20 overflow-hidden shadow-2xs">
        <div className="bg-gradient-to-r from-purple-50/80 via-white to-teal-50/60 p-6 border-b border-brand-purple/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Course Mapping Report</span>
            </div>
            <h3 className="font-heading font-extrabold text-brand-navy flex items-center gap-2 text-lg md:text-xl">
              <span>Curated Academic Pathways</span>
            </h3>
            <p className="text-xs md:text-sm text-brand-muted mt-0.5">
              Optimized for DISC Profile:{' '}
              <span className="font-bold text-brand-purple">{report.profileType}</span>
              {report.primaryTrait && (
                <span className="text-slate-400 ml-1.5">({report.primaryTrait} Primary)</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.print()}
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 text-xs font-semibold"
            >
              <Printer size={14} />
              <span>Print Report</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGenerate} 
              disabled={isPending}
              isLoading={isPending}
              loadingText="Analyzing..."
              className="rounded-xl border-brand-purple/30 text-brand-purple hover:bg-brand-purple/10 gap-1.5 text-xs font-bold"
            >
              <Sparkles size={14} />
              <span>Regenerate</span>
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-purple" />
              <span>Top Recommended Courses ({report.recommendations.length})</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Matched from attended university booths
            </span>
          </div>

          <div className="space-y-4">
            {report.recommendations.map((rec: any, idx: number) => (
              <div 
                key={rec.courseId || idx} 
                className="bg-brand-light/40 rounded-xl p-5 border border-brand-border/70 hover:border-brand-purple/30 transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-extrabold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h5 className="font-bold text-brand-navy text-base">{rec.courseName}</h5>
                    {rec.matchPercent && (
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        {rec.matchPercent}% Match
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-brand-muted font-medium flex flex-wrap items-center gap-1.5">
                    <strong className="text-brand-navy font-semibold">{rec.universityName}</strong>
                    <span>•</span>
                    <span className="text-brand-purple font-semibold">{rec.category}</span>
                    <span>•</span>
                    <span className="text-slate-500">{rec.level}</span>
                  </p>

                  <div className="mt-3 bg-white/90 p-3 rounded-lg border border-brand-border/60 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-brand-purple mr-1.5">AI Match Analysis:</span>
                    <span>{rec.matchReason}</span>
                  </div>
                </div>

                <div className="w-full md:w-44 shrink-0 flex flex-col justify-center">
                  <div className="bg-white border border-brand-border/80 rounded-xl p-3 text-center shadow-2xs">
                    <p className="text-[10px] text-brand-muted font-bold mb-1 uppercase tracking-wider">Target Admission Margin</p>
                    <div className="font-extrabold text-brand-purple text-base flex items-center justify-center gap-1">
                      {rec.marginType === 'FIXED' ? (
                         <><span>₹</span>{Number(rec.marginValue).toLocaleString('en-IN')}</>
                      ) : (
                         <>{rec.marginValue}%</>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-border/80 p-8 text-center shadow-2xs">
      <div className="w-16 h-16 bg-brand-purple/10 text-brand-purple rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-purple/20">
        <Sparkles className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-heading font-bold text-brand-navy mb-2">Generate Course Mapping</h3>
      <p className="text-brand-muted max-w-md mx-auto mb-6 text-sm">
        Use Claude AI to synthesize the student's Origin BI DISC psychometric profile against the courses offered by their visited university booths.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 flex items-center justify-center gap-2 max-w-md mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button 
        onClick={handleGenerate} 
        disabled={isPending} 
        isLoading={isPending}
        loadingText="Synthesizing Profiles & Courses..."
        variant="gradient"
        className="px-8 rounded-xl font-bold shadow-sm hover:shadow-md h-11"
      >
        Generate AI Report
      </Button>
    </div>
  );
}
