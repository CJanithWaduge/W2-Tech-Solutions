'use client';

import { Clock, Calendar, Eye, MessageCircle, ArrowRight, Tag } from 'lucide-react';
import { Article } from '@/types/article';
import Link from 'next/link';
import { useState } from 'react';
import { getAssetPath } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Category colors
  const categoryColors: Record<string, string> = {
    security: 'bg-red-500/10 text-red-400 border-red-500/20',
    development: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    tutorial: 'bg-green-500/10 text-green-400 border-green-500/20',
    'behind-scenes': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    updates: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    tools: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (variant === 'compact') {
    return (
      <Link href={`/features/${article.slug}`}>
        <div
          className="card p-4 hover:border-[var(--accent)] transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${categoryColors[article.category]}`}>
                  {article.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Clock size={12} />
                  <span>{article.readTime} min</span>
                </div>
              </div>
              <h3 className="font-bold mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{article.excerpt}</p>
            </div>
            <ArrowRight
              size={20}
              className={`transition-transform ${isHovered ? 'translate-x-1' : ''}`}
            />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/features/${article.slug}`}>
        <div
          className="card group hover:scale-[1.01] transition-all duration-300 overflow-hidden flex flex-col md:flex-row gap-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Large Image Section */}
          <div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative">
            <img
              src={article.coverImage ? getAssetPath(article.coverImage) : getAssetPath('/images/Articles/default-cover.jpg')}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a192f] hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] to-transparent md:hidden" />

            {/* Featured badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-gradient-to-r from-[var(--accent)] to-teal-400 text-[var(--primary)] text-xs font-bold rounded-full shadow-lg">
                Featured
              </span>
            </div>
          </div>

          <div className="md:w-1/2 p-5 md:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 text-sm rounded-full ${categoryColors[article.category] || 'bg-gray-800/50 text-gray-400'}`}>
                  {article.category}
                </span>
                {article.series && (
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-800/50">
                    Series: {article.series}
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-xl font-black mb-3 group-hover:text-[var(--accent)] transition-colors leading-tight">
                {article.title}
              </h2>
              <p className="text-[var(--text-secondary)] mb-4 text-sm line-clamp-2 md:line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{article.readTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{formatDate(article.publishDate)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span className="text-xs font-bold">{(article.views || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent)] to-teal-400 transition-all duration-1000"
              style={{ width: isHovered ? '100%' : '85%' }}
            />
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/features/${article.slug}`}>
      <div
        className="card group hover:scale-[1.02] transition-all duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image wrapper */}
        <div className="relative h-36 md:h-40 w-full overflow-hidden">
          <img
            src={article.coverImage ? getAssetPath(article.coverImage) : getAssetPath('/images/Articles/default-cover.jpg')}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] to-transparent opacity-60" />
        </div>

        {/* Header */}
        <div className="p-4 md:p-5">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 text-sm rounded-full ${categoryColors[article.category] || 'bg-gray-800/50 text-gray-400'}`}>
                {article.category ? article.category.charAt(0).toUpperCase() + article.category.slice(1) : 'General'}
              </span>
              {article.series && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-800/50">
                  Part {article.seriesOrder}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
              {article.title}
            </h3>

            <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800/30 text-xs rounded-full"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-800/20 text-xs rounded-full">
                +{article.tags.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{article.readTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(article.publishDate)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span className="text-xs">{(article.views || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={12} />
                <span className="text-xs">
                  {(() => {
                    if (Array.isArray(article.comments)) return article.comments.length;
                    if (typeof article.comments === 'number' || typeof article.comments === 'string') return article.comments;
                    return 0;
                  })()}
                </span>
              </div>
              <ArrowRight
                size={16}
                className={`transition-transform ${isHovered ? 'translate-x-1' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}