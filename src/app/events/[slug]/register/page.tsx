import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { SmartRegistration } from './SmartRegistration';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getEventStatus } from '@/lib/event-utils';
import { OriginBIHighlightBox } from '@/components/OriginBIHighlightBox';

export const dynamic = 'force-dynamic';

export default async function RegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let event: any = null;
  try {
    event = await prisma.event.findUnique({
      where: { slug }
    });
  } catch (error) {
    console.warn("Database connection failed on Event register page (Network blocked).");
  }

  if (!event) {
    notFound();
  }
  
  const status = getEventStatus(
    event.startDate,
    event.endDate,
    event.registrationOpen,
    event.registrationClose,
    event.status === 'DRAFT'
  );

  if (!['OPEN', 'LIMITED_SEATS'].includes(status)) {
    notFound(); // Optionally show a "Registration Closed" page instead
  }

  return (
    <div className="bg-brand-light min-h-screen pb-20">
      <div className="bg-white border-b border-brand-border py-4">
        <div className="container mx-auto px-4 flex items-center text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-purple">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href="/events" className="hover:text-brand-purple">Events</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href={`/events/${event.slug}`} className="hover:text-brand-purple truncate max-w-[200px]">{event.title}</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-brand-navy font-medium">Register</span>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-brand-navy mb-4">Event Registration</h1>
          <p className="text-brand-muted">
            Registering for: <strong className="text-brand-navy">{event.title}</strong>
          </p>
        </div>

        {/* OriginBI Assessment Highlight Box */}
        <OriginBIHighlightBox className="mb-8" />

        <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden">
          <div className="bg-[image:var(--secondary-gradient)] p-6 text-white">
            <h2 className="text-xl font-heading font-bold">Participant Details</h2>
            <p className="text-white/80 text-sm mt-1">Please provide accurate information for your event pass.</p>
          </div>
          
          <div className="p-8">
            <SmartRegistration eventId={event.id} eventSlug={event.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
