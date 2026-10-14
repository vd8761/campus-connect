'use client';

import { useState } from 'react';
import { generateAiCourseMapping } from './actions';
import { Button } from '@/components/ui/Button';
import { Sparkles, DollarSign, Percent, AlertCircle } from 'lucide-react';

export function AiReportGenerator({ participantId }: { participantId: string }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<any>(null);

  async function handleGenerate() {
    setIsPending(true);
    setError('');
    
    const result = await generateAiCourseMapping(participantId);
    
    if (result.error) {
      setError(result.error);
    } else {
      setReport(result);
    }
    
    setIsPending(false);
  }

  if (report) {
    return (
      <div className="bg-white rounded-2xl border border-brand-purple/20 overflow-hidden shadow-2xs">
        <div className="bg-brand-purple/5 p-6 border-b border-brand-purple/15 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-brand-navy flex items-center gap-2 text-base md:text-lg">
              <Sparkles className="w-5 h-5 text-brand-purple" />
              <span>Claude AI Recommendation Report</span>
            </h3>
            <p className="text-xs md:text-sm text-brand-muted mt-1">
              Optimized for DISC Profile: <span className="font-bold text-brand-purple">{report.profileType}</span>
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerate} 
            disabled={isPending}
            className="rounded-xl border-brand-purple/30 text-brand-purple hover:bg-brand-purple/10"
          >
            {isPending ? 'Regenerating...' : 'Regenerate'}
          </Button>
        </div>

        <div className="p-6">
          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4">
            Curated Programs ({report.recommendations.length})
          </h4>
          <div className="space-y-4">
            {report.recommendations.map((rec: any, idx: number) => (
              <div key={idx} className="bg-brand-light/40 rounded-xl p-5 border border-brand-border/70 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h5 className="font-bold text-brand-navy text-base">{rec.courseName}</h5>
                  </div>
                  <p className="text-xs text-brand-muted mt-1 font-medium">
                    {rec.universityName} • <span className="text-brand-purple">{rec.category}</span> • {rec.level}
                  </p>
                  <p className="text-xs mt-3 text-slate-700 italic bg-white/70 p-3 rounded-lg border border-brand-border/40">
                    "{rec.matchReason}"
                  </p>
                </div>
                <div className="w-full md:w-44 shrink-0 flex flex-col justify-center">
                  <div className="bg-white border border-brand-border/80 rounded-xl p-3 text-center shadow-2xs">
                    <p className="text-[10px] text-brand-muted font-bold mb-1 uppercase tracking-wider">Target Margin</p>
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
        Use Claude AI to analyze the student's Origin BI DISC assessment against the courses offered by the university booths they visited.
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
        variant="gradient"
        className="px-8 rounded-xl font-bold shadow-sm hover:shadow-md h-11"
      >
        {isPending ? 'Analyzing Profiles & Courses...' : 'Generate AI Report'}
      </Button>
    </div>
  );
}
