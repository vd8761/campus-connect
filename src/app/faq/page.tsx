import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CampusSquareFaqSection } from '@/components/CampusSquareFaqSection';
import { HelpCircle, MessageSquare, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Campus Square',
  description: 'Find answers to frequently asked questions about attending, student registration, OriginBI assessment, university partnerships, and school hosting with Campus Square.',
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-10 sm:pt-14 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(91,39,217,0.25),_transparent_70%)] pointer-events-none"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-turquoise text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur">
            <HelpCircle size={14} />
            <span>Help & Knowledge Base</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold mb-6 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed mb-4">
            Campus Square — A Collaborative Initiative by Atom Infinity and OriginBI Mindworks
          </p>
          <p className="text-sm font-semibold text-brand-turquoise">
            Connect Campuses. Schools. Universities. Students. Opportunities.
          </p>
        </div>
      </section>

      {/* Joint Collaboration Banner */}
      <section className="container mx-auto px-4 -mt-8 relative z-20 max-w-5xl">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-brand-border/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider mb-2">
              Collaborative Initiative
            </div>
            <h4 className="text-lg font-heading font-bold text-brand-navy mb-1">
              Atom Infinity ✕ OriginBI Mindworks
            </h4>
            <p className="text-brand-muted text-xs sm:text-sm leading-relaxed">
              We are delighted to present a joint collaboration by Atom Infinity and OriginBI Mindworks for selected conclave editions. Together, we are committed to empowering school leaders with future-focused insights, data-driven innovation and transformative solutions.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="relative h-10 w-28">
              <Image src="/atom-logo.png" alt="Atom Infinity" fill unoptimized className="object-contain" />
            </div>
            <span className="text-slate-400 font-bold text-sm">✕</span>
            <div className="relative h-10 w-28">
              <Image src="/Origin-BI-Logo-01.png" alt="OriginBI Mindworks" fill unoptimized className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* 27 Categorized FAQs */}
      <div className="mt-8">
        <CampusSquareFaqSection isStandalone />
      </div>
    </main>
  );
}
