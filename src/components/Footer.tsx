import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from './Logo';
import { Mail, Phone, MessageSquare, MapPin } from 'lucide-react';
import { WhatsAppIcon } from './ui/WhatsAppIcon';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
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
              Campus Square™ is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-base mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-brand-turquoise transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-brand-turquoise transition-colors">About Campus Square™</Link></li>
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
                <WhatsAppIcon className="w-4 h-4 text-brand-turquoise shrink-0" />
                <a href="https://wa.me/918056134455" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +91 80561 34455 (WhatsApp)
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
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; {currentYear} Campus Square™. All rights reserved.</p>
          <p>Where Education Meets Opportunity • Connect Campuses.</p>
        </div>
      </div>
    </footer>
  );
}
