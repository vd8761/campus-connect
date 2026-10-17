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

        </div>

        {/* Compact Infinite Logo Marquee (Small Height Scrolling Section) */}
        <div className="relative w-full overflow-hidden py-3 space-y-4 mb-8">
          {/* Gradient Edge Masks for Smooth Fading */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

          {/* Marquee Row 1 - Leftward */}
          <div className="animate-marquee flex items-center gap-4 sm:gap-6">
            {[...row1, ...row1, ...row1].map((partner, index) => (
              <a
                key={`${partner.id}-r1-${index}`}
                href={partner.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-48 sm:w-56 md:w-60 h-24 sm:h-26 px-5 py-3 rounded-2xl bg-white flex flex-col items-center justify-center border border-brand-border/80 shadow-[0_2px_8px_rgba(22,27,53,0.03)] hover:shadow-md hover:border-brand-purple/40 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer text-center"
                title={`Visit ${partner.name}`}
              >
                <div className="relative w-full h-14 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    unoptimized
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                    sizes="240px"
                  />
                </div>
                <span className="text-[11px] font-semibold text-brand-navy truncate max-w-full group-hover:text-brand-purple transition-colors mt-1">
                  {partner.name}
                </span>
              </a>
            ))}
          </div>

          {/* Marquee Row 2 - Rightward (Reverse) */}
          <div className="animate-marquee-reverse flex items-center gap-4 sm:gap-6">
            {[...row2, ...row2, ...row2].map((partner, index) => (
              <a
                key={`${partner.id}-r2-${index}`}
                href={partner.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-48 sm:w-56 md:w-60 h-24 sm:h-26 px-5 py-3 rounded-2xl bg-white flex flex-col items-center justify-center border border-brand-border/80 shadow-[0_2px_8px_rgba(22,27,53,0.03)] hover:shadow-md hover:border-brand-purple/40 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer text-center"
                title={`Visit ${partner.name}`}
              >
                <div className="relative w-full h-14 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    unoptimized
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                    sizes="240px"
                  />
                </div>
                <span className="text-[11px] font-semibold text-brand-navy truncate max-w-full group-hover:text-brand-purple transition-colors mt-1">
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* View All Partners & Partner Enquiry Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center mb-12">
          <Link href="/partners">
            <Button
              variant="outline"
              size="default"
              className="rounded-xl px-5 py-2.5 gap-2 border-brand-border hover:border-brand-purple/50 font-semibold text-brand-navy hover:text-brand-purple text-xs sm:text-sm cursor-pointer shadow-xs"
            >
              <span>View All 19 University Partners & Profiles</span>
              <ArrowRight size={15} />
            </Button>
          </Link>
          <Link href="/partnerships">
            <Button
              variant="ghost"
              size="default"
              className="text-brand-purple hover:bg-brand-purple/10 font-semibold text-xs sm:text-sm cursor-pointer"
            >
              Partner with Campus Square
            </Button>
          </Link>
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
