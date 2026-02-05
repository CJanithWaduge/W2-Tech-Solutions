import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/home/Footer';

export const metadata: Metadata = {
  title: 'About | W2 Tech Solutions - Security-Focused Software Architect',
  description: 'Learn about the developer behind W2 Tech Solutions. Security-focused software architect with 8+ years experience building trusted, reliable software.',
  keywords: ['software architect', 'security developer', 'about developer', 'technical background', 'software experience'],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}