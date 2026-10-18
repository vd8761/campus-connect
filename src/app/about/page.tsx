import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Users, Globe2, Award, Zap, BookOpen, Sparkles, Building2, School, MessageSquare, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Metadata } from 'next';
import { CollaborativeInitiativeSection } from '@/components/CollaborativeInitiativeSection';

export const metadata: Metadata = {
  title: 'About Us | Campus Square™',
  description: 'Campus Square™ is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-10 sm:pt-14 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand-primary/20 blur-[100px]" />
          <div className="absolute top-[60%] -left-[10%] w-[40%] h-[40%] rounded-full bg-brand-turquoise/20 blur-[100px]" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-turquoise text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur">
            <Building2 size={14} />
            <span>Connect Campuses.</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">About Campus Square™</h1>
          <p className="text-xl text-brand-turquoise font-semibold mb-6">Schools. Universities. Students. Opportunities.</p>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Campus Square™ is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.
          </p>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-purple-50 text-brand-purple text-xs font-bold uppercase tracking-wider mb-3">
                Where Education Meets Opportunity
              </div>
              <h2 className="text-3xl font-heading font-bold text-brand-navy mb-6">Our Mission & Purpose</h2>
              <p className="text-slate-600 mb-6 text-base leading-relaxed">
                Campus Square™ provides a high-touch, structured bridge between leading universities and school communities. Rather than impersonal convention halls, our editions take place directly in host schools - creating an intimate, trust-rich environment where students and parents can explore academic pathways with confidence.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Through our partnership with OriginBI, every registered student gains complimentary access to behavioral profile mapping, uncovering their inherent strengths before they finalize higher education streams or degree programs.
              </p>
            </div>

            <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-xl border border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                alt="Students collaborating"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Collaborative Initiative Showcase */}
      <CollaborativeInitiativeSection />

      {/* Core Principles */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-brand-navy mb-4">One Platform. Every Stakeholder.</h2>
            <p className="text-brand-muted max-w-2xl mx-auto text-sm sm:text-base">
              The principles guiding our collaborative approach across school campuses and universities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: School, title: "School-Centered", desc: "Empowering school leadership to bring premier academic opportunities directly to their students and parents." },
              { icon: Target, title: "Student Clarity", desc: "Equipping learners with scientific OriginBI behavioral assessment insights to choose fulfilling career paths." },
              { icon: Building2, title: "University Reach", desc: "Connecting higher education institutions with motivated, qualified applicants across multiple cities." },
              { icon: Users, title: "Parent Support", desc: "Guiding parents with transparent, authentic admissions advice and direct institutional conversations." },
              { icon: Zap, title: "Future-Ready Innovation", desc: "Embracing data-driven career clarity and transformative educational solutions." },
              { icon: Award, title: "Collaborative Excellence", desc: "A joint collaboration by Atom Infinity and OriginBI Mindworks maintaining the highest quality standards." },
            ].map((val, i) => (
              <div key={i} className="bg-white p-7 rounded-2xl shadow-xs border border-brand-border/80 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center mb-5">
                  <val.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-bold text-brand-navy mb-2">{val.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-4">
              <Link href="/events">
                <Button variant="gradient" size="lg" className="rounded-xl px-8 shadow-md">
                  Explore Fair Editions
                </Button>
              </Link>
              <Link href="/partnerships">
                <Button variant="outline" size="lg" className="rounded-xl px-8">
                  Partner as a University
                </Button>
              </Link>
              <Link href="/host">
                <Button variant="outline" size="lg" className="rounded-xl px-8">
                  Host an Edition
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
