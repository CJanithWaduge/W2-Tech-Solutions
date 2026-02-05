'use client';

import { Menu, X, Search, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// HomePage configuration type
interface BrandConfig {
  logo?: string;
  name: string;
  tagline?: string;
}

interface HomePageConfig {
  brand: BrandConfig;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [brandConfig, setBrandConfig] = useState<BrandConfig>({ name: 'W2 Tech Solutions', tagline: '' });

  useEffect(() => {
    // Fetch brand configuration from HomePage.json
    fetch('/HomePage.json')
      .then((res) => res.json())
      .then((data: HomePageConfig) => {
        if (data?.brand) {
          setBrandConfig(data.brand);
        }
      })
      .catch((err) => console.error('Failed to load brand config:', err));
  }, []);

  const mainNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Downloads', href: '/downloads' },
    { label: 'Features', href: '/features' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--primary)]/95 backdrop-blur-lg border-b border-gray-800">
      <nav className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {brandConfig.logo ? (
              <Image
                src={brandConfig.logo}
                alt={`${brandConfig.name} Logo`}
                width={60}
                height={60}
                className="group-hover:scale-105 transition-transform object-contain border-2 border-white rounded-lg p-1"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent)] to-teal-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform border-2 border-white">
                <Shield className="w-8 h-8 text-[var(--primary)]" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold">{brandConfig.name}</h1>
              <p className="text-xs text-[var(--text-secondary)]">{brandConfig.tagline || 'Project Portfolio Hub'}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {mainNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}

            {/* Search and User Actions */}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-800">
              <button
                onClick={() => window.location.href = '/downloads'}
                className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors"
                title="Search projects"
              >
                <Search size={20} className="text-[var(--text-secondary)]" />
              </button>
              <Link
                href="/downloads"
                className="bg-gradient-to-r from-[var(--accent)] to-teal-400 text-[var(--primary)] px-6 py-1.5 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all"
              >
                Get Downloads
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            <div className="flex flex-col">
              {mainNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-3 px-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-gray-800/50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile CTA Button */}
              <Link
                href="/downloads"
                className="mt-4 bg-gradient-to-r from-[var(--accent)] to-teal-400 text-[var(--primary)] px-6 py-3 rounded-lg font-bold text-center hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Downloads
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}