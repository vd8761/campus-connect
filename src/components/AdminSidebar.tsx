'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, LogOut, Tags, Building2, Settings2, Sparkles } from 'lucide-react';

export function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="w-56 bg-white border-r border-brand-border flex flex-col pt-6 hidden md:flex h-screen sticky top-0 overflow-y-auto shrink-0">
      <div className="px-5 mb-6 flex flex-col items-start">
        <Image 
          src="/campus-connect-logo.png" 
          alt="Campus Connect Logo" 
          width={150} 
          height={50} 
          className="mb-4 object-contain"
          style={{ width: 'auto', height: 'auto' }}
          priority
        />
        <h2 className="text-lg font-heading font-bold text-brand-navy">Admin Panel</h2>
      </div>
      <nav className="flex-1 px-3 flex flex-col gap-1.5">
        <Link 
          href="/admin" 
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
            isActive('/admin') && pathname === '/admin'
              ? 'bg-brand-purple text-white shadow-md font-bold' 
              : 'text-brand-navy hover:bg-brand-light font-medium'
          }`}
        >
          <LayoutDashboard size={18} className="shrink-0" />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          href="/admin/reports/recommendations" 
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
            isActive('/admin/reports/recommendations') 
              ? 'bg-brand-purple text-white shadow-md font-bold' 
              : 'text-brand-navy hover:bg-brand-light font-medium'
          }`}
        >
          <Sparkles size={18} className="shrink-0 text-brand-purple" />
          <span>AI Course Mapping</span>
        </Link>
        
        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Event Management</p>
        </div>

        <Link 
          href="/admin/events" 
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
            isActive('/admin/events') 
              ? 'bg-brand-purple text-white shadow-md font-bold' 
              : 'text-brand-navy hover:bg-brand-light font-medium'
          }`}
        >
          <Calendar size={18} className="shrink-0" />
          <span>All Events</span>
        </Link>
        
        <Link 
          href="/admin/event-types" 
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
            isActive('/admin/event-types') 
              ? 'bg-brand-purple text-white shadow-md font-bold' 
              : 'text-brand-navy hover:bg-brand-light font-medium'
          }`}
        >
          <Tags size={18} className="shrink-0" />
          <span>Event Types</span>
        </Link>
        
        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Universities & Booths</p>
        </div>

        <Link 
          href="/admin/universities" 
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
            isActive('/admin/universities') 
              ? 'bg-brand-purple text-white shadow-md font-bold' 
              : 'text-brand-navy hover:bg-brand-light font-medium'
          }`}
        >
          <Building2 size={18} className="shrink-0" />
          <span>Universities</span>
        </Link>
        
        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Attendees</p>
        </div>

        <Link 
          href="/admin/participants" 
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
            isActive('/admin/participants') 
              ? 'bg-brand-purple text-white shadow-md font-bold' 
              : 'text-brand-navy hover:bg-brand-light font-medium'
          }`}
        >
          <Users size={18} className="shrink-0" />
          <span>Participants</span>
        </Link>
      </nav>
      <div className="p-3 border-t border-brand-border">
        <button 
          onClick={onLogout} 
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium transition-colors text-left cursor-pointer"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
