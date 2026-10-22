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
  ExternalLink,
  Sparkles
} from "lucide-react";
import { to12HourTime } from "@/lib/dateUtils";
import { getEventStatus } from "@/lib/event-utils";
import { ORIGINBI_ASSESSMENT_AMOUNT } from "@/lib/constants";
import { UniversityPartnersSection } from "@/components/UniversityPartnersSection";
import { StakeholdersSection } from "@/components/StakeholdersSection";
import { AboutOriginBISection } from "@/components/AboutOriginBISection";
import { OriginBIBenefitsSection } from "@/components/OriginBIBenefitsSection";
import { CampusSquareFaqSection } from "@/components/CampusSquareFaqSection";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

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

  // Find the primary Theni Edition
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

  // Determine status of Theni event and find currently active open event
  const theniStatus = theniEvent 
    ? getEventStatus(
        new Date(theniEvent.startDate), 
        new Date(theniEvent.endDate || theniEvent.startDate), 
        theniEvent.registrationOpen ? new Date(theniEvent.registrationOpen) : null, 
        theniEvent.registrationClose ? new Date(theniEvent.registrationClose) : null, 
        theniEvent.status === 'DRAFT'
      )
    : 'CLOSED';

  const isTheniOpen = ['OPEN', 'LIMITED_SEATS'].includes(theniStatus);

  // Dynamically find all events that are currently accepting registrations
  const openEvents = rawEvents.filter(e => {
    const s = getEventStatus(
      e.startDate ? new Date(e.startDate) : null, 
      e.endDate ? new Date(e.endDate) : (e.startDate ? new Date(e.startDate) : null), 
      e.registrationOpen ? new Date(e.registrationOpen) : null, 
      e.registrationClose ? new Date(e.registrationClose) : null, 
      e.status === 'DRAFT',
      e.isDateTba
    );
    return ['OPEN', 'LIMITED_SEATS'].includes(s);
  });
  const hasMultipleOpenEvents = openEvents.length > 1;
  const hasZeroOpenEvents = openEvents.length === 0;
  const activeOpenEvent = openEvents.length > 0 ? openEvents[0] : (isTheniOpen ? theniEvent : null);

  // Featured Event: The first open event, or default to theniEvent
  const featuredEvent = openEvents[0] || theniEvent;
  const featuredEventStatus = getEventStatus(
    featuredEvent.startDate ? new Date(featuredEvent.startDate) : null,
    featuredEvent.endDate ? new Date(featuredEvent.endDate) : (featuredEvent.startDate ? new Date(featuredEvent.startDate) : null),
    featuredEvent.registrationOpen ? new Date(featuredEvent.registrationOpen) : null,
    featuredEvent.registrationClose ? new Date(featuredEvent.registrationClose) : null,
    featuredEvent.status === 'DRAFT',
    featuredEvent.isDateTba
  );
  const isFeaturedOpen = ['OPEN', 'LIMITED_SEATS'].includes(featuredEventStatus);

  const isFeaturedDateTba = featuredEvent.isDateTba || !featuredEvent.startDate;
  const featuredDateFormatted = isFeaturedDateTba
    ? 'Date To Be Announced'
    : new Date(featuredEvent.startDate).toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

  const featuredTimeFormatted = isFeaturedDateTba || (!featuredEvent.startTime && !featuredEvent.endTime)
    ? 'Timings To Be Announced'
    : `${to12HourTime(featuredEvent.startTime) || '1:00 PM'} - ${to12HourTime(featuredEvent.endTime) || '4:00 PM'}`;

  const featuredVenue = featuredEvent.isVenueTba || !featuredEvent.venue 
    ? `${featuredEvent.city} Host School Partner (Venue TBA)` 
    : featuredEvent.venue;

  // Other database events (excluding the current featured one)
  const otherDbEvents = rawEvents.filter(e => e.id !== featuredEvent.id);

  // Future pipeline cities that do not yet exist as concrete records in the DB
  const pipelineCities = [
    { city: "Coimbatore", defaultVenue: "Host School Partner", date: "Coming in 2026/2027" },
    { city: "Trichy", defaultVenue: "Host School Partner", date: "Coming in 2026/2027" },
    { city: "Chennai", defaultVenue: "Host School Partner", date: "Coming in 2026/2027" },
    { city: "Bengaluru", defaultVenue: "Host School Partner", date: "Coming in 2026/2027" },
  ].filter(p => !rawEvents.some(e => e.city?.toLowerCase() === p.city.toLowerCase()));

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ------------------------------------------------------------------------- */}
      {/* 1. HERO: CAMPUS SQUARE™ - REGISTRATION & ASSESSMENT FREE VISIBLE AT TOP  */}
      {/* ------------------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-brand-navy to-slate-900 text-white pt-10 sm:pt-14 pb-20">
        {/* Glow gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-turquoise/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
          {/* Joint Initiative Credential */}
          <div className="flex flex-col items-center justify-center gap-2.5 mb-8">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-300">
              A joint collaboration by
            </span>
            <div className="inline-flex items-center gap-4 sm:gap-6 bg-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl border border-white/20">
              <div className="relative h-8 w-28 sm:h-10 sm:w-36 md:h-11 md:w-40">
                <Image
                  src="/atom-logo.png"
                  alt="Atom Infinity"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              <span className="text-brand-navy font-bold text-base sm:text-xl">✕</span>
              <div className="relative h-8 w-28 sm:h-10 sm:w-36 md:h-11 md:w-40">
                <Image
                  src="/Origin-BI-Logo-01.png"
                  alt="OriginBI Mindworks"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Main Hero Typography */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-white mb-2">
            CAMPUS SQUARE<sup>TM</sup>
          </h1>

          <p className="text-lg sm:text-xl font-heading font-semibold text-brand-turquoise mb-3 tracking-wide">
            Connect Campuses.
          </p>

          <p className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-100 to-white mb-4">
            A University Fair Series
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
            Campus Square™ - A University Fair Series, a joint collaboration by Atom Infinity and Origin Bi, bringing schools and universities together to connect students with higher education opportunities.
          </p>

          {/* TOP REGISTRATION & FREE ORIGINBI ASSESSMENT OFFER CARD (Visible immediately without scrolling) */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl max-w-4xl mx-auto mb-8 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-turquoise/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-white/15 pb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-turquoise/15 border border-brand-turquoise/30 text-brand-turquoise text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles size={14} className="text-brand-turquoise shrink-0" />
                <span>Special Fair Privilege</span>
              </div>
              <span className="text-xs font-semibold text-white/90 bg-white/10 px-3.5 py-1.5 rounded-full w-fit border border-white/15 shadow-xs">
                Worth ₹{ORIGINBI_ASSESSMENT_AMOUNT} • 100% Free with Registration
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2.5 flex items-center gap-2.5">
              <GraduationCap size={22} className="text-brand-turquoise shrink-0" />
              <span>Register Free & Unlock Your Personalised Career Roadmap</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-6">
              Choosing the right college and course after school is a crucial decision for every parent. Meet admissions teams from reputed universities face-to-face, ask questions openly, and receive a free OriginBI psychometric assessment (Worth ₹{ORIGINBI_ASSESSMENT_AMOUNT}) revealing your child&apos;s natural talents and best-fit degrees.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
              {hasMultipleOpenEvents ? (
                <Link
                  href="/register"
                  className="flex-1"
                >
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full rounded-xl py-6 text-base font-extrabold shadow-lg shadow-brand-purple/40 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Register Free - Choose Your Edition</span>
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              ) : activeOpenEvent ? (
                <Link
                  href={`/events/${activeOpenEvent.slug}/register`}
                  className="flex-1"
                >
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full rounded-xl py-6 text-base font-extrabold shadow-lg shadow-brand-purple/40 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Register Free - Assessment Included</span>
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              ) : (
                <Link
                  href="#upcoming-editions"
                  className="flex-1"
                >
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full rounded-xl py-6 text-base font-extrabold shadow-lg shadow-brand-purple/40 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Explore Upcoming Editions & Pre-Register</span>
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              )}

              <Link
                href="#upcoming-editions"
                className="sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-xl py-6 text-sm font-bold border-white/30 text-white bg-white/5 hover:bg-white hover:text-brand-navy cursor-pointer transition-all"
                >
                  Explore Editions & Partners
                </Button>
              </Link>
            </div>

            {/* Universal Multi-Edition Trust Pillars (Evergreen across all editions) */}
            <div className="pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-brand-turquoise shrink-0" />
                <span>School-Hosted University Fairs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-brand-turquoise shrink-0" />
                <span>Leading Exhibiting Universities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-brand-turquoise shrink-0" />
                <span>1-Page Career Pathway Report</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 max-w-xl mx-auto">
            {activeOpenEvent ? (
              <>Once you register, you&apos;ll receive your online assessment link by email. Complete it before or during the event to download your detailed profile report on the spot!</>
            ) : (
              <>Registrations for the current edition have concluded. Explore our upcoming multi-city fair series below to stay informed and pre-register for the next edition!</>
            )}
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* 2. UNIVERSITY PARTNERS: PROMINENT DISPLAY OF EXISTING PARTNER LOGOS      */}
      {/* ------------------------------------------------------------------------- */}
      <UniversityPartnersSection />

      {/* ------------------------------------------------------------------------- */}
      {/* 3. UPCOMING EDITIONS: THENI, FOLLOWED BY FUTURE LOCATIONS                 */}
      {/* ------------------------------------------------------------------------- */}
      <section className="py-20 bg-slate-50 border-t border-brand-border/60" id="upcoming-editions">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-purple/20">
              <Calendar size={14} />
              <span>Multi-City Fair Series</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-brand-navy tracking-tight mb-4">
              {hasZeroOpenEvents ? 'Fair Editions & Tour Locations' : 'Upcoming Editions'}
            </h2>

            <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
              {hasMultipleOpenEvents
                ? `Campus Square™ is currently open across ${openEvents.length} school editions. Choose your city below to register free.`
                : hasZeroOpenEvents
                  ? 'Our recent school fair editions have concluded. Explore participating universities from past editions or nominate your school for our next tour.'
                  : 'Campus Square™ is hosted at different schools across various cities.'}
            </p>
          </div>

          {/* Featured Card: Dynamic Current / Featured Edition */}
          <div className="bg-white rounded-3xl border-2 border-brand-purple/30 shadow-xl overflow-hidden mb-10 hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-brand-navy via-[#320846] to-brand-navy text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-turquoise text-brand-navy text-xs font-extrabold uppercase tracking-wider">
                  {featuredEvent.city} Edition
                </span>
                <span className="text-sm font-semibold text-white/90">
                  {isFeaturedOpen ? 'Registration Open' : featuredEventStatus === 'COMPLETED' ? 'Edition Concluded' : 'Registration Closed'}
                </span>
              </div>
              <span className="text-xs text-white/70">
                {hasMultipleOpenEvents
                  ? `${openEvents.length} Active Editions Open`
                  : isFeaturedOpen
                    ? 'Admission: Completely Free'
                    : 'Recap & Booth Directory Available'}
              </span>
            </div>

            <div className="p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="inline-block text-xs font-bold uppercase tracking-wider text-brand-purple">
                  School-Hosted University Fair
                </div>

                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy">
                  Campus Square™ - {featuredVenue}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-navy font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Calendar size={18} className="text-brand-purple shrink-0" />
                    <span>{featuredDateFormatted}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-navy font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Clock size={18} className="text-brand-purple shrink-0" />
                    <span>{featuredTimeFormatted}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-navy font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <MapPin size={18} className="text-brand-purple shrink-0" />
                    <span>{featuredVenue}</span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto shrink-0 flex flex-col gap-3">
                {isFeaturedOpen ? (
                  <Link href={`/events/${featuredEvent.slug}/register`} className="w-full">
                    <Button variant="gradient" size="lg" className="w-full rounded-xl py-6 text-base font-bold shadow-lg shadow-brand-purple/20">
                      Register for {featuredEvent.city} Edition
                    </Button>
                  </Link>
                ) : (
                  <Link href="/host" className="w-full">
                    <Button variant="gradient" size="lg" className="w-full rounded-xl py-6 text-sm sm:text-base font-bold shadow-lg shadow-brand-purple/20 cursor-pointer flex items-center justify-center gap-2">
                      <Building2 size={18} />
                      <span>Nominate Your School to Host</span>
                    </Button>
                  </Link>
                )}
                <Link href={`/events/${featuredEvent.slug}`} className="w-full">
                  <Button variant="outline" size="lg" className="w-full rounded-xl">
                    {isFeaturedOpen ? 'View Event Details & Booths' : 'View Concluded Booths & Directory'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Editions Pipeline: Shows any other DB editions + future cities */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h4 className="text-lg font-heading font-bold text-brand-navy text-center sm:text-left">
                {hasMultipleOpenEvents
                  ? 'Other Active & Upcoming Editions'
                  : hasZeroOpenEvents
                    ? 'Upcoming Tour Cities in Planning'
                    : 'Upcoming Tour Locations'}
              </h4>
              {hasMultipleOpenEvents && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-center">
                  {openEvents.length} Editions Open for Registration
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Other Database Editions */}
              {otherDbEvents.map((dbEvent) => {
                const s = getEventStatus(
                  dbEvent.startDate ? new Date(dbEvent.startDate) : null,
                  dbEvent.endDate ? new Date(dbEvent.endDate) : (dbEvent.startDate ? new Date(dbEvent.startDate) : null),
                  dbEvent.registrationOpen ? new Date(dbEvent.registrationOpen) : null,
                  dbEvent.registrationClose ? new Date(dbEvent.registrationClose) : null,
                  dbEvent.status === 'DRAFT',
                  dbEvent.isDateTba
                );
                const isOpen = ['OPEN', 'LIMITED_SEATS'].includes(s);
                const isOpeningSoon = s === 'OPENING_SOON';
                const isDateTba = dbEvent.isDateTba || !dbEvent.startDate;
                const formattedDate = isDateTba
                  ? 'Date TBA'
                  : new Date(dbEvent.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                return (
                  <div key={dbEvent.id} className="bg-white rounded-2xl p-5 border border-brand-border/80 shadow-xs flex flex-col justify-between hover:border-brand-purple/40 hover:shadow-md transition-all">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isOpen 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : isOpeningSoon 
                            ? 'bg-purple-50 text-purple-700' 
                            : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isOpen ? 'Registration Open' : isOpeningSoon ? 'Opening Soon' : 'Completed Edition'}
                      </span>
                      <h5 className="text-xl font-heading font-bold text-brand-navy mt-2 mb-1">
                        {dbEvent.city} Edition
                      </h5>
                      <p className="text-xs text-brand-muted mb-3 truncate">
                        {dbEvent.isVenueTba || !dbEvent.venue ? 'Venue To Be Announced' : dbEvent.venue}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-purple font-medium">
                      <span>{formattedDate}</span>
                      <Link 
                        href={isOpen ? `/events/${dbEvent.slug}/register` : `/events/${dbEvent.slug}`} 
                        className="hover:underline font-bold"
                      >
                        {isOpen ? 'Register Now →' : 'View Details →'}
                      </Link>
                    </div>
                  </div>
                );
              })}

              {/* Pipeline Future Editions */}
              {pipelineCities.map((pipe, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-brand-border/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      Announcing Soon
                    </span>
                    <h5 className="text-xl font-heading font-bold text-brand-navy mt-2 mb-1">
                      {pipe.city} Edition
                    </h5>
                    <p className="text-xs text-brand-muted mb-3">
                      {pipe.defaultVenue}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-purple font-medium">
                    <span>{pipe.date}</span>
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
                Campus Square™ provides a platform for universities to engage with prospective students, connect with school leaders and parents, and showcase their academic programmes.
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
                <Button variant="outline" size="lg" className="w-full rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2">
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Quick Query on WhatsApp: +91 80561 34455</span>
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
                Bring Campus Square™ to Your School.
              </h2>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-4">
                Give your students and parents an opportunity to explore higher education institutions, discover academic pathways and interact with university representatives.
              </p>
              <p className="text-xs text-gray-300">
                We welcome school management teams, principals and education leaders interested in hosting a Campus Square™ edition.
              </p>
            </div>

            <div className="shrink-0 relative z-10 w-full md:w-auto">
              <Link href="/host">
                <Button 
                  variant="white" 
                  size="lg" 
                  className="bg-white hover:bg-slate-100 text-brand-navy font-extrabold px-8 py-6 rounded-2xl shadow-xl w-full cursor-pointer transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
                >
                  <span className="text-brand-navy font-extrabold">Discuss Hosting an Edition</span>
                  <ArrowRight size={18} className="text-brand-navy shrink-0 group-hover:translate-x-1 transition-transform" />
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
