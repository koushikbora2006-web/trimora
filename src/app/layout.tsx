import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'John Salon | Premium Grooming Experience & AI StyleScan',
  description: 'Discover a refined grooming experience where expert craftsmanship meets personalized style. Featuring John Salon Concierge AI, StyleScan face analysis, and bespoke grooming services at Bhanugudi Junction, Kakinada.',
  keywords: ['John Salon', 'Luxury Salon Kakinada', 'Premium Grooming', 'AI Hairstyle Recommendation', 'Bhanugudi Junction Salon', 'John Salon KKD'],
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
