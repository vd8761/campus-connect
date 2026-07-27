'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, LogOut, Tags } from 'lucide-react';

export function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white border-r border-brand-border flex flex-col pt-8 hidden md:flex h-screen sticky top-0 overflow-y-auto">
      <div className="px-6 mb-8 flex flex-col items-start">
        <Image 
          src="/campus-connect-logo.png" 
          alt="Campus Connect Logo" 
          width={180} 
          height={60} 
          className="mb-6 object-contain"
          priority
        />
        <h2 className="text-xl font-heading font-bold text-brand-navy">Admin Panel</h2>
      </div>
      <nav className="flex-1 px-4 flex flex-col gap-2">
        <Link 
          href="/admin" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
            isActive('/admin') && pathname === '/admin'
              ? 'bg-brand-purple text-white shadow-md' 
              : 'text-brand-navy hover:bg-brand-light'
          }`}
        >
          <LayoutDashboard size={20} className="shrink-0" />
          <span className="font-medium">Dashboard</span>
        </Link>
        
        <div className="pt-4 pb-1">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Event Management</p>
        </div>

        <Link 
          href="/admin/events" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/admin/events') 
              ? 'bg-brand-purple text-white shadow-md' 
              : 'text-brand-navy hover:bg-brand-light'
          }`}
        >
          <Calendar size={20} className="shrink-0" />
          <span className="font-medium">All Events</span>
        </Link>
        
        <Link 
          href="/admin/event-types" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/admin/event-types') 
              ? 'bg-brand-purple text-white shadow-md' 
              : 'text-brand-navy hover:bg-brand-light'
          }`}
        >
          <Tags size={20} className="shrink-0" />
          <span className="font-medium">Event Types</span>
        </Link>

        <Link 
          href="/admin/participants" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
            isActive('/admin/participants') 
              ? 'bg-brand-purple text-white shadow-md' 
              : 'text-brand-navy hover:bg-brand-light'
          }`}
        >
          <Users size={20} className="shrink-0" />
          <span className="font-medium">Participants</span>
        </Link>
      </nav>
      <div className="p-4 border-t border-brand-border">
        <button 
          onClick={onLogout} 
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors text-left cursor-pointer"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}
