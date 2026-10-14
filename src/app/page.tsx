import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import prisma from "@/lib/prisma";
import { MapPin, Calendar, Clock, Users, GraduationCap, Building2, CheckCircle2 } from "lucide-react";
import { getEventStatus } from "@/lib/event-utils";
import { to12HourTime } from "@/lib/dateUtils";
import { UniversityPartnersSection } from "@/components/UniversityPartnersSection";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let rawEvents: any[] = [];
  try {
    rawEvents = await prisma.event.findMany({
      orderBy: { startDate: 'asc' },
    });
  } catch (error) {
    console.warn("Database connection failed. Showing empty state.");
  }

  const getDisplayStatus = (e: any) => {
    if (e.status === 'LIMITED_SEATS') return 'LIMITED_SEATS';
    return getEventStatus(e.startDate, e.endDate, e.registrationOpen, e.registrationClose, e.status === 'DRAFT');
  };

  const allEventsWithStatus = rawEvents.map(e => ({
    ...e,
    displayStatus: getDisplayStatus(e)
  }));

  const events = allEventsWithStatus
    .filter(e => ['OPEN', 'OPENING_SOON', 'LIMITED_SEATS'].includes(e.displayStatus))
    .slice(0, 3);

  let featuredEvent: any = null;
  try {
    featuredEvent = await prisma.event.findFirst({
      where: { featured: true, status: { in: ['OPEN', 'LIMITED_SEATS'] } }
    });
  } catch (error) {
    // console.warn already triggered for rawEvents, no need to duplicate log
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Announcement Bar */}
      <div className="bg-brand-navy text-white text-sm py-2 px-4 text-center">
        <p className="flex items-center justify-center gap-2">
          <span className="font-semibold text-brand-turquoise">New</span>
          Registrations are now open for the School Leaders Conclave 2026 – Trichy Edition.
          <Link href="/events/school-leaders-conclave-trichy-2026" className="underline underline-offset-2 hover:text-brand-turquoise">View Event</Link>
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-10 pb-32">
        <div className="absolute inset-0 z-0 bg-[image:var(--primary-gradient)] opacity-[0.03]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-brand-navy leading-tight mb-6">
            Connecting Education Leaders with <span className="text-transparent bg-clip-text bg-[image:var(--primary-gradient)]">Future Opportunities</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-muted mb-10 text-balance mx-auto">
            Campus Connect is an Indian and International University Fair Series bringing together school leaders, universities, education innovators and future-focused organizations across multiple cities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/events">
              <Button variant="gradient" size="lg">Explore Upcoming Events</Button>
            </Link>
            <Link href="/partners">
              <Button variant="outline" size="lg">Become a Partner</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted Event Platform / Stats */}
      <section className="bg-brand-navy py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            <div>
              <div className="text-3xl md:text-4xl font-bold font-heading mb-2">10+</div>
              <div className="text-sm text-brand-turquoise font-medium uppercase tracking-wider">City Editions</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-heading mb-2">5,000+</div>
              <div className="text-sm text-brand-turquoise font-medium uppercase tracking-wider">School Leaders</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-heading mb-2">200+</div>
              <div className="text-sm text-brand-turquoise font-medium uppercase tracking-wider">Universities</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-heading mb-2">50+</div>
              <div className="text-sm text-brand-turquoise font-medium uppercase tracking-wider">Education Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-navy mb-4">Upcoming Events</h2>
            <p className="text-brand-muted max-w-2xl mx-auto">Discover and register for our upcoming city editions designed to foster collaboration and future-readiness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, i) => {
              const eventImages: Record<string, string> = {
                'school-leaders-conclave-trichy-2026': '/images/event-1.jpg',
                'university-fair-coimbatore-2026': '/images/event-2.jpg',
                'international-education-fair-chennai-2027': '/images/event-3.jpg',
              };
              const imageSrc = event.bannerUrl || eventImages[event.slug] || `/images/event-${(i % 3) + 1}.jpg`;

              return (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-brand-border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="h-48 relative bg-gray-200">
                    <Image
                      src={imageSrc}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-brand-navy/10 mix-blend-multiply"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-navy text-xs font-bold px-3 py-1 rounded-full z-10">
                      {event.displayStatus === 'OPEN' ? 'Registration Open' :
                        event.displayStatus === 'LIMITED_SEATS' ? 'Limited Seats' :
                          event.displayStatus === 'OPENING_SOON' ? 'Opening Soon' :
                            event.displayStatus === 'CLOSED' ? 'Registration Closed' : event.displayStatus}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-sm text-brand-purple font-semibold mb-2">{event.type} • {event.city}</div>
                    <h3 className="text-xl font-heading font-bold text-brand-navy mb-4">{event.title}</h3>
                    <div className="space-y-2 text-[15px] text-brand-muted mb-6 flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-brand-turquoise shrink-0" />
                        {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-brand-turquoise shrink-0" />
                        {to12HourTime(event.startTime) || '10:00 AM'} - {to12HourTime(event.endTime) || '07:00 PM'}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-brand-turquoise shrink-0" />
                        {event.venue || event.city}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <Link href={`/events/${event.slug}`} className="w-full">
                        <Button variant="outline" className="w-full">View Details</Button>
                      </Link>
                      <Link href={`/events/${event.slug}`} className="w-full">
                        <Button variant="default" className="w-full" disabled={event.displayStatus !== 'OPEN' && event.displayStatus !== 'LIMITED_SEATS'}>
                          {['OPEN', 'LIMITED_SEATS'].includes(event.displayStatus) ? 'Register' : event.displayStatus === 'OPENING_SOON' ? 'Coming Soon' : 'Closed'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/events">
              <Button variant="ghost">View All Events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Event / About */}
      {featuredEvent && (
        <section className="py-20 bg-white border-t border-brand-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <div className="inline-block bg-brand-light text-brand-purple px-4 py-1.5 rounded-full text-sm font-semibold mb-6">Featured Event</div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-navy mb-6">
                  {featuredEvent.title}
                </h2>
                <div
                  className="text-lg text-brand-muted mb-8 text-balance [&_p]:inline [&_*]:max-w-full break-words"
                  dangerouslySetInnerHTML={{ __html: featuredEvent.shortDescription || '' }}
                />
                <div className="space-y-4 mb-8 bg-brand-light p-6 rounded-xl border border-brand-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy"><Calendar size={20} /></div>
                    <div>
                      <div className="text-sm text-brand-muted font-medium">Date & Time</div>
                      <div className="font-semibold text-brand-navy">{new Date(featuredEvent.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {to12HourTime(featuredEvent.startTime)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy"><MapPin size={20} /></div>
                    <div>
                      <div className="text-sm text-brand-muted font-medium">Venue</div>
                      <div className="font-semibold text-brand-navy">{featuredEvent.venue}, {featuredEvent.city}</div>
                    </div>
                  </div>
                </div>
                <Link href={`/events/${featuredEvent.slug}`}>
                  <Button variant="gradient" size="lg">Secure Your Spot</Button>
                </Link>
              </div>
              <div className="lg:w-1/2 w-full h-[400px] bg-gray-100 rounded-2xl border border-brand-border overflow-hidden relative">
                <Image
                  src={featuredEvent.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"}
                  alt={featuredEvent.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Future Readiness Partner */}
      <section className="py-20 bg-[image:var(--secondary-gradient)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="uppercase tracking-widest text-sm font-semibold mb-10 text-white/80">
            A Joint Collaboration by
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-12">
            <div className="relative h-20 w-56 md:h-24 md:w-64 bg-white rounded-2xl shadow-xl flex items-center justify-center p-3 transform hover:-translate-y-1 transition-transform">
              <Image src="/atom-logo.png" alt="Atom Infinity Logo" fill unoptimized sizes="(max-width: 768px) 14rem, 16rem" className="object-contain p-2" />
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur text-white font-bold text-xl">
              ✕
            </div>

            <div className="relative h-20 w-56 md:h-24 md:w-64 bg-white rounded-2xl shadow-xl flex items-center justify-center p-3 transform hover:-translate-y-1 transition-transform">
              <Image src="/Origin-BI-Logo-01.png" alt="OriginBI Mindworks" fill unoptimized sizes="(max-width: 768px) 14rem, 16rem" className="object-contain p-2" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Empowering Education Leaders</h2>
          <p className="max-w-3xl mx-auto text-lg text-white/90 mb-10 leading-relaxed">
            We are delighted to present a joint collaboration by <span className="font-bold text-white">Atom Infinity</span> and <span className="font-bold text-white">OriginBI Mindworks</span> for selected conclave editions. Together, we are committed to empowering school leaders with future-focused insights, data-driven innovation and transformative solutions.
          </p>
          <Button variant="outline" className="border-white text-brand-navy bg-white hover:bg-white/90 px-8 py-6 text-base rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
            Learn More About the Collaboration
          </Button>
        </div>
      </section>

      {/* University Partners Section */}
      <UniversityPartnersSection />

      {/* Why Attend */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-navy mb-4">Why Attend Campus Connect</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Connect with Education Leaders", desc: "Network with principals, directors, and decision-makers from top institutions.", icon: Users },
              { title: "Meet Universities", desc: "Interact directly with representatives from leading Indian and International universities.", icon: Building2 },
              { title: "Discover Solutions", desc: "Explore future-ready education technology and service solutions for your institution.", icon: CheckCircle2 },
              { title: "Gain Insights", desc: "Learn from expert speakers and panel discussions on the evolving landscape of education.", icon: GraduationCap },
              { title: "Explore Collaborations", desc: "Build meaningful institutional partnerships and academic collaborations.", icon: Users },
              { title: "Build Networks", desc: "Expand your professional network within the global education ecosystem.", icon: CheckCircle2 },
            ].map((benefit, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-4">
                  <benefit.icon size={24} />
                </div>
                <h3 className="text-xl font-bold font-heading text-brand-navy mb-2">{benefit.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white border-t border-brand-border text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-brand-navy mb-6">Be Part of the Next Campus Connect Edition</h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto mb-10">
            Join thousands of education leaders and institutions shaping the future of global education.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/events">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto px-8">Explore Events</Button>
            </Link>
            <Link href="/partners">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">Become a Partner</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
