import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { UNIVERSITY_PARTNERS } from '@/data/university-partners';
import { UniversityPartnershipForm } from './UniversityPartnershipForm';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  MapPin, 
  Sparkles, 
  Award, 
  Globe2, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Mail
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

export const metadata: Metadata = {
  title: 'University Partnerships | Campus Square',
  description: 'Together, We Connect Campuses. Partner with Campus Square to engage with prospective students, connect with school leaders and families, and showcase academic programmes across India.',
};

export default function UniversityPartnershipsPage() {
  const benefits = [
    {
      title: "Showcase Academic Programmes and Courses",
      desc: "Present your undergraduate, postgraduate, and specialized courses directly to qualified high school students actively planning their higher education.",
      icon: GraduationCap,
      color: "from-purple-500/10 to-indigo-500/10",
      accent: "text-brand-purple",
    },
    {
      title: "Connect with Prospective Students and Parents",
      desc: "Engage face-to-face with motivated students and their families in an focused, interactive school-hosted setting that drives high-intent admissions conversations.",
      icon: Users,
      color: "from-blue-500/10 to-cyan-500/10",
      accent: "text-blue-600",
    },
    {
      title: "Build Relationships with Schools & Education Leaders",
      desc: "Establish direct institutional linkages with school principals, management trustees, and academic counselors for year-round student engagement.",
      icon: Building2,
      color: "from-teal-500/10 to-emerald-500/10",
      accent: "text-teal-600",
    },
    {
      title: "Increase Awareness of the Institution",
      desc: "Elevate your university's brand visibility, academic accolades, research achievements, and accreditation standing among key regional decision-makers.",
      icon: Award,
      color: "from-amber-500/10 to-orange-500/10",
      accent: "text-amber-600",
    },
    {
      title: "Explore Opportunities Across Multiple Cities",
      desc: "Expand your student recruitment footprint across tier-1, tier-2, and emerging educational centers without managing separate logistical footprints.",
      icon: Globe2,
      color: "from-rose-500/10 to-pink-500/10",
      accent: "text-rose-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-10 sm:pt-14 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(91,39,217,0.25),_transparent_70%)] pointer-events-none"></div>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-turquoise text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur">
            <Building2 size={14} />
            <span>Campus Square University Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold mb-6 tracking-tight leading-tight">
            Together, We <span className="text-transparent bg-clip-text bg-[image:var(--primary-gradient)]">Connect Campuses.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
            Campus Square provides a platform for universities to engage with prospective students, connect with school leaders and families, and showcase their academic programmes.
          </p>

          <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We welcome additional universities and higher education institutions to join our growing network and collaborate with us across our upcoming editions.
          </p>
        </div>
      </section>

      {/* Joint Collaboration Banner */}
      <section className="container mx-auto px-4 -mt-10 relative z-20 max-w-5xl">
        <div className="bg-gradient-to-r from-brand-navy via-[#320846] to-brand-navy rounded-3xl p-7 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-brand-turquoise/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-brand-turquoise/20 text-brand-turquoise text-xs font-bold uppercase tracking-wider mb-3">
                Collaborative Initiative
              </div>
              <h4 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">
                Atom Infinity ✕ OriginBI Mindworks
              </h4>
              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
                We are delighted to present a joint collaboration by <strong>Atom Infinity</strong> and <strong>OriginBI Mindworks</strong> for selected conclave editions. Together, we are committed to empowering school leaders with future-focused insights, data-driven innovation and transformative solutions.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 bg-white px-5 sm:px-6 py-3.5 rounded-2xl shadow-2xl border border-white/20">
              <div className="relative h-10 w-28 sm:h-11 sm:w-32">
                <Image src="/atom-logo.png" alt="Atom Infinity" fill unoptimized className="object-contain" />
              </div>
              <span className="text-brand-navy font-bold text-base sm:text-lg">✕</span>
              <div className="relative h-10 w-28 sm:h-11 sm:w-32">
                <Image src="/Origin-BI-Logo-01.png" alt="OriginBI Mindworks" fill unoptimized className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits for Universities */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider mb-3">
              <Award size={14} />
              <span>Institutional Value Proposition</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-navy mb-4">
              Why Partner with Campus Square?
            </h2>
            <p className="text-brand-muted text-base">
              A purposeful engagement platform engineered to create deep, measurable connections with students, families, and high schools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="bg-white p-7 rounded-2xl border border-brand-border/80 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-5 ${benefit.accent}`}>
                    <benefit.icon size={24} />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-brand-navy mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-brand-purple">
                  <CheckCircle2 size={14} />
                  <span>Strategic Advantage</span>
                </div>
              </div>
            ))}

            {/* Quick Fact / Contact Card */}
            <div className="bg-gradient-to-br from-brand-navy to-[#320846] text-white p-7 rounded-2xl shadow-md flex flex-col justify-between">
              <div>
                <span className="text-brand-turquoise text-xs font-bold uppercase tracking-wider">Fast-Track Liaison</span>
                <h3 className="text-xl font-heading font-bold mt-2 mb-3">Direct Admissions Advisory</h3>
                <p className="text-gray-200 text-sm leading-relaxed mb-6">
                  Have specific dates, curriculum requirements or stall configurations in mind? Connect directly with our partnership coordinator.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                <a href="https://wa.me/918056134455" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-turquoise hover:text-white transition-colors">
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>WhatsApp: +91 80561 34455</span>
                </a>
                <a href="mailto:interact@atom-infinity.com" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Mail size={16} />
                  <span>interact@atom-infinity.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Enquiry Form Section */}
      <section className="py-8 px-4" id="enquiry-form">
        <div className="container mx-auto max-w-4xl">
          <UniversityPartnershipForm />
        </div>
      </section>

      {/* Existing University Partners Grid */}
      <section className="py-20 px-4 mt-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-navy mb-3">
              Our Growing University Partner Network
            </h2>
            <p className="text-sm text-brand-muted">
              Higher education institutions collaborating with Campus Square across multiple cities ({UNIVERSITY_PARTNERS.length} Partners)
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {UNIVERSITY_PARTNERS.map((partner) => (
              <a
                key={partner.id}
                href={partner.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-4 border border-brand-border/80 shadow-xs hover:shadow-md hover:border-brand-purple/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between text-center group"
                title={`Visit official site: ${partner.name}`}
              >
                <div className="w-full h-20 relative flex items-center justify-center p-2">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    unoptimized
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                    sizes="180px"
                  />
                </div>
                <div className="w-full pt-2 border-t border-slate-100 mt-2">
                  <h4 className="font-heading font-bold text-xs text-brand-navy line-clamp-2 group-hover:text-brand-purple transition-colors">
                    {partner.name}
                  </h4>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-brand-muted mt-1">
                    <span className="truncate">{partner.location}</span>
                    <ExternalLink size={10} className="shrink-0 text-slate-400 group-hover:text-brand-purple" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
