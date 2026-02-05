"use client";

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/home/Footer';
import HeroSection from '@/components/layout/home/HeroSection';
import TrustBar from '@/components/layout/home/TrustBar';
import FeaturedSolutions from '@/components/layout/home/FeaturedSolutions';
import Workflow from '@/components/layout/home/Workflow';
import SecurityFeed from '@/components/layout/home/SecurityFeed';

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Now we hit our internal API endpoint instead of the public file
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => console.error('Error loading via API:', err));
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* data loaded from /api/projects is available in `data` */}
      <main className="flex-grow">
        <HeroSection data={data} />
        <TrustBar data={data} />
        <FeaturedSolutions data={data} />
        <Workflow />
        <SecurityFeed data={data} />
      </main>
      <Footer data={data} />
    </div>
  );
}