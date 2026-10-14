"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UNIVERSITY_PARTNERS } from '@/data/university-partners';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function UniversityPartnersSection() {
  const row1 = UNIVERSITY_PARTNERS.slice(0, 10);
  const row2 = UNIVERSITY_PARTNERS.slice(10);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-brand-light/50 to-white relative overflow-hidden border-t border-brand-border/60">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple/5 via-brand-blue/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-purple/20">
            <Sparkles size={14} className="text-brand-purple" />
            <span>Academic Network</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-brand-navy tracking-tight mb-4">
            Our Prestigious <span className="text-transparent bg-clip-text bg-[image:var(--primary-gradient)]">University Partners</span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            Campus Connect collaborates with leading Indian and international universities, premier institutes, and higher education leaders to create high-impact pathways for students.
          </p>
        </div>

        {/* Infinite Logo Marquee Container */}
        <div className="relative w-full overflow-hidden py-3 space-y-4">
          {/* Gradient Edge Masks for Smooth Fading */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

          {/* Marquee Row 1 - Leftward */}
          <div className="animate-marquee flex items-center gap-4 sm:gap-6">
            {[...row1, ...row1, ...row1].map((partner, index) => (
              <div
                key={`${partner.id}-r1-${index}`}
                className="shrink-0 w-48 sm:w-56 md:w-64 h-24 sm:h-26 px-6 py-4 rounded-2xl bg-white flex items-center justify-center border border-brand-border/70 shadow-[0_2px_8px_rgba(22,27,53,0.03)] hover:shadow-md hover:border-brand-purple/40 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
                title={partner.name}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    unoptimized
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                    sizes="256px"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Marquee Row 2 - Rightward (Reverse) */}
          <div className="animate-marquee-reverse flex items-center gap-4 sm:gap-6">
            {[...row2, ...row2, ...row2].map((partner, index) => (
              <div
                key={`${partner.id}-r2-${index}`}
                className="shrink-0 w-48 sm:w-56 md:w-64 h-24 sm:h-26 px-6 py-4 rounded-2xl bg-white flex items-center justify-center border border-brand-border/70 shadow-[0_2px_8px_rgba(22,27,53,0.03)] hover:shadow-md hover:border-brand-purple/40 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
                title={partner.name}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    unoptimized
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                    sizes="256px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Partners Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link href="/partners">
            <Button
              variant="outline"
              size="default"
              className="gap-2 border-brand-border hover:border-brand-purple/50 font-medium text-brand-navy"
            >
              <span>View All 19 University Partners</span>
              <ArrowRight size={15} />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="ghost"
              size="default"
              className="text-brand-purple hover:bg-brand-purple/10 font-medium"
            >
              Become a Partner Institution
            </Button>
          </Link>
        </div>

        {/* Institutional Collaboration Banner */}
        <div className="mt-14 bg-gradient-to-r from-brand-navy via-[#380946] to-brand-navy rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl border border-white/10">
          <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-72 h-72 bg-brand-turquoise/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-turquoise mb-2">
                <CheckCircle size={14} />
                <span>Academic Collaboration</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                Represent a University or Higher Education Institution?
              </h3>
              <p className="text-sm md:text-base text-gray-300">
                Showcase your programs, interact with 5,000+ top school leaders, and connect directly with future undergraduate and postgraduate applicants across India.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link href="/partners" className="w-full sm:w-auto">
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full sm:w-auto rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Explore Partnership</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto h-12 rounded-xl px-8 text-sm font-semibold border border-white/40 bg-transparent text-white hover:bg-white hover:text-brand-navy transition-all duration-300 shadow-sm cursor-pointer inline-flex items-center justify-center whitespace-nowrap"
                >
                  Contact Admissions Desk
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
