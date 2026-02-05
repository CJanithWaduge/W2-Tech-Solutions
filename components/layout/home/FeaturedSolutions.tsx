'use client';

import { Download, Star, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

type Props = { data?: any };

export default function FeaturedSolutions({ data }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Define color gradients for different projects
  const getColorGradient = (id: string) => {
    const colorMap: Record<string, string> = {
      'agency-pro': 'from-blue-500 to-cyan-400',
      'cli-suite': 'from-green-500 to-emerald-400',
      'db-guard': 'from-purple-500 to-pink-400',
    };
    return colorMap[id] || 'from-blue-500 to-cyan-400';
  };

  // Use projects from data, fallback to empty array if not available
  const projects = data?.projects || [];

  // If no data is loaded yet, show a loading state or placeholder
  if (!data || projects.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">My Projects</h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Loading projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">My Projects</h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Tools I've built to solve real problems. Download them free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          {projects.map((solution: any) => {
            const colorGradient = getColorGradient(solution.id);

            return (
              <Link
                href={`/downloads?project=${solution.id}`}
                key={solution.id}
                className="card relative overflow-hidden group cursor-pointer"
                onMouseEnter={() => setHoveredId(solution.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Header */}
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{solution.name}</h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 text-sm">
                        <span>{solution.version}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                        <span className="text-[var(--accent)]">{solution.license || 'Verified'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold">{solution.rating || '—'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[var(--text-secondary)] mb-6">{solution.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="text-sm text-[var(--text-secondary)] mb-2">Key Features:</div>
                    <div className="flex flex-wrap gap-2">
                      {(solution.features || []).map((feature: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-800/50 rounded-lg text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                  <div
                    className={`h-full bg-gradient-to-r ${colorGradient} transition-all duration-1000`}
                    style={{
                      width: hoveredId === solution.id ? '100%' : '85%',
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}