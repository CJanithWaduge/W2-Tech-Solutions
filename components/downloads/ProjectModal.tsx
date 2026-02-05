'use client';

import { X, Download, ExternalLink, Monitor, Apple, Cpu, Star } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { useState } from 'react';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentRating, setCurrentRating] = useState(project.rating);
  const [userRated, setUserRated] = useState(false);

  const getOSIcon = (os: string) => {
    switch (os) {
      case 'windows':
        return Monitor;
      case 'macos':
        return Apple;
      case 'linux':
        return Cpu;
      default:
        return Monitor;
    }
  };

  const getOSLabel = (os: string) => {
    switch (os) {
      case 'windows':
        return 'Windows';
      case 'macos':
        return 'macOS';
      case 'linux':
        return 'Linux';
      default:
        return os;
    }
  };

  const handleDownload = async (url: string) => {
    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'download', projectId: project.id }),
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }
    window.location.href = url;
    onClose();
  };

  const handleRate = async (rating: number) => {
    if (userRated) return;
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const availableOS = Object.keys(project.downloadLinks) as Array<'windows' | 'macos' | 'linux'>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="card w-[95%] h-[95%] max-w-[850px] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-[var(--secondary)] z-10">
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-grow overflow-y-auto">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-[var(--text-secondary)]">{project.longDescription}</p>
            </div>
            <div className="flex flex-col items-end ml-4">
              <div className="flex items-center gap-1 bg-yellow-400/10 px-3 py-1.5 rounded-lg mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-yellow-400">{currentRating}</span>
              </div>
              {!userRated ? (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      className="text-gray-600 hover:text-yellow-400 transition-colors"
                    >
                      <Star size={16} />
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-green-400 italic">Thank you for rating!</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Version</h3>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-lg">
                v{project.version}
              </span>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Size</h3>
              <span className="text-[var(--text-secondary)]">{project.size}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Download for Your OS</h3>
            <div className="grid grid-cols-1 gap-2">
              {availableOS.map((os) => {
                const Icon = getOSIcon(os);
                const link = project.downloadLinks[os];
                return (
                  <button
                    key={os}
                    onClick={() => handleDownload(link.url)}
                    className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-lg bg-[var(--accent)]/20 group-hover:bg-[var(--accent)]/30 transition-colors">
                      <Icon className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold">{getOSLabel(os)}</div>
                      <div className="text-sm text-[var(--text-secondary)]">{link.size}</div>
                    </div>
                    <Download className="w-5 h-5 text-[var(--accent)]" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <span className="px-3 py-1 bg-gray-800/50 text-xs rounded-full capitalize">{project.category}</span>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Key Features</h3>
            <div className="space-y-2">
              {project.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-[var(--accent)]">•</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-800/30 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-800">
            <Link
              href={`/projects/${project.id}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg btn-secondary"
              onClick={onClose}
            >
              <ExternalLink size={16} />
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}