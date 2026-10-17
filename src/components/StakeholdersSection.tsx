import React from 'react';
import Link from 'next/link';
import {
  Building2,
  GraduationCap,
  Users2,
  School,
  Compass,
  Globe2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function StakeholdersSection() {
  const stakeholders = [
    {
      title: "School Leaders",
      desc: "Connect with universities, explore partnerships and bring new opportunities to your school community.",
      icon: School,
      actionText: "Host an Edition",
      href: "/host",
      accent: "text-brand-purple bg-purple-50 hover:border-brand-purple/50",
      badge: "Institutional Leadership",
    },
    {
      title: "Students",
      desc: "Discover universities, explore courses and gain insights into your strengths and future possibilities.",
      icon: GraduationCap,
      actionText: "Register for Fair & Free Assessment",
      href: "/events/university-fair-2026-theni/register",
      accent: "text-blue-600 bg-blue-50 hover:border-blue-400/50",
      badge: "Higher Ed Aspirants",
    },
    {
      title: "Parents",
      desc: "Explore higher education opportunities with your child and support informed academic decisions.",
      icon: Users2,
      actionText: "Explore Opportunities with Child",
      href: "/events/university-fair-2026-theni/register",
      accent: "text-emerald-600 bg-emerald-50 hover:border-emerald-400/50",
      badge: "Family Guidance",
    },
    {
      title: "Universities",
      desc: "Connect with students, parents and schools while showcasing your institution's programmes.",
      icon: Building2,
      actionText: "Become a University Partner",
      href: "/partnerships",
      accent: "text-amber-600 bg-amber-50 hover:border-amber-400/50",
      badge: "Higher Ed Admissions",
    },
    {
      title: "Educators and Career Counsellors",
      desc: "Exchange ideas, collaborate and support students in exploring academic pathways.",
      icon: Compass,
      actionText: "Collaborate With Us",
      href: "/contact",
      accent: "text-teal-600 bg-teal-50 hover:border-teal-400/50",
      badge: "Academic Mentors",
    },
    {
      title: "Education Partners and the Wider Community",
      desc: "Build meaningful connections between education, industry, skills and innovation.",
      icon: Globe2,
      actionText: "Explore Synergy",
      href: "/contact",
      accent: "text-rose-600 bg-rose-50 hover:border-rose-400/50",
      badge: "Industry & Innovation",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden border-t border-brand-border/60" id="stakeholders">
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-purple/20">
            <Users2 size={14} className="text-brand-purple" />
            <span>Inclusive Ecosystem</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-brand-navy tracking-tight mb-4">
            One Platform. Every Stakeholder.
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            Campus Square unites the entire education journey — connecting forward-thinking schools, visionary universities, ambitious students, and dedicated parents under one purposeful initiative.
          </p>
        </div>

        {/* 6 Stakeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakeholders.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-7 border border-brand-border/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${item.accent}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                    <item.icon size={24} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold text-brand-navy mb-2.5 group-hover:text-brand-purple transition-colors">
                  {item.title}
                </h3>

                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-auto">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-purple hover:text-brand-navy transition-colors group-hover:translate-x-1 duration-200"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
