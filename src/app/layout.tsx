import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { HeaderWrapper, FooterWrapper } from "@/components/LayoutWrapper";
import { TopProgressBar } from "@/components/ui/TopProgressBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    template: '%s | Campus Square™',
    default: 'Campus Square™ | Connect Campuses',
  },
  description: "Campus Square™ is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.",
  keywords: [
    "Campus Square™",
    "Connect Campuses",
    "University Fair India",
    "School Hosted University Fair",
    "Higher Education Fair",
    "Student Career Opportunities",
    "OriginBI Assessment",
    "Top Universities in India"
  ],
  authors: [{ name: "Campus Square™ - Atom Infinity & OriginBI" }],
  creator: "Campus Square™",
  publisher: "Campus Square™",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Campus Square™ | Connect Campuses',
    description: 'Campus Square™ is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.',
    url: siteUrl,
    siteName: 'Campus Square™',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/campus-square-logo-main.jpg',
        width: 1200,
        height: 630,
        alt: 'Campus Square™ - Connect Campuses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Square™ | A University Fair Series',
    description: 'Campus Square™ - A University Fair Series, a joint collaboration by Atom Infinity and Origin Bi, bringing schools and universities together to connect students with higher education opportunities.',
    images: ['/campus-square-logo-main.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Campus Square™',
  ...(siteUrl ? { url: siteUrl, logo: `${siteUrl}/campus-square-logo-main.jpg` } : { logo: '/campus-square-logo-main.jpg' }),
  description: 'Connecting ambitious school leaders and forward-thinking universities to create global opportunities for students across India.',
  telephone: '+91-8056134455',
  email: 'interact@atom-infinity.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Tamarai Tech Park (Level 5), S.P.Plot No.16-19 & 20-A, Thiru Vi Ka Industrial Estate, Guindy',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    postalCode: '600032',
    addressCountry: 'IN'
  },
  sameAs: [
    'https://www.facebook.com',
    'https://www.instagram.com',
    'https://www.linkedin.com'
  ]
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <TopProgressBar />
        <HeaderWrapper />
        <main className="flex-1">{children}</main>
        <FooterWrapper />
      </body>
    </html>
  );
}
