import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CampusSquareFaqSection } from '@/components/CampusSquareFaqSection';
import { HelpCircle, MessageSquare, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Campus Square™',
  description: 'Find answers to frequently asked questions about attending, student registration, OriginBI assessment, university partnerships, and school hosting with Campus Square™.',
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
            Campus Square™ - A University Fair Series, a joint collaboration by Atom Infinity and Origin Bi, bringing schools and universities together to connect students with higher education opportunities.
          </p>
          <p className="text-sm font-semibold text-brand-turquoise">
            Connect Campuses. Schools. Universities. Students. Opportunities.
          </p>
        </div>
      </section>

      {/* 27 Categorized FAQs */}
      <div className="mt-8">
        <CampusSquareFaqSection isStandalone />
      </div>
    </main>
  );
}
