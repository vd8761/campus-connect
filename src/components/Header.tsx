"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Logo } from './Logo';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Editions', href: '/events' },
    { name: 'University Partners', href: '/partnerships' },
    { name: 'Host an Edition', href: '/host' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95">
      <div className="container mx-auto px-4 min-h-[5rem] py-3 flex items-center justify-between">
        {/* Logo area */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${isActive
                  ? 'text-brand-primary font-bold'
                  : 'text-brand-muted hover:text-brand-navy'
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/events/university-fair-2026-theni/register">
            <Button variant="gradient" className="shadow-md">Register Now</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-brand-navy cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-brand-border py-4 px-4 flex flex-col gap-3 shadow-xl z-50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-base font-medium py-2.5 border-b border-brand-light last:border-0 ${isActive ? 'text-brand-primary font-bold' : 'text-brand-navy'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          <Link href="/events/university-fair-2026-theni/register" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="gradient" className="w-full mt-2 shadow-md">Register Now</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
