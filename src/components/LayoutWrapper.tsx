'use client';

import { usePathname } from 'next/navigation';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function HeaderWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <Header />;
}

export function FooterWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <Footer />;
}
