'use client';

import { BookOpen, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface SeriesCardProps {
  title: string;
  description: string;
  articleCount: number;
  readTime: number;
  progress?: number;
  color: string;
  icon: React.ReactNode;
}

export default function SeriesCard({ 
  title, 
  description, 
  articleCount, 
  readTime, 
  progress = 0,
  color,
  icon 
}: SeriesCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const gradientClasses: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10',
    green: 'from-green-500/20 to-green-600/10',
    purple: 'from-purple-500/20 to-purple-600/10',
    orange: 'from-orange-500/20 to-orange-600/10',
  };

  return (
    <div 
      className={`card bg-gradient-to-br ${gradientClasses[color]} border-gray-800 hover:scale-[1.02] transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            {icon}
          </div>
          <div className="flex items-center gap-1">
            {progress > 0 && (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">{progress}% complete</span>
              </>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-[var(--text-secondary)] mb-6 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>{articleCount} articles</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{readTime} min total</span>
            </div>
          </div>
          
          <ChevronRight 
            size={20} 
            className={`transition-transform ${isHovered ? 'translate-x-2' : ''}`}
          />
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="mt-4">
            <div className="h-1 bg-gray-800/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}