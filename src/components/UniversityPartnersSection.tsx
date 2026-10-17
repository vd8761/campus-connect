"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UNIVERSITY_PARTNERS } from '@/data/university-partners';
import { Sparkles, ArrowRight, ExternalLink, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function UniversityPartnersSection() {
  const row1 = UNIVERSITY_PARTNERS.slice(0, 10);
  const row2 = UNIVERSITY_PARTNERS.slice(10);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-brand-light/40 to-white relative overflow-hidden border-t border-brand-border/60" id="university-partners">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple/5 via-brand-blue/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-purple/20">
            <Building2 size={14} className="text-brand-purple" />
            <span>Academic Ecosystem</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-brand-navy tracking-tight mb-4">
            Our University Partners
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            We are proud to collaborate with universities and higher education institutions to connect schools, students and families with meaningful academic opportunities.
          </p>

          {/* Network Distinction Note */}
          <div className="mt-5 max-w-3xl mx-auto px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 text-xs sm:text-sm text-left sm:text-center flex items-start sm:items-center justify-center gap-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1 sm:mt-0"></span>
            <span className="leading-relaxed">
              <strong className="text-slate-800 font-semibold">Overall Partner Network:</strong> Institutions associated with Campus Square across multiple cities. Check each edition page for confirmed local booths.
            </span>
          </div>
        </div>

        {/* Responsive Grid with Direct Institutional Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 mb-12">
          {UNIVERSITY_PARTNERS.map((partner) => (
            <a
              key={partner.id}
              href={partner.website || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-4 border border-brand-border/80 shadow-xs hover:shadow-md hover:border-brand-purple/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between text-center group cursor-pointer relative"
              title={`Visit official website: ${partner.name}`}
            >
              <div className="w-full h-20 relative flex items-center justify-center p-2">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  unoptimized
                  className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 150px, 200px"
                />
              </div>

              <div className="w-full pt-2 border-t border-slate-100 mt-2 flex flex-col items-center">
                <h4 className="font-heading font-bold text-xs text-brand-navy line-clamp-2 group-hover:text-brand-purple transition-colors">
                  {partner.name}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-brand-muted mt-1">
                  <span>{partner.location}</span>
                  <ExternalLink size={10} className="text-slate-400 group-hover:text-brand-purple transition-colors shrink-0" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Join Our Growing University Network Section */}
        <div className="mt-14 bg-gradient-to-r from-brand-navy via-[#320846] to-brand-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl border border-white/10">
          <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-72 h-72 bg-brand-turquoise/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-turquoise mb-3">
                <Building2 size={15} />
                <span>Institutional Partnerships</span>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-3">
                Join Our Growing University Network
              </h3>
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                We welcome universities and higher education institutions to partner with Campus Square and connect with schools, students and families through our growing series of school-hosted university fairs.
              </p>
            </div>

            <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
              <Link href="/partnerships" className="w-full sm:w-auto">
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full sm:w-auto rounded-xl px-8 py-6 text-base font-semibold shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Become a University Partner</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
