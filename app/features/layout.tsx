import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/home/Footer';

export const metadata: Metadata = {
  title: 'Features & Insights | W2 Tech Solutions - Technical Articles & Tutorials',
  description: 'Technical articles, tutorials, and development insights from the W2 Tech Solutions team. Learn about software security, development workflows, and best practices.',
  keywords: ['software development', 'technical articles', 'programming tutorials', 'security guides', 'developer insights'],
};

export default function FeaturesLayout({
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