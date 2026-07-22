import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PrismaClient } from "@prisma/client";
import { MapPin, Calendar, Users, GraduationCap, Building2, CheckCircle2 } from "lucide-react";

const prisma = new PrismaClient();

export default async function Home() {
  const events = await prisma.event.findMany({
    where: { status: { in: ['OPEN', 'OPENING_SOON', 'LIMITED_SEATS'] } },
    orderBy: { startDate: 'asc' },
    take: 3
  });

  const featuredEvent = await prisma.event.findFirst({
    where: { featured: true, status: { in: ['OPEN', 'LIMITED_SEATS'] } }
  });

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
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
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
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-brand-border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {/* Placeholder for event banner */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-navy text-xs font-bold px-3 py-1 rounded-full">
                    {event.status === 'OPEN' ? 'Registration Open' : event.status === 'OPENING_SOON' ? 'Opening Soon' : event.status}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-sm text-brand-purple font-semibold mb-2">{event.type} • {event.city}</div>
                  <h3 className="text-xl font-heading font-bold text-brand-navy mb-4">{event.title}</h3>
                  <div className="space-y-2 text-sm text-brand-muted mb-6 flex-1">
                    <div className="flex items-center gap-2"><Calendar size={16} /> {new Date(event.startDate).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><MapPin size={16} /> {event.venue || event.city}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Link href={`/events/${event.slug}`} className="w-full">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                    <Link href={`/events/${event.slug}`} className="w-full">
                      <Button variant="default" className="w-full" disabled={event.status !== 'OPEN' && event.status !== 'LIMITED_SEATS'}>Register</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
                <p className="text-lg text-brand-muted mb-8 text-balance">
                  {featuredEvent.shortDescription}
                </p>
                <div className="space-y-4 mb-8 bg-brand-light p-6 rounded-xl border border-brand-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy"><Calendar size={20} /></div>
                    <div>
                      <div className="text-sm text-brand-muted font-medium">Date & Time</div>
                      <div className="font-semibold text-brand-navy">{new Date(featuredEvent.startDate).toLocaleDateString()} • {featuredEvent.startTime}</div>
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
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-brand-navy/5 flex items-center justify-center">
                  <span className="text-brand-muted font-medium">Event Image Preview</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Future Readiness Partner */}
      <section className="py-16 bg-[image:var(--secondary-gradient)] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="uppercase tracking-widest text-sm font-semibold mb-4 text-white/80">Future Readiness Partner</div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">OriginBI Mindworks</h2>
          <p className="max-w-3xl mx-auto text-lg text-white/90 mb-8">
            We are delighted to announce OriginBI Mindworks as the Future Readiness Partner for selected conclave editions. Together, we are committed to empowering school leaders with future-focused insights, data-driven innovation and transformative solutions.
          </p>
          <Button variant="outline" className="border-white text-brand-navy bg-white hover:bg-white/90">Learn More About the Partnership</Button>
        </div>
      </section>

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
