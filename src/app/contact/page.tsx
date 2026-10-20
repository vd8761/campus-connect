import React from 'react';
import { Metadata } from 'next';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Campus Square™',
  description: 'Have questions about our university fairs, editions, partnerships, or registrations? Connect with the Campus Square™ team.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Campus Square™',
    description: 'Have questions about our university fairs, editions, partnerships, or registrations? Connect with the Campus Square™ team.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-10 sm:pt-14 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-300">
            Have questions about our events, partnerships, or registrations? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 -mt-10">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

            {/* Contact Info (Left) */}
            <div className="bg-brand-navy text-white p-10 md:p-14 md:w-2/5 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>

              <div className="relative z-10 flex-1">
                <div className="inline-block px-3 py-1 rounded-full bg-brand-turquoise/20 text-brand-turquoise text-xs font-bold uppercase tracking-wider mb-4">
                  Official Contact
                </div>
                <h3 className="text-3xl font-heading font-bold mb-4">Contact Information</h3>
                <p className="text-gray-300 text-xs sm:text-sm mb-8 leading-relaxed">
                  Campus Square™ - A University Fair Series, a joint collaboration by <strong>Atom Infinity</strong> and <strong>OriginBI Mindworks</strong>.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <WhatsAppIcon className="w-6 h-6 text-brand-turquoise mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-base mb-1">WhatsApp & Call</h4>
                      <a href="https://wa.me/918056134455" target="_blank" rel="noopener noreferrer" className="text-brand-turquoise hover:underline text-sm font-semibold block">
                        +91 80561 34455 (WhatsApp)
                      </a>
                      <p className="text-gray-400 text-xs mt-0.5">Quick inquiries & event coordination</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-brand-turquoise mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-base mb-1">Official Email</h4>
                      <a href="mailto:interact@atom-infinity.com" className="text-brand-turquoise hover:underline text-sm font-semibold block">
                        interact@atom-infinity.com
                      </a>
                      <p className="text-gray-400 text-xs mt-0.5">University partnerships & school hosting</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-brand-turquoise mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-base mb-1">Office Address</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        21-B, 5th Cross St, Thiru Vi Ka Industrial Estate,<br />
                        Indira Nagar, Ramapuram, St.Thomas Mount,<br />
                        Chennai, Tamil Nadu 600032
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-brand-turquoise mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-base mb-1">Upcoming Event Venue</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        The Little Kingdom School,<br />
                        Theni, Tamil Nadu, India<br />
                        Saturday, 24 October 2026 (1:00 PM - 4:00 PM)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-300">
                  <p className="font-medium text-white mb-1">Collaborative Leadership</p>
                  <p className="leading-relaxed">
                    Atom Infinity & OriginBI Mindworks empowering school leaders, students, and university partners.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form Component (Right) */}
            <ContactForm />

          </div>
        </div>
      </section>
    </main>
  );
}
