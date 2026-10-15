'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, ExternalLink, Sparkles, Bell, Calendar as CalendarIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AdminTopBarProps {
  onLogout?: () => void;
}

export function AdminTopBar({ onLogout }: AdminTopBarProps) {
  const pathname = usePathname();

  // Simple breadcrumb label
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname.includes('/events/new')) return 'New Conclave';
    if (pathname.includes('/events')) return 'Conclaves';
    if (pathname.includes('/event-types')) return 'Event Categories';
    if (pathname.includes('/universities')) return 'Universities';
    if (pathname.includes('/participants')) return 'Registered Delegates';
    if (pathname.includes('/recommendations')) return 'DISC Behavioral Profiles';
    return 'Admin';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="h-16 shrink-0 border-b border-brand-border/80 bg-white px-6 md:px-8 flex items-center justify-between z-30">
      {/* Left: Breadcrumbs & Current context */}
      <div className="flex items-center gap-2.5 text-xs">
        <Link href="/admin" className="font-semibold text-brand-purple hover:text-brand-purple/80 transition-colors">
          Campus Square
        </Link>
        <span className="text-slate-300 font-normal">/</span>
        <span className="font-bold text-brand-navy">{getPageTitle()}</span>
      </div>

      {/* Right: Date, Live Site & Status */}
      <div className="flex items-center gap-3">
        {/* Date Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium border border-brand-border/60">
          <CalendarIcon size={13} className="text-brand-purple" />
          <span>{currentDate}</span>
        </div>

        {/* View Live Website Button */}
        <Link 
          href="/" 
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-brand-border/80 bg-white hover:bg-brand-light text-brand-navy text-xs font-bold transition-all shadow-2xs group"
          title="Open Live Website in new tab"
        >
          <span>View Live Site</span>
          <ExternalLink size={12} className="text-brand-purple transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </header>
  );
}
