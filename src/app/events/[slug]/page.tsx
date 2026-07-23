import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Clock, GraduationCap, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug }
  });

  if (!event) {
    notFound();
  }

  const isRegistrationOpen = ['OPEN', 'LIMITED_SEATS'].includes(event.status);

  const eventImages: Record<string, string> = {
    'school-leaders-conclave-trichy-2026': '/images/event-1.jpg',
    'university-fair-coimbatore-2026': '/images/event-2.jpg',
    'international-education-fair-chennai-2027': '/images/event-3.jpg',
  };
  const imageSrc = eventImages[event.slug] || '/images/event-1.jpg';

  return (
    <div className="bg-brand-light min-h-screen pb-20">
      {/* Breadcrumbs & Simple Header */}
      <div className="bg-white border-b border-brand-border py-4 relative z-20">
        <div className="container mx-auto px-4 flex items-center text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-purple transition-colors">Home</Link>
          <ChevronRight size={14} className="mx-2 opacity-50" />
          <Link href="/events" className="hover:text-brand-purple transition-colors">Events</Link>
          <ChevronRight size={14} className="mx-2 opacity-50" />
          <span className="text-brand-navy font-medium truncate">{event.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative text-white py-16 md:py-24 overflow-hidden">
        {/* Background Image with Premium Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={imageSrc} 
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brand-navy/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="inline-block bg-white/10 backdrop-blur border border-white/20 text-brand-turquoise px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              {event.type}
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 leading-tight">
              {event.title}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mb-8 text-balance">
              {event.shortDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isRegistrationOpen ? (
                <Link href={`/events/${event.slug}/register`}>
                  <Button variant="gradient" size="lg" className="w-full sm:w-auto px-10">Register Now</Button>
                </Link>
              ) : (
                <Button variant="outline" size="lg" disabled className="bg-white/10 text-white border-white/20">
                  Registration {event.status === 'OPENING_SOON' ? 'Opening Soon' : 'Closed'}
                </Button>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/3 space-y-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <h3 className="font-heading font-semibold text-xl mb-4">Event Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Calendar className="text-brand-turquoise mt-1" size={20} />
                  <div>
                    <div className="text-sm text-white/70">Date</div>
                    <div className="font-medium">{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="text-brand-turquoise mt-1" size={20} />
                  <div>
                    <div className="text-sm text-white/70">Time</div>
                    <div className="font-medium">{event.startTime} - {event.endTime}</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="text-brand-turquoise mt-1" size={20} />
                  <div>
                    <div className="text-sm text-white/70">Venue</div>
                    <div className="font-medium">{event.venue}</div>
                    <div className="text-sm text-white/80">{event.city}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-12">
        <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/3 p-8 md:p-12 md:border-r border-brand-border">
            <h2 className="text-2xl font-heading font-bold text-brand-navy mb-6 flex items-center gap-2">
              <FileText className="text-brand-purple" /> About The Event
            </h2>
            <div className="prose prose-brand max-w-none text-brand-muted space-y-4">
              {(event.fullDescription || '').split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <h2 className="text-2xl font-heading font-bold text-brand-navy mt-12 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-brand-purple" /> What to Expect
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-brand-muted">
                <span className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center text-brand-purple flex-shrink-0 mt-0.5">•</span>
                <span>Direct networking opportunities with international university delegates.</span>
              </li>
              <li className="flex items-start gap-3 text-brand-muted">
                <span className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center text-brand-purple flex-shrink-0 mt-0.5">•</span>
                <span>Panel discussions on the future of global education and student readiness.</span>
              </li>
              <li className="flex items-start gap-3 text-brand-muted">
                <span className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center text-brand-purple flex-shrink-0 mt-0.5">•</span>
                <span>Exclusive resources and collateral from participating institutions.</span>
              </li>
            </ul>
          </div>
          
          <div className="md:w-1/3 bg-brand-light p-8 md:p-12 flex flex-col justify-center">
            <div className="text-center">
              <GraduationCap className="w-16 h-16 text-brand-turquoise mx-auto mb-6 opacity-80" />
              <h3 className="text-xl font-heading font-bold text-brand-navy mb-4">Secure Your Attendance</h3>
              <p className="text-brand-muted text-sm mb-8">
                Registrations are required for entry. A unique QR code will be generated for your check-in.
              </p>
              {isRegistrationOpen ? (
                <Link href={`/events/${event.slug}/register`}>
                  <Button variant="gradient" size="lg" className="w-full">Proceed to Registration</Button>
                </Link>
              ) : (
                <Button variant="outline" size="lg" className="w-full" disabled>
                  Registration Closed
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
