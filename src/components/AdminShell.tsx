'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';

interface AdminShellProps {
  onLogout: () => void;
  children: React.ReactNode;
}

export function AdminShell({ onLogout, children }: AdminShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile navigation drawer whenever the route changes
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile navigation drawer is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  return (
    <div className="h-screen overflow-hidden bg-white flex relative">
      {/* Mobile Backdrop Overlay */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Desktop static, Mobile slide-over drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <AdminSidebar onLogout={onLogout} onCloseMobile={() => setIsMobileNavOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden bg-white">
        <AdminTopBar
          onLogout={onLogout}
          onToggleMobileNav={() => setIsMobileNavOpen(prev => !prev)}
          isMobileNavOpen={isMobileNavOpen}
        />
        <main className="flex-1 overflow-y-auto bg-slate-50/80">
          {children}
        </main>
      </div>
    </div>
  );
}
