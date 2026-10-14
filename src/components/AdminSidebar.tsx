'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  LogOut, 
  Tags, 
  Building2, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  const navSections = [
    {
      title: 'Overview',
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/reports/recommendations', label: 'AI Course Mapping', icon: Sparkles, badge: 'AI' },
      ],
    },
    {
      title: 'Event Management',
      items: [
        { href: '/admin/events', label: 'All Conclaves', icon: Calendar },
        { href: '/admin/event-types', label: 'Event Categories', icon: Tags },
      ],
    },
    {
      title: 'Partners & Booths',
      items: [
        { href: '/admin/universities', label: 'University Partners', icon: Building2 },
      ],
    },
    {
      title: 'Attendees & Leads',
      items: [
        { href: '/admin/participants', label: 'Registered Delegates', icon: Users },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-brand-border/80 flex flex-col h-screen sticky top-0 overflow-hidden shrink-0 z-40 select-none">
      {/* Brand Header - Exactly h-16 to seamlessly align with AdminTopBar */}
      <div className="h-16 px-6 border-b border-brand-border/80 flex items-center shrink-0">
        <Link href="/admin" className="flex items-center">
          <Image 
            src="/campus-square-logo-transparent.png" 
            alt="Campus Square" 
            width={160} 
            height={40} 
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-3 space-y-3 overflow-y-auto no-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                      active
                        ? 'bg-brand-purple text-white shadow-sm shadow-brand-purple/20 font-bold'
                        : 'text-slate-600 hover:bg-purple-50/70 hover:text-brand-purple'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon 
                        size={17} 
                        className={`shrink-0 transition-transform group-hover:scale-105 ${
                          active ? 'text-white' : 'text-brand-purple/70'
                        }`} 
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                        active 
                          ? 'bg-white/20 text-white' 
                          : 'bg-brand-purple/10 text-brand-purple'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-brand-border/60 bg-brand-light/30 shrink-0">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-brand-border/80 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand-purple text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              SA
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-brand-navy truncate leading-tight">Super Admin</div>
              <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                <ShieldCheck size={11} className="text-emerald-500 shrink-0" />
                <span>Master Access</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onLogout} 
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
