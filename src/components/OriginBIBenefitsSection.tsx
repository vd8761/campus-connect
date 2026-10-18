import React from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  Mail, 
  FileCheck2, 
  CheckCircle2, 
  Sparkles, 
  Gift, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Share2,
  Compass,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ORIGINBI_ASSESSMENT_AMOUNT } from '@/lib/constants';

interface OriginBIBenefitsSectionProps {
  eventSlug?: string;
  isRegistrationOpen?: boolean;
}

export function OriginBIBenefitsSection({ eventSlug, isRegistrationOpen = true }: OriginBIBenefitsSectionProps) {
  const steps = [
    {
      step: "01",
      title: "Automatic Registration",
      desc: "No separate form is required. Registration for the event also registers the student for the OriginBI Assessment.",
      icon: UserCheck,
      badge: "Zero Extra Effort",
      accent: "text-purple-600 bg-purple-50 border-purple-200"
    },
    {
      step: "02",
      title: "Email Invitation",
      desc: "The student receives an email with a secure link to take the assessment at a convenient time.",
      icon: Mail,
      badge: "Take Anytime",
      accent: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      step: "03",
      title: "Personalised Result",
      desc: "After completing the assessment, the student gets a downloadable single-page PDF containing their assessment result and key insights on the university fair day spot.",
      icon: FileCheck2,
      badge: "On-Spot Fair Day PDF",
      accent: "text-teal-600 bg-teal-50 border-teal-200"
    }
  ];

  const studentGains = [
    {
      title: "Early clarity on natural strengths",
      desc: "Discover what academic environments and roles suit you naturally before picking a college major.",
      icon: Lightbulb
    },
    {
      title: "Practical 1-page reference document",
      desc: "A concise, objective summary you can easily share with parents, counselors, and school teachers.",
      icon: Share2
    },
    {
      title: "Aligned study & career pathways",
      desc: "Connect your innate capabilities directly with high-demand degree programs and university streams.",
      icon: Compass
    },
    {
      title: "Reduced risk of wrong stream choice",
      desc: "Avoid the stress and costly mistake of selecting an ill-fitting degree or curriculum under peer pressure.",
      icon: AlertTriangle
    },
    {
      title: "Confident decisions during & after the fair",
      desc: "Walk up to university admissions officers knowing your exact profile, strengths, and career ambitions.",
      icon: TrendingUp
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-brand-light via-white to-brand-light border-y border-brand-border/70 relative overflow-hidden" id="student-benefits">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Main Section Header with Premium Brand-Integrated Badge */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border/90 shadow-xs mb-5 hover:border-brand-purple/40 transition-colors text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-brand-purple">
              <Sparkles size={13} className="text-brand-purple" />
              OriginBI Assessment
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-brand-navy">
              Worth ₹{ORIGINBI_ASSESSMENT_AMOUNT}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-brand-purple">
              100% Free with Registration
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-brand-navy tracking-tight mb-4">
            How Students Benefit from <span className="text-transparent bg-clip-text bg-[image:var(--primary-gradient)]">Campus Square™</span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            When a student registers for a Campus Square™ university fair edition, they are <strong className="text-brand-navy font-semibold">automatically registered for the OriginBI Assessment</strong>.
          </p>
        </div>

        {/* 3-Step Process Cards */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-brand-navy">
              Here’s What Happens Next
            </h3>
            <p className="text-sm text-brand-muted mt-1">
              A seamless, three-step journey from event check-in to personal career clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {steps.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-7 border border-brand-border/80 shadow-sm hover:shadow-xl hover:border-brand-purple/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-heading font-black text-brand-purple/20 group-hover:text-brand-purple/40 transition-colors">
                    {item.step}
                  </span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.accent}`}>
                    {item.badge}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-navy mb-4 group-hover:bg-brand-purple group-hover:text-white transition-colors duration-300">
                    <item.icon size={22} />
                  </div>
                  <h4 className="text-lg font-heading font-bold text-brand-navy mb-2.5">
                    {item.title}
                  </h4>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-brand-purple font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Complimentary Benefit (₹{ORIGINBI_ASSESSMENT_AMOUNT} Free)</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm font-medium text-brand-navy/80 mt-6 max-w-2xl mx-auto bg-purple-50/60 py-3 px-6 rounded-2xl border border-purple-100">
            ✨ This process is designed to be simple and student-friendly, so every participant walks away with something useful beyond the event itself.
          </p>
        </div>

        {/* Why This Matters for Students */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-border/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-turquoise/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              Long-Term Academic Impact
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy mt-1 mb-3">
              Why This Matters for Students
            </h3>
            <p className="text-brand-muted text-base leading-relaxed">
              Most students choose streams and courses based on trends, peer pressure, or limited information. The <strong className="text-brand-navy">OriginBI Assessment</strong> helps them pause and understand themselves first.
            </p>
          </div>

          {/* Student Gains Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {studentGains.map((gain, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-brand-light/70 border border-brand-border/60 hover:bg-white hover:border-brand-purple/40 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-3">
                    <gain.icon size={18} />
                  </div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-brand-navy mb-1.5">
                    {gain.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {gain.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Price & Summary Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-navy to-[#261047] text-white flex flex-col justify-between shadow-md sm:col-span-2 lg:col-span-1">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-turquoise mb-2">
                  <ShieldCheck size={16} />
                  <span>100% Free for Attendees</span>
                </div>
                <div className="text-2xl font-heading font-extrabold mb-1">
                  Value: <span className="line-through text-white/50 text-xl mr-1.5">₹{ORIGINBI_ASSESSMENT_AMOUNT}</span>
                  <span className="text-brand-turquoise">FREE</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed mt-2">
                  Combined with direct interactions with universities and education leaders at Campus Square™, the assessment gives students both external opportunities and internal clarity.
                </p>
              </div>

              {eventSlug && isRegistrationOpen && (
                <div className="mt-4 pt-3.5 border-t border-white/10">
                  <Link href={`/events/${eventSlug}/register`} className="block w-full">
                    <button
                      type="button"
                      className="w-full h-10 rounded-xl px-4 text-xs sm:text-sm font-bold bg-white !text-brand-navy hover:bg-slate-100 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="!text-brand-navy font-bold">Claim Free Assessment</span>
                      <ArrowRight size={15} className="!text-brand-purple shrink-0" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-border/80 shadow-xs text-xs sm:text-sm text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-brand-purple" />
              </div>
              <p className="font-medium leading-relaxed text-slate-700">
                <strong className="text-brand-navy font-bold">Joint Collaboration:</strong> Atom Infinity & OriginBI Mindworks deliver this behavioural clarity assessment at zero extra cost to every registered attendee.
              </p>
            </div>
            <div className="shrink-0 flex items-center self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20 whitespace-nowrap shadow-2xs">
                <ShieldCheck size={14} className="text-brand-purple" />
                <span>No Hidden Charges</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
