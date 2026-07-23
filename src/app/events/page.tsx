import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PrismaClient } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Clock, GraduationCap } from 'lucide-react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upcoming Events',
  description: 'Browse and register for upcoming university fairs and educational conclaves.',
};

const prisma = new PrismaClient();

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'asc' }
  });

  const openEvents = events.filter(e => ['OPEN', 'LIMITED_SEATS'].includes(e.status));
  const upcomingEvents = events.filter(e => e.status === 'OPENING_SOON');
  const pastEvents = events.filter(e => e.status === 'COMPLETED');

  return (
    <div className="bg-brand-light min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-brand-navy text-white pt-16 pb-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-6">Explore Our Events</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Join the premier Indian & International University Fair Series. Find an upcoming conclave in your city and secure your spot today.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        
        {/* Open Events Section */}
        {openEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-heading font-bold text-brand-navy mb-8 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-status-success animate-pulse"></span>
              Open for Registration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {openEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-heading font-bold text-brand-navy mb-8 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-status-warning"></span>
              Opening Soon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index + openEvents.length} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <div className="mb-16 opacity-75">
            <h2 className="text-2xl font-heading font-bold text-brand-navy mb-8">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index + openEvents.length + upcomingEvents.length} />
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl border border-brand-border shadow-sm">
            <div className="w-16 h-16 bg-brand-light text-brand-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold font-heading text-brand-navy mb-2">No Events Found</h3>
            <p className="text-brand-muted mb-6">Check back later for our newly announced city editions.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, index = 0 }: { event: any, index?: number }) {
  const eventImages: Record<string, string> = {
    'school-leaders-conclave-trichy-2026': '/images/event-1.jpg',
    'university-fair-coimbatore-2026': '/images/event-2.jpg',
    'international-education-fair-chennai-2027': '/images/event-3.jpg',
  };
  const imageSrc = eventImages[event.slug] || '/images/event-1.jpg';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-brand-border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="h-48 relative bg-gray-200">
        <Image
          src={imageSrc}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[image:var(--primary-gradient)] opacity-10 mix-blend-multiply"></div>
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-brand-navy text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
          {event.status === 'OPEN' ? 'Registration Open' : 
           event.status === 'LIMITED_SEATS' ? 'Limited Seats' : 
           event.status === 'OPENING_SOON' ? 'Opening Soon' : 'Completed'}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-brand-purple font-semibold flex items-center gap-1">
            <GraduationCap size={16} /> {event.type}
          </div>
          <div className="text-xs font-medium text-brand-muted uppercase tracking-wider">{event.city}</div>
        </div>
        
        <h3 className="text-xl font-heading font-bold text-brand-navy mb-4 leading-tight">{event.title}</h3>
        
        <div className="space-y-2 text-sm text-brand-muted mb-6 flex-1">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-brand-turquoise" /> 
            {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-brand-turquoise" /> 
            {event.startTime} - {event.endTime}
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-brand-turquoise mt-1 flex-shrink-0" /> 
            <span className="line-clamp-2">{event.venue}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Link href={`/events/${event.slug}`} className="w-full">
            <Button variant="outline" className="w-full">Details</Button>
          </Link>
          <Link href={['OPEN', 'LIMITED_SEATS'].includes(event.status) ? `/events/${event.slug}/register` : `/events/${event.slug}`} className="w-full">
            <Button 
              variant={['OPEN', 'LIMITED_SEATS'].includes(event.status) ? "gradient" : "default"} 
              className="w-full" 
              disabled={!['OPEN', 'LIMITED_SEATS'].includes(event.status)}
            >
              {['OPEN', 'LIMITED_SEATS'].includes(event.status) ? 'Register' : 'Closed'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
