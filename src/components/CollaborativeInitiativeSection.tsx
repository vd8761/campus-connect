import React from 'react';
import Image from 'next/image';
import { Sparkles, School, Brain, CheckCircle2, ArrowRight } from 'lucide-react';

interface CollaborativeInitiativeSectionProps {
  className?: string;
  showBottomCta?: boolean;
}

export function CollaborativeInitiativeSection({ className = '', showBottomCta = true }: CollaborativeInitiativeSectionProps) {
  return (
    <section className={`py-20 bg-slate-50 border-t border-brand-border/60 relative overflow-hidden ${className}`} id="collaborative-initiative">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-turquoise/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-purple/20">
            <Sparkles size={14} className="text-brand-purple" />
            <span>Joint Collaboration</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-brand-navy tracking-tight mb-4">
            Two Pioneering Forces. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-[image:var(--primary-gradient)]">One Unified Mission.</span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            Campus Square™ - A University Fair Series, a joint collaboration by Atom Infinity and Origin Bi, bringing schools and universities together to connect students with higher education opportunities.
          </p>
        </div>

        {/* Two-Column Editorial Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Atom Infinity */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-border/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-400 rounded-t-3xl"></div>

            <div>
              {/* Partner Logo Card */}
              <div className="h-16 w-44 relative mb-6 p-2 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center">
                <Image
                  src="/atom-logo.png"
                  alt="Atom Infinity"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">
                School Leadership & Educational Network
              </div>

              <h3 className="text-2xl font-heading font-bold text-brand-navy mb-3">
                Atom Infinity
              </h3>

              <p className="text-brand-muted text-sm leading-relaxed mb-6">
                A premier educational initiatives platform dedicated to empowering school leaders, trustees, and educators across India. Atom Infinity facilitates high-impact academic conclaves and institutional collaborations that elevate school communities.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    Trusted network of prominent K-12 school principals and trustees.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    Editions hosted directly inside schools for maximum trust and comfort.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    Bridge connecting senior school leadership with higher education.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: OriginBI Mindworks */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-border/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-t-3xl"></div>

            <div>
              {/* Partner Logo Card */}
              <div className="h-16 w-44 relative mb-6 p-2 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center">
                <Image
                  src="/Origin-BI-Logo-01.png"
                  alt="OriginBI Mindworks"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-3">
                Behavioral Intelligence & Student Clarity
              </div>

              <h3 className="text-2xl font-heading font-bold text-brand-navy mb-3">
                OriginBI Mindworks
              </h3>

              <p className="text-brand-muted text-sm leading-relaxed mb-6">
                A people-first career clarity platform using scientific behavioral assessments to reveal genuine student aptitudes, natural working styles, and intrinsic motivators before they commit to university streams.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    Complimentary scientific assessment (Worth ₹1,499) for all fair attendees.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    Personalised single-page PDF career snapshot downloadable on event day.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    Confidence for students and clarity for parents choosing university majors.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Unity Card */}
        <div className="bg-gradient-to-r from-brand-navy via-[#260835] to-brand-navy rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-white/10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="text-center md:text-left max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-turquoise mb-1.5 block">
                Official Joint Collaboration
              </span>
              <h4 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">
                Atom Infinity ✕ OriginBI Mindworks
              </h4>
              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
                Campus Square™ unites institutional school leadership and behavioral student insights into a seamless higher education event series. Together, we empower students, parents, schools, and university admissions teams under one trusted banner.
              </p>
            </div>

            {/* Combined Logo Card */}
            <div className="flex items-center gap-4 shrink-0 bg-white px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl shadow-2xl border border-white/20">
              <div className="relative h-9 w-28 sm:h-10 sm:w-32">
                <Image src="/atom-logo.png" alt="Atom Infinity" fill unoptimized className="object-contain" />
              </div>
              <span className="text-brand-navy font-black text-base sm:text-lg">✕</span>
              <div className="relative h-9 w-28 sm:h-10 sm:w-32">
                <Image src="/Origin-BI-Logo-01.png" alt="OriginBI Mindworks" fill unoptimized className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
