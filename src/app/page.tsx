import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import prisma from "@/lib/prisma";
import {
  MapPin,
  Calendar,
  Clock,
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
  Users,
  Compass,
  School,
  MessageSquare,
  Mail,
  ShieldCheck,
  FileCheck2,
  ExternalLink
} from "lucide-react";
import { to12HourTime } from "@/lib/dateUtils";
import { UniversityPartnersSection } from "@/components/UniversityPartnersSection";
import { StakeholdersSection } from "@/components/StakeholdersSection";
import { AboutOriginBISection } from "@/components/AboutOriginBISection";
import { OriginBIBenefitsSection } from "@/components/OriginBIBenefitsSection";
import { CampusSquareFaqSection } from "@/components/CampusSquareFaqSection";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let rawEvents: any[] = [];
  try {
    rawEvents = await prisma.event.findMany({
      orderBy: { startDate: 'asc' },
      include: {
        universityEvents: {
          include: {
            university: true
          }
        }
      }
    });
  } catch (error) {
    console.warn("Database connection failed. Showing fallback event states.");
  }

  // Find the primary Theni First Edition
  const theniEvent = rawEvents.find(e => e.slug === 'university-fair-2026-theni') || rawEvents[0] || {
    slug: 'university-fair-2026-theni',
    title: 'University Fair 2026',
    venue: 'The Little Kingdom School, Theni',
    city: 'Theni',
    startDate: new Date('2026-10-24T12:00:00.000Z'),
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    status: 'OPEN'
  };

  const futureEditions = [
    { city: "Coimbatore", venue: "Host School Partner", date: "Coming in 2026/2027", status: "Announcing Soon" },
    { city: "Trichy", venue: "Host School Partner", date: "Coming in 2026/2027", status: "Announcing Soon" },
    { city: "Chennai", venue: "Host School Partner", date: "Coming in 2026/2027", status: "Announcing Soon" },
    { city: "Bengaluru", venue: "Host School Partner", date: "Coming in 2026/2027", status: "Announcing Soon" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ------------------------------------------------------------------------- */}
      {/* 1. HERO: CAMPUS SQUARE — REGISTRATION & ASSESSMENT FREE VISIBLE AT TOP  */}
      {/* ------------------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-brand-navy to-slate-900 text-white pt-10 sm:pt-14 pb-20">
        {/* Glow gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-turquoise/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
          {/* Joint Initiative Credential */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-slate-300 mb-6 backdrop-blur-sm">
            <span className="text-slate-400">A joint education initiative of</span>
            <span className="font-semibold text-white">Atom Infinity</span>
            <span className="text-brand-turquoise font-bold">✕</span>
            <span className="font-semibold text-white">OriginBI Mindworks</span>
          </div>

          {/* Main Hero Typography */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-white mb-2">
            CAMPUS SQUARE
          </h1>

          <p className="text-lg sm:text-xl font-heading font-semibold text-brand-turquoise mb-3 tracking-wide">
            Connect Campuses.
          </p>

          <p className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-100 to-white mb-4">
            Where Education Meets Opportunity.
          </p>

          {/* Supporting Line */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-gray-300 mb-6 flex-wrap">
            <span>Schools</span>
            <span className="text-brand-turquoise/70">•</span>
            <span>Universities</span>
            <span className="text-brand-turquoise/70">•</span>
            <span>Students</span>
            <span className="text-brand-turquoise/70">•</span>
            <span>Opportunities</span>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
            Bringing schools, universities, students, parents and education partners together to discover opportunities, build meaningful connections and shape the future of education.
          </p>

          {/* TOP REGISTRATION & FREE ORIGINBI ASSESSMENT OFFER CARD (Visible immediately without scrolling) */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl max-w-4xl mx-auto mb-8 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-turquoise/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-white/15 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Complimentary Assessment Offer
                </span>
              </div>
              <span className="text-xs font-bold text-white/80 bg-white/10 px-3 py-1 rounded-full w-fit">
                100% Free with Event Registration
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2.5 flex items-center gap-2.5">
              <GraduationCap size={22} className="text-brand-turquoise shrink-0" />
              <span>Register & Get Your FREE OriginBI Assessment</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-6">
              Explore universities, discover academic opportunities and help students understand their strengths and potential academic pathways through the complimentary OriginBI assessment.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
              <Link
                href="/events/university-fair-2026-theni/register"
                className="flex-1"
              >
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full rounded-xl py-6 text-base font-extrabold shadow-lg shadow-brand-purple/40 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Register Now — Assessment FREE</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>

              <Link
                href="#university-partners"
                className="sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-xl py-6 text-sm font-bold border-white/30 text-white bg-white/5 hover:bg-white hover:text-brand-navy cursor-pointer transition-all"
                >
                  Explore University Partners
                </Button>
              </Link>
            </div>

            {/* First Edition Details Immediately Below CTA */}
            <div className="border-t border-white/15 bg-white/[0.06] -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 px-6 sm:px-8 py-4 rounded-b-3xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-brand-turquoise font-medium min-w-0">
                  <MapPin size={16} className="text-brand-turquoise shrink-0" />
                  <span className="leading-snug">
                    First Edition: <strong className="text-white font-bold">The Little Kingdom School, Theni</strong>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-200">
                  <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Calendar size={15} className="text-brand-turquoise shrink-0" />
                    <span>Saturday, 24 October 2026</span>
                  </div>
                  <span className="hidden sm:inline text-white/30">•</span>
                  <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Clock size={15} className="text-brand-turquoise shrink-0" />
                    <span>1:00 PM – 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 max-w-xl mx-auto">
            Note: OriginBI assessment eligibility and delivery process are coordinated directly with registered student attendees for fair-day on-spot report generation.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* 2. UNIVERSITY PARTNERS: PROMINENT DISPLAY OF EXISTING PARTNER LOGOS      */}
      {/* ------------------------------------------------------------------------- */}
      <UniversityPartnersSection />

      {/* ------------------------------------------------------------------------- */}
      {/* 3. UPCOMING EDITIONS: FIRST EDITION IN THENI, FOLLOWED BY FUTURE LOCATIONS */}
      {/* ------------------------------------------------------------------------- */}
      <section className="py-20 bg-slate-50 border-t border-brand-border/60" id="upcoming-editions">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-purple/20">
              <Calendar size={14} />
              <span>Multi-City Fair Series</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-brand-navy tracking-tight mb-4">
              Upcoming Editions
            </h2>

            <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
              Campus Square is hosted at different schools across various cities. Explore our inaugural edition and upcoming regional locations.
            </p>
          </div>

          {/* First Edition Featured Card: Theni */}
          <div className="bg-white rounded-3xl border-2 border-brand-purple/30 shadow-xl overflow-hidden mb-10 hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-brand-navy via-[#320846] to-brand-navy text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-turquoise text-brand-navy text-xs font-extrabold uppercase tracking-wider">
                  Inaugural First Edition
                </span>
                <span className="text-sm font-semibold text-white/90">Registration Open</span>
              </div>
              <span className="text-xs text-white/70">Admission: Completely Free</span>
            </div>

            <div className="p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="inline-block text-xs font-bold uppercase tracking-wider text-brand-purple">
                  School-Hosted University Fair
                </div>

                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy">
                  Campus Square — The Little Kingdom School, Theni
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Join us for our first edition featuring 19 premier university partners, admissions counseling, and complimentary OriginBI behavioral profile mapping for students.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-navy font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Calendar size={18} className="text-brand-purple shrink-0" />
                    <span>Saturday, 24 October 2026</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-navy font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Clock size={18} className="text-brand-purple shrink-0" />
                    <span>1:00 PM – 4:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-navy font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <MapPin size={18} className="text-brand-purple shrink-0" />
                    <span>The Little Kingdom School, Theni</span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto shrink-0 flex flex-col gap-3">
                <Link href="/events/university-fair-2026-theni/register" className="w-full">
                  <Button variant="gradient" size="lg" className="w-full rounded-xl py-6 text-base font-bold shadow-lg shadow-brand-purple/20">
                    Register for Theni Edition
                  </Button>
                </Link>
                <Link href="/events/university-fair-2026-theni" className="w-full">
                  <Button variant="outline" size="lg" className="w-full rounded-xl">
                    View Event Details & Booths
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Future Editions Pipeline */}
          <div className="mt-8">
            <h4 className="text-lg font-heading font-bold text-brand-navy mb-4 text-center sm:text-left">
              Upcoming Cities in Pipeline
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {futureEditions.map((ed, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-brand-border/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {ed.status}
                    </span>
                    <h5 className="text-xl font-heading font-bold text-brand-navy mt-2 mb-1">
                      {ed.city} Edition
                    </h5>
                    <p className="text-xs text-brand-muted mb-3">
                      {ed.venue}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-purple font-medium">
                    <span>{ed.date}</span>
                    <Link href="/host" className="hover:underline">Nominate School &rarr;</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* 4. STAKEHOLDER BENEFITS: SCHOOL LEADERS, STUDENTS, PARENTS, UNIVERSITIES... */}
      {/* ------------------------------------------------------------------------- */}
      <StakeholdersSection />

      {/* ------------------------------------------------------------------------- */}
      {/* 5. ORIGINBI ASSESSMENT: EXPLAIN BENEFIT, ACCESS PROCESS & COLLABORATION  */}
      {/* ------------------------------------------------------------------------- */}
      <section className="py-20 bg-white relative overflow-hidden" id="originbi-assessment">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Joint Collaboration Banner */}
          <div className="bg-gradient-to-r from-brand-navy via-[#320846] to-brand-navy text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-turquoise/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-block px-3.5 py-1 rounded-full bg-brand-turquoise/20 text-brand-turquoise text-xs font-bold uppercase tracking-wider mb-3">
                  Strategic Future Readiness
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-3">
                  A Joint Collaboration by Atom Infinity and OriginBI Mindworks
                </h3>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-2xl">
                  We are delighted to present a joint collaboration by <strong>Atom Infinity</strong> and <strong>OriginBI Mindworks</strong> for selected conclave editions. Together, we are committed to empowering school leaders with future-focused insights, data-driven innovation and transformative solutions.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 bg-white/95 p-4 rounded-2xl shadow-xl">
                <div className="relative h-12 w-32">
                  <Image src="/atom-logo.png" alt="Atom Infinity" fill unoptimized className="object-contain" />
                </div>
                <span className="text-brand-navy font-bold text-lg">✕</span>
                <div className="relative h-12 w-32">
                  <Image src="/Origin-BI-Logo-01.png" alt="OriginBI Mindworks" fill unoptimized className="object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* OriginBI Detail Sections */}
          <AboutOriginBISection />
          <OriginBIBenefitsSection eventSlug="university-fair-2026-theni" isRegistrationOpen={true} />
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* 6. UNIVERSITY PARTNERSHIPS: INVITE ADDITIONAL UNIVERSITIES TO PARTNER      */}
      {/* ------------------------------------------------------------------------- */}
      <section className="py-20 bg-slate-50 border-t border-brand-border/60" id="university-partnerships-cta">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-border/80 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-brand-purple text-xs font-bold uppercase tracking-wider mb-2">
                Expand Your Reach
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-navy mb-3">
                Together, We Connect Campuses.
              </h2>
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed mb-4">
                Campus Square provides a platform for universities to engage with prospective students, connect with school leaders and families, and showcase their academic programmes.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Showcase academic programmes and courses across multiple cities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Connect with motivated prospective students and parents in school settings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Build long-lasting institutional relationships with school principals</span>
                </li>
              </ul>
            </div>

            <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
              <Link href="/partnerships" className="w-full">
                <Button variant="gradient" size="lg" className="w-full rounded-xl px-8 py-6 text-base font-bold shadow-lg cursor-pointer">
                  Become a University Partner
                </Button>
              </Link>
              <a href="https://wa.me/918056134455" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" size="lg" className="w-full rounded-xl text-xs font-bold">
                  Quick Query on WhatsApp: 8056134455
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* 7. HOST AN EDITION: INVITE SCHOOLS TO COLLABORATE                         */}
      {/* ------------------------------------------------------------------------- */}
      <section className="py-20 bg-white border-t border-brand-border/60" id="host-an-edition">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-slate-900 to-brand-navy text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-brand-turquoise/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-xl relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-turquoise/20 text-brand-turquoise text-xs font-bold uppercase tracking-wider mb-2">
                School Leadership
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
                Bring Campus Square to Your School.
              </h2>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-4">
                Give your students and families an opportunity to explore higher education institutions, discover academic pathways and interact with university representatives.
              </p>
              <p className="text-xs text-gray-300">
                We welcome school management teams, principals and education leaders interested in hosting a Campus Square edition.
              </p>
            </div>

            <div className="shrink-0 relative z-10 w-full md:w-auto">
              <Link href="/host">
                <Button size="lg" className="bg-brand-turquoise text-brand-navy hover:bg-white font-extrabold px-8 py-6 rounded-xl shadow-xl w-full cursor-pointer transition-colors">
                  Discuss Hosting an Edition
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* 8. ABOUT, FAQS AND CONTACT: VERIFIED DETAILS, PRIVACY & TERMS             */}
      {/* ------------------------------------------------------------------------- */}
      <section className="py-12 bg-slate-50 border-t border-brand-border/60">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Categorized 27 FAQs */}
          <CampusSquareFaqSection />
        </div>
      </section>
    </div>
  );
}
