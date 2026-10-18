'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function UniversitySidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <div className="w-56 bg-white border-r border-brand-border flex flex-col pt-6 hidden md:flex h-screen sticky top-0 overflow-y-auto shrink-0">
      <div className="px-5 mb-6 flex flex-col items-start">
        <Image 
          src="/campus-square-logo-transparent.png" 
          alt="Campus Square™ Logo" 
          width={150} 
          height={50} 
          className="mb-4 object-contain"
          style={{ width: 'auto', height: 'auto' }}
          priority
        />
        <h2 className="text-sm font-heading font-bold text-brand-navy">University Portal</h2>
      </div>
      <nav className="flex-1 px-3 flex flex-col gap-1.5">
        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booth Management</p>
        </div>

        <Link 
          href="/university/attendance" 
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
            isActive('/university/attendance') 
              ? 'bg-brand-purple text-white shadow-md font-bold' 
              : 'text-brand-navy hover:bg-brand-light font-medium'
          }`}
        >
          <Calendar size={18} className="shrink-0" />
          <span>My Events</span>
        </Link>
      </nav>
      <div className="p-3 border-t border-brand-border">
        <button 
          onClick={() => signOut({ callbackUrl: '/university/login' })} 
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium transition-colors text-left cursor-pointer"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
