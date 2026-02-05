import Header from '@/components/layout/Header';
import Footer from '@/components/layout/home/Footer';
import HeroSection from '@/components/layout/home/HeroSection';
import TrustBar from '@/components/layout/home/TrustBar';
import FeaturedSolutions from '@/components/layout/home/FeaturedSolutions';
import Workflow from '@/components/layout/home/Workflow';
import SecurityFeed from '@/components/layout/home/SecurityFeed';
import { getPortfolioData } from '@/lib/data';

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
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