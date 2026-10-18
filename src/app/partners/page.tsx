import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { UNIVERSITY_PARTNERS } from '@/data/university-partners';
import { MapPin, Sparkles, Building2, ExternalLink } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our University Partners | Campus Square™',
  description: 'We are proud to collaborate with universities and higher education institutions to connect schools, students and parents with meaningful academic opportunities.',
};

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-brand-light pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(91,39,217,0.25),_transparent_70%)] pointer-events-none"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-turquoise text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur">
            <Sparkles size={14} />
            <span>Campus Square™ University Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6 tracking-tight">
            Our University <span className="text-transparent bg-clip-text bg-[image:var(--primary-gradient)]">Partners</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
            We are proud to collaborate with universities and higher education institutions to connect schools, students and parents with meaningful academic opportunities.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/partnerships#enquiry-form">
              <Button variant="gradient" size="lg">Become a University Partner</Button>
            </Link>
            <a href="https://wa.me/918056134455" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-navy flex items-center gap-2">
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                <span>WhatsApp: +91 80561 34455</span>
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-navy">All Participating Institutions</h2>
              <p className="text-sm text-brand-muted mt-1">
                Associated across our school-hosted university fairs and academic editions
              </p>
            </div>
            <Link href="/partnerships#enquiry-form">
              <Button variant="default" size="sm">Partner With Us</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {UNIVERSITY_PARTNERS.map((partner) => (
              <Card
                key={partner.id}
                className="hover:shadow-lg transition-all duration-300 group border-brand-border/80 bg-white rounded-2xl overflow-hidden hover:border-brand-purple/40 hover:-translate-y-1 flex flex-col"
              >
                <CardContent className="p-6 flex flex-col items-center justify-between text-center flex-1">
                  {/* Logo Container with Strict Equal Sizing & Seamless White Background */}
                  <div className="w-full h-24 relative flex items-center justify-center mb-4 p-2">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      unoptimized
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px"
                    />
                  </div>

                  {/* Institution Details */}
                  <div className="w-full flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-purple mb-1.5">
                        {partner.category}
                      </div>
                      <h3 className="font-heading font-bold text-base text-brand-navy line-clamp-2 mb-2 group-hover:text-brand-purple transition-colors">
                        {partner.name}
                      </h3>
                      {partner.description && (
                        <p className="text-xs text-brand-muted line-clamp-2 mb-4 leading-relaxed">
                          {partner.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-brand-muted w-full">
                      <MapPin size={13} className="text-brand-turquoise shrink-0" />
                      <span className="truncate">{partner.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 mt-6">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-[image:var(--primary-gradient)] rounded-3xl p-10 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
            <div
              className="absolute inset-0 bg-white/10"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            ></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Become a University Partner
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join our network to connect directly with ambitious students and leading school leaders across India and abroad.
              </p>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-none bg-white text-brand-navy hover:bg-gray-100 font-semibold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
