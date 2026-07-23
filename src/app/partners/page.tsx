import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partnerships',
  description: 'Discover our global network of university and educational partners.',
};

const partners = Array(12).fill({
  name: "University Name",
  type: "Educational Partner",
});

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Global Network</h1>
          <p className="text-xl text-gray-300">
            We collaborate with world-leading universities and innovative organizations to bring you the best opportunities.
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <h2 className="text-2xl font-bold text-brand-navy">Featured Universities</h2>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium border border-gray-200 text-brand-primary cursor-pointer hover:bg-gray-50">All</span>
              <span className="px-4 py-2 bg-transparent rounded-full text-sm font-medium border border-transparent text-gray-500 cursor-pointer hover:bg-gray-100">India</span>
              <span className="px-4 py-2 bg-transparent rounded-full text-sm font-medium border border-transparent text-gray-500 cursor-pointer hover:bg-gray-100">International</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((partner, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow group cursor-pointer border-gray-100">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-48">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {/* Placeholder for Logo */}
                    <span className="text-gray-400 font-bold text-xl">LOGO</span>
                  </div>
                  <h3 className="font-semibold text-brand-navy line-clamp-1">{partner.name} {i + 1}</h3>
                  <p className="text-xs text-gray-500 mt-1">{partner.type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-[image:var(--primary-gradient)] rounded-3xl p-10 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Become a Partner</h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join our network to connect directly with ambitious students and leading school networks across the globe.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-none hover:bg-gray-100 font-semibold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all">
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
