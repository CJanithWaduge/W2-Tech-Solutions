import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PolicyNotification from '@/components/PolicyNotification';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'W2 Tech Solutions - Enterprise Security Tools',
  description: 'Production-ready software with military-grade security for modern enterprises',
  keywords: ['enterprise software', 'security tools', 'devops', 'cybersecurity'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
        <PolicyNotification
          endpoint="/terms.json"
          storageKey="terms_accepted_version"
          title="Terms Updated"
          message="We've updated our Terms of Service to be more transparent. Please review the changes."
          linkHref="/terms"
          linkText="Review Terms"
        />
        <PolicyNotification
          endpoint="/Privacy.json"
          storageKey="privacy_accepted_version"
          title="Privacy Policy Updated"
          message="We've updated our Privacy Policy to reflect our commitment to your data security."
          linkHref="/privacy"
          linkText="Review Policy"
        />
      </body>
    </html>
  );
}