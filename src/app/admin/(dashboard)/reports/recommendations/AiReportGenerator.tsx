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
      <div className="bg-white rounded-2xl border border-brand-purple/20 overflow-hidden shadow-sm">
        <div className="bg-brand-purple/5 p-6 border-b border-brand-purple/10 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-brand-navy flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-purple" />
              Claude AI Recommendation Report
            </h3>
            <p className="text-sm text-brand-muted mt-1">Based on student's DISC profile: <span className="font-semibold text-brand-purple">{report.profileType}</span></p>
          </div>
          <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isPending}>
            Regenerate
          </Button>
        </div>

        <div className="p-6">
          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Recommended Courses</h4>
          <div className="space-y-4">
            {report.recommendations.map((rec: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <h5 className="font-bold text-brand-navy">{rec.courseName}</h5>
                  <p className="text-sm text-brand-muted">{rec.universityName} • {rec.category} • {rec.level}</p>
                  <p className="text-sm mt-3 text-brand-navy/80 italic">"{rec.matchReason}"</p>
                </div>
                <div className="md:w-48 shrink-0 flex flex-col justify-center">
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Margin</p>
                    <div className="font-bold text-brand-teal flex items-center justify-center gap-1">
                      {rec.marginType === 'FIXED' ? (
                         <><DollarSign className="w-4 h-4" /> ₹{rec.marginValue}</>
                      ) : (
                         <><Percent className="w-4 h-4" /> {rec.marginValue}%</>
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
    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
      <div className="w-16 h-16 bg-brand-purple/10 text-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-heading font-bold text-brand-navy mb-2">Generate Course Mapping</h3>
      <p className="text-brand-muted max-w-md mx-auto mb-6">
        Use Claude AI to analyze the student's Origin BI DISC assessment against the courses offered by the booths they visited.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center justify-center gap-2 max-w-md mx-auto">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <Button onClick={handleGenerate} disabled={isPending} className="px-8">
        {isPending ? 'Analyzing Profiles...' : 'Generate AI Report'}
      </Button>
    </div>
  );
}
