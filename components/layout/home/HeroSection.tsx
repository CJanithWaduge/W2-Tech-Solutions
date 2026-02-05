'use client';

import { Shield, Lock, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Props = { data?: any };

export default function HeroSection({ data }: Props) {
  const [securityScore, setSecurityScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (securityScore < 100) {
        setSecurityScore(securityScore + 1);
      }
    }, 20);
    return () => clearTimeout(timer);
  }, [securityScore]);

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#0a192f] to-[#112240]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,212,170,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 trust-badge mb-8">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Trusted • Secure • Open</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-[var(--accent)] to-teal-300 bg-clip-text text-transparent">
              {data?.brand?.name ? data.brand.name : 'Project Hub'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
            {data?.brand?.tagline ? data.brand.tagline : 'Explore, learn, and download my latest software tools. Everything is built with care and thoroughly tested.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/downloads">
              <button className="btn-primary flex items-center justify-center gap-2 group hover:bg-opacity-80 active:scale-95">
                Browse All Projects
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/about">
              <button className="btn-secondary flex items-center justify-center gap-2 hover:bg-opacity-80 active:scale-95">
                <Lock size={20} />
                Learn More
              </button>
            </Link>
          </div>

          {/* Live security score */}
          <div className="inline-flex items-center gap-4 p-4 rounded-xl bg-[var(--secondary)]/50 border border-gray-800">
            <div className="text-left">
              <div className="text-sm text-[var(--text-secondary)]">Quality Score</div>
              <div className="text-3xl font-bold text-[var(--accent)]">{securityScore}%</div>
            </div>
            <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--accent)] to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${securityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating security icons */}
      <div className="absolute top-1/4 left-10 animate-pulse">
        <Shield className="w-8 h-8 text-[var(--accent)]/30" />
      </div>
      <div className="absolute bottom-1/4 right-10 animate-pulse delay-1000">
        <Lock className="w-8 h-8 text-[var(--accent)]/30" />
      </div>
    </section>
  );
}