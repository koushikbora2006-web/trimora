import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'John Salon | Trimorva — Luxury Grooming Experience & AI StyleScan',
  description: 'Discover John Salon on Trimorva, Kakinada’s premier luxury grooming atelier. Featuring grounded RAG concierge AI, StyleScan face analysis, and bespoke grooming services on Cinema Hall Road.',
  keywords: ['John Salon', 'Trimorva', 'Luxury Salon Kakinada', 'Premium Grooming', 'AI Hairstyle Recommendation', 'Cinema Hall Road Salon', 'John Salon KKD'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#F7F4EE] antialiased selection:bg-[#C5A880]/30 selection:text-[#FAF8F5]">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
