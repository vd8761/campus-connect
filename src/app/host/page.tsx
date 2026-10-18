import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SchoolHostingForm } from './SchoolHostingForm';
import { Button } from '@/components/ui/Button';
import { 
  School, 
  Users, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  Building2, 
  Award, 
  Calendar, 
  MapPin, 
  ArrowRight,
  MessageSquare,
  Mail
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

export const metadata: Metadata = {
  title: 'Host an Edition | Bring Campus Square™ to Your School',
  description: 'Give your students and parents an opportunity to explore higher education institutions, discover academic pathways and interact with university representatives. Discuss hosting a Campus Square™ edition.',
};

export default function HostPage() {
  const hostBenefits = [
    {
      title: "Direct Access to Premier Universities",
      desc: "Connect your high schoolers and parents directly with admissions deans and official representatives from leading Indian and global universities right on your campus.",
      icon: Building2,
    },
    {
      title: "Complimentary OriginBI Assessments for Students",
      desc: "Every registered student receives access to the scientific OriginBI behavioural profile mapping, helping them make confident stream and course decisions.",
      icon: Compass,
    },
    {
      title: "Strengthen School Community Engagement",
      desc: "Provide immense tangible value to parents and alumni, positioning your institution as a forward-thinking beacon for career guidance and future-readiness.",
      icon: Users,
    },
    {
      title: "End-to-End Operational Partnership",
      desc: "Atom Infinity and OriginBI handle university onboarding, digital ticketing, branding collateral, and promotional campaigns, creating a smooth turnkey experience.",
      icon: Award,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-10 sm:pt-14 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(32,178,170,0.2),_transparent_70%)] pointer-events-none"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-turquoise text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur">
            <School size={14} />
            <span>School Leadership Collaboration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold mb-5 tracking-tight leading-tight">
            Bring Campus Square™ to <span className="text-transparent bg-clip-text bg-[image:var(--primary-gradient)]">Your School.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed mb-6">
            Give your students and parents an opportunity to explore higher education institutions, discover academic pathways and interact with university representatives.
          </p>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed mb-8">
            We welcome school management teams, principals and education leaders interested in hosting a Campus Square™ edition.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#host-form">
              <Button variant="gradient" size="lg" className="rounded-xl px-8 shadow-xl cursor-pointer">
                Discuss Hosting an Edition
              </Button>
            </a>
            <a href="https://wa.me/918056134455" target="_blank" rel="noopener noreferrer">
              <Button variant="outlineWhite" size="lg" className="rounded-xl px-8 cursor-pointer flex items-center gap-2">
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                <span>WhatsApp: +91 80561 34455</span>
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Host School Spotlight */}
      <section className="py-16 px-4 -mt-10 relative z-20">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-r from-brand-navy to-[#320846] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-brand-turquoise text-xs font-bold uppercase tracking-wider">
                Host School Showcase
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold mt-2 mb-4">
                The Little Kingdom School, Theni
              </h2>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6">
                Proud host of the debut Campus Square™ edition on Saturday, 24 October 2026. Bringing together premier university partners, hundreds of enthusiastic high schoolers, and complete behavioral profiling.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-white/80">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                  <Calendar size={14} className="text-brand-turquoise" />
                  <span>Saturday, 24 October 2026</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                  <MapPin size={14} className="text-brand-turquoise" />
                  <span>Theni, Tamil Nadu</span>
                </div>
              </div>
            </div>

            <Link href="/events/university-fair-2026-theni" className="shrink-0">
              <Button variant="white" size="lg" className="px-6 rounded-xl shadow-lg hover:bg-slate-100 font-extrabold cursor-pointer">
                View Theni Edition
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Host Campus Square™ */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-heading font-bold text-brand-navy mb-3">
              Transform Your Campus Into a Higher Education Hub
            </h2>
            <p className="text-brand-muted text-sm sm:text-base">
              Schools hosting Campus Square™ become central destinations for career discovery, parent collaboration, and academic networking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hostBenefits.map((item, i) => (
              <div key={i} className="bg-white p-7 rounded-2xl border border-brand-border/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center mb-4">
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-heading font-bold text-brand-navy mb-2">{item.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School Hosting Form Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <SchoolHostingForm />
        </div>
      </section>
    </main>
  );
}
