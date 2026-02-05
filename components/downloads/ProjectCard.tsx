'use client';

import { Download, Star, ExternalLink, Shield, Monitor, Layout, Terminal, Code, Clock } from 'lucide-react';
import { Project } from '@/types/project';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProjectModal from './ProjectModal';

interface ProjectCardProps {
  project: Project;
  autoOpen?: boolean;
}

export default function ProjectCard({ project, autoOpen }: ProjectCardProps) {
  const [currentRating, setCurrentRating] = useState(project.rating);
  const [userRated, setUserRated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (autoOpen) {
      setShowModal(true);
    }
  }, [autoOpen]);

  // Format downloads number
  const formatDownloads = (downloads: number) => {
    if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}k`;
    }
    return downloads.toString();
  };

  // Get OS icon
  const getOSIcon = (os: string) => {
    const lowerOS = os.toLowerCase();
    if (lowerOS.includes('win')) return '🖥️';
    if (lowerOS.includes('mac')) return '🍎';
    if (lowerOS.includes('linux')) return '🐧';
    return '💻';
  };

  // Get Category icon
  const getCategoryIcon = (category: string) => {
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('desktop')) return <Monitor size={16} />;
    if (lowerCat.includes('web')) return <Layout size={16} />;
    if (lowerCat.includes('cli')) return <Terminal size={16} />;
    return <Code size={16} />;
  };

  const handleDownload = async () => {
    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'download', projectId: project.id }),
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  };

  const handleRate = async (rating: number) => {
    if (userRated) return;
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'rate', projectId: project.id, rating }),
      });
      const data = await res.json();
      if (data.projectStats && data.projectStats[project.id]) {
        setCurrentRating(data.projectStats[project.id].rating);
      }
      setUserRated(true);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  // Check if it's a "Latest Update" (within 30 days)
  const isRecentUpdate = () => {
    const lastUpdate = new Date(project.lastUpdated);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <>
      <div className="card group hover:scale-[1.02] transition-all duration-300 flex flex-col h-full bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent)]/50 hover:shadow-[0_0_20px_rgba(0,212,170,0.1)] overflow-hidden">

        {/* Top Badges Row */}
        <div className="flex items-center justify-between border-b border-gray-800/50 bg-black/10">
          {project.security?.verified ? (
            <div className="px-4 py-1.5 flex items-center gap-2 bg-green-500/10">
              <Shield className="w-3 h-3 text-green-400" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-green-400">Verified Safe</span>
            </div>
          ) : <div />}

          {isRecentUpdate() && (
            <div className="px-4 py-1.5 flex items-center gap-2 bg-blue-500/10">
              <Clock className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">Latest Update</span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[var(--accent)]/10 rounded-xl text-[var(--accent)]">
              {getCategoryIcon(project.category)}
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg mb-2">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-yellow-400">{currentRating}</span>
              </div>
              {!userRated ? (
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      className="text-gray-600 hover:text-yellow-400 transition-colors"
                    >
                      <Star size={12} />
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-green-400 italic">Rated</span>
              )}
            </div>
          </div>

          {/* Title & Version */}
          <div className="mb-3">
            <h3 className="text-xl font-bold mb-1 text-white group-hover:text-[var(--accent)] transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
              <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-400 border border-gray-700">{project.version}</span>
              <span>{project.size}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[var(--text-secondary)] mb-6 line-clamp-3 flex-grow">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map(tech => (
                <span key={tech} className="text-[10px] px-2 py-1 bg-gray-800/50 rounded-md text-gray-400 border border-gray-800">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto space-y-3">
            {/* Compatibility */}
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-3">
              <div className="flex gap-1.5 opacity-70">
                {project.compatibility.map(os => (
                  <span key={os} title={os}>{getOSIcon(os)}</span>
                ))}
              </div>
              <span>{formatDownloads(project.downloads)} Downloads</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="btn-secondary-sm text-center flex items-center justify-center gap-2 py-2"
              >
                <ExternalLink size={14} />
                <span>App Guide</span>
              </button>
              <a
                href={Object.values(project.downloadLinks)[0]?.url || '#'}
                onClick={handleDownload}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-sm text-center flex items-center justify-center gap-2 py-2"
              >
                <Download size={14} />
                <span>Get the App</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ProjectModal
          project={project}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}