import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Users, Globe2, Award, Zap, BookOpen, Sparkles, Building2, School, MessageSquare, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Campus Square',
  description: 'Campus Square is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.',
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

          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">About Campus Square</h1>
          <p className="text-xl text-brand-turquoise font-semibold mb-6">Schools. Universities. Students. Opportunities.</p>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Campus Square is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.
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

      {/* Our Mission & Values */}
      <section className="py-20 px-4 bg-white mt-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-purple-50 text-brand-purple text-xs font-bold uppercase tracking-wider mb-3">
                Where Education Meets Opportunity
              </div>
              <h2 className="text-3xl font-heading font-bold text-brand-navy mb-6">Our Mission & Purpose</h2>
              <p className="text-slate-600 mb-6 text-base leading-relaxed">
                Campus Square provides a high-touch, structured bridge between leading universities and school communities. Rather than impersonal convention halls, our editions take place directly in host schools - creating an intimate, trust-rich environment where students and parents can explore academic pathways with confidence.
              </p>
              <p className="text-slate-600 text-base mb-8 leading-relaxed">
                Through our partnership with OriginBI, every registered student gains complimentary access to behavioral profile mapping, uncovering their inherent strengths before they finalize higher education streams or degree programs.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-purple mb-1">19+</h4>
                  <p className="text-slate-600 text-xs font-semibold">University Partners</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy mb-1">Theni</h4>
                  <p className="text-slate-600 text-xs font-semibold">Inaugural Edition 2026</p>
                </div>
              </div>
            </div>

            <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-xl border border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                alt="Students collaborating"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent flex items-end p-8 text-white">
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">The Little Kingdom School</h3>
                  <p className="text-xs text-brand-turquoise">First Edition Host • 24 October 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-brand-navy mb-4">One Platform. Every Stakeholder.</h2>
            <p className="text-brand-muted max-w-2xl mx-auto text-sm sm:text-base">
              The principles guiding our collaborative approach across school campuses and universities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: School, title: "School-Centered", desc: "Empowering school leadership to bring premier academic opportunities directly to their students and families." },
              { icon: Target, title: "Student Clarity", desc: "Equipping learners with scientific OriginBI behavioral assessment insights to choose fulfilling career paths." },
              { icon: Building2, title: "University Reach", desc: "Connecting higher education institutions with motivated, qualified applicants across multiple cities." },
              { icon: Users, title: "Family Support", desc: "Guiding parents with transparent, authentic admissions advice and direct institutional conversations." },
              { icon: Zap, title: "Future-Ready Innovation", desc: "Embracing data-driven career clarity and transformative educational solutions." },
              { icon: Award, title: "Collaborative Excellence", desc: "A joint initiative by Atom Infinity and OriginBI Mindworks maintaining the highest quality standards." },
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
              <Link href="/events/university-fair-2026-theni/register">
                <Button variant="gradient" size="lg" className="rounded-xl px-8 shadow-md">
                  Register for First Edition
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
