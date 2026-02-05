import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/home/Footer';

export const metadata: Metadata = {
  title: 'Downloads | W2 Tech Solutions - Secure Software Downloads',
  description: 'Download verified and code-signed software projects. All downloads include SHA-256 checksums for verification.',
};

export default function DownloadsLayout({
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