'use client';

import { Github, Linkedin, Mail, Download } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAssetPath } from '@/lib/utils';

type Props = { data?: any };

export default function Footer({ data: initialData }: Props) {
  const [footerData, setFooterData] = useState(initialData);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!initialData) {
      fetch(getAssetPath('/HomePage.json'))
        .then((res) => res.json())
        .then((json) => setFooterData(json))
        .catch((err) => console.error('Error loading footer data:', err));
    } else {
      setFooterData(initialData);
    }
  }, [initialData]);

  const data = footerData;

  return (
    <footer className="relative mt-8 pb-8 overflow-hidden border-t border-gray-800/50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-8">
        {/* Bottom Connectivity Bar */}
        <div className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Copyright Info */}
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-sm font-semibold text-white tracking-wide">
                © {currentYear} {data?.brand?.name ?? 'W2 Tech Solutions'}
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-medium">
                Developed with precision • Distributed with security
              </span>
            </div>

            {/* Social Connectivity - Now at the very bottom */}
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: data?.brand?.socials?.github ?? '#', label: 'GitHub' },
                { icon: Linkedin, href: data?.brand?.socials?.linkedin ?? '#', label: 'LinkedIn' },
                { icon: Mail, href: `mailto:${data?.brand?.socials?.email ?? 'contact@example.com'}`, label: 'Email' },
                { icon: Download, href: '/downloads', label: 'Downloads' },
              ].map((social, idx) => {
                const isExternal = social.href.startsWith('http') || social.href.startsWith('mailto:');
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="group relative p-2.5 bg-[var(--secondary)]/40 border border-gray-800/50 rounded-xl hover:border-[var(--accent)]/50 hover:bg-[var(--secondary)] transition-all duration-300"
                    title={social.label}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    <social.icon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:scale-110 transition-all duration-300" />
                  </a>
                );
              })}
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
              {[
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] font-medium transition-all duration-300 flex items-center gap-1 group"
                >
                  <span>{link.label}</span>
                  <div className="w-1 h-1 bg-[var(--accent)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
