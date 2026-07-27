import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { HeaderWrapper, FooterWrapper } from "@/components/LayoutWrapper";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Campus Connect',
    default: 'Campus Connect | Indian & International University Fair Series',
  },
  description: "Connecting ambitious school leaders and forward-thinking universities to create global opportunities for students.",
  keywords: ["University Fair", "Education", "Students", "School Leaders", "Global Education"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <HeaderWrapper />
        <main className="flex-1">{children}</main>
        <FooterWrapper />
      </body>
    </html>
  );
}
