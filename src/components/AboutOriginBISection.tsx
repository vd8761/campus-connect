import React from 'react';
import Image from 'next/image';
import { Sparkles, Brain, Compass, Target, Award, ArrowUpRight } from 'lucide-react';

export function AboutOriginBISection() {
  const pillars = [
    {
      title: "Natural Strengths & Working Style",
      desc: "Uncovers inherent talents and natural problem-solving approaches to identify learning environments where students thrive.",
      icon: Brain,
      gradient: "from-purple-500/10 to-indigo-500/10",
      accent: "text-purple-600",
    },
    {
      title: "Motivation & Energy Drivers",
      desc: "Reveals the internal motivators and passion points that sustain student curiosity, persistence, and long-term ambition.",
      icon: Compass,
      gradient: "from-blue-500/10 to-cyan-500/10",
      accent: "text-blue-600",
    },
    {
      title: "Behavioural Patterns Across Situations",
      desc: "Evaluates how students adapt to collaboration, pressure, leadership, and change across academic and real-world scenarios.",
      icon: Target,
      gradient: "from-teal-500/10 to-emerald-500/10",
      accent: "text-teal-600",
    },
    {
      title: "Areas of Growth & Alignment",
      desc: "Maps personal competencies against emerging university majors and careers to ensure informed, confident stream choices.",
      icon: Award,
      gradient: "from-amber-500/10 to-orange-500/10",
      accent: "text-amber-600",
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-brand-border/60 relative overflow-hidden" id="about-originbi">
      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-turquoise/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-purple/20">
            <Sparkles size={14} className="text-brand-purple" />
            <span>Behavioural Intelligence Partner</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-brand-navy tracking-tight mb-5">
            About <span className="text-transparent bg-clip-text bg-[image:var(--primary-gradient)]">OriginBI Mindworks</span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            <strong className="text-brand-navy font-semibold">OriginBI Mindworks</strong> is a people-first career clarity platform that helps students understand themselves better before they choose streams, courses, or careers.
          </p>
        </div>

        {/* Core Value Proposition Card */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-purple-50/30 rounded-3xl p-8 sm:p-10 md:p-12 border border-brand-border/80 shadow-sm mb-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
            <div className="flex-1 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                A Scientific, Human-Centric Approach
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-brand-navy">
                Looking Beyond Marks & Popular Trends
              </h3>
              <p className="text-brand-muted leading-relaxed text-base">
                Instead of relying only on marks or popular trends, OriginBI uses a structured behavioural intelligence assessment to reveal genuine aptitudes, learning patterns, and intrinsic potential.
              </p>
              <p className="text-brand-muted leading-relaxed text-base">
                The result is a clear, personalised snapshot that students can use to make more informed decisions about their academic future, university programs, and lifelong career fulfillment.
              </p>
            </div>

            <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl p-6 border border-brand-purple/20 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                  <Brain size={22} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-muted">Assessment Snapshot</div>
                  <div className="font-heading font-bold text-brand-navy text-sm">Personalised Single-Page PDF</div>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-brand-navy/90 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Download on the university fair day spot
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Actionable stream & career insights
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Easy to share with parents & educators
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  100% Free for Campus Square attendees
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-brand-border/70 hover:border-brand-purple/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.gradient} ${pillar.accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <pillar.icon size={22} />
                </div>
                <h4 className="font-heading font-bold text-lg text-brand-navy mb-2.5">
                  {pillar.title}
                </h4>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Joint Collaboration Banner */}
        <div className="bg-gradient-to-r from-brand-navy via-[#23154C] to-brand-navy rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-lg border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-turquoise mb-3">
                <Sparkles size={14} />
                <span>The Atom Infinity × OriginBI Mindworks Initiative</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold mb-3 text-white">
                Early Access to Self-Awareness Tools for Every Student
              </h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                Through the joint collaboration between <span className="text-white font-semibold">Atom Infinity</span> and <span className="text-white font-semibold">OriginBI Mindworks</span>, selected Campus Square conclave editions go beyond networking and university interactions. They also give students early access to data-driven self-awareness tools that support better academic and career choices.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 bg-white/10 backdrop-blur px-5 py-3.5 rounded-2xl border border-white/20">
              <div className="relative h-10 w-28">
                <Image src="/atom-logo.png" alt="Atom Infinity" fill className="object-contain" unoptimized />
              </div>
              <span className="text-white/60 font-bold">×</span>
              <div className="relative h-10 w-28">
                <Image src="/Origin-BI-white-Logo.png" alt="OriginBI Mindworks" fill className="object-contain" unoptimized />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
