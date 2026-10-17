import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from './Logo';
import { Mail, Phone, MessageSquare, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        {/* Joint Collaboration Banner */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-turquoise/20 text-brand-turquoise text-xs font-bold uppercase tracking-wider mb-2">
              Collaborative Initiative
            </div>
            <h4 className="text-lg font-heading font-bold text-white mb-1">
              Campus Square — A Collaborative Initiative by Atom Infinity and OriginBI Mindworks
            </h4>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              We are delighted to present a joint collaboration by Atom Infinity and OriginBI Mindworks for selected conclave editions. Together, we are committed to empowering school leaders with future-focused insights, data-driven innovation and transformative solutions.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 bg-white/90 p-3 rounded-xl shadow-md">
            <div className="relative h-10 w-28">
              <Image src="/atom-logo.png" alt="Atom Infinity" fill unoptimized className="object-contain" />
            </div>
            <span className="text-brand-navy font-bold text-sm">✕</span>
            <div className="relative h-10 w-28">
              <Image src="/Origin-BI-Logo-01.png" alt="OriginBI Mindworks" fill unoptimized className="object-contain" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
              <Logo light />
            </Link>
            <p className="text-brand-turquoise text-xs font-semibold uppercase tracking-wider mb-2">
              Connect Campuses.
            </p>
            <p className="text-gray-300 text-xs leading-relaxed mb-4">
              Schools. Universities. Students. Opportunities.
            </p>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              Campus Square is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-base mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-brand-turquoise transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-brand-turquoise transition-colors">About Campus Square</Link></li>
              <li><Link href="/events" className="hover:text-brand-turquoise transition-colors">Upcoming Editions</Link></li>
              <li><Link href="/partnerships" className="hover:text-brand-turquoise transition-colors">University Partners</Link></li>
              <li><Link href="/host" className="hover:text-brand-turquoise transition-colors">Host an Edition</Link></li>
              <li><Link href="/gallery" className="hover:text-brand-turquoise transition-colors">Event Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-base mb-4 text-white">Support & Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/faq" className="hover:text-brand-turquoise transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-brand-turquoise transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-brand-turquoise transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-turquoise transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-base mb-4 text-white">Official Contact</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-brand-turquoise shrink-0" />
                <a href="https://wa.me/918056134455" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  8056134455 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-turquoise shrink-0" />
                <a href="mailto:interact@atom-infinity.com" className="hover:text-white transition-colors">
                  interact@atom-infinity.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <MapPin className="w-4 h-4 text-brand-turquoise shrink-0 mt-0.5" />
                <span className="text-xs text-gray-300 leading-relaxed">
                  Tamarai Tech Park (Level 5), S.P.Plot No.16-19 & 20-A, Thiru Vi Ka Industrial Estate, Guindy, Chennai, Tamil Nadu 600032
                </span>
              </li>
              <li className="pt-1 border-t border-white/10 mt-2">
                <p className="text-[11px] text-gray-400">
                  First Edition: The Little Kingdom School, Theni • Saturday, 24 October 2026
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; {currentYear} Campus Square. All rights reserved.</p>
          <p>Where Education Meets Opportunity • Connect Campuses.</p>
        </div>
      </div>
    </footer>
  );
}
