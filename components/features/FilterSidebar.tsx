'use client';

import { Filter, Clock, ChevronDown, Tag, Calendar } from 'lucide-react';
import { FilterOptions, ArticleCategory } from '@/types/article';
import { useState } from 'react';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  articleCounts: {
    all: number;
    security: number;
    development: number;
    tutorial: number;
    'behind-scenes': number;
    updates: number;
    tools: number;
  };
}

export default function FilterSidebar({ filters, onFilterChange, articleCounts }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'readTime']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const categories: { id: ArticleCategory | 'all', label: string, icon: string }[] = [
    { id: 'all', label: 'All Articles', icon: '📚' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'development', label: 'Development', icon: '💻' },
    { id: 'tutorial', label: 'Tutorials', icon: '📖' },
    { id: 'behind-scenes', label: 'Behind the Scenes', icon: '🎬' },
    { id: 'updates', label: 'Updates', icon: '🔄' },
    { id: 'tools', label: 'Tools & Workflows', icon: '🛠️' },
  ];

  const readTimeOptions = [
    { id: 'all', label: 'Any length', min: 0, max: 999 },
    { id: 'short', label: 'Short (< 5 min)', min: 0, max: 5 },
    { id: 'medium', label: 'Medium (5-10 min)', min: 5, max: 10 },
    { id: 'long', label: 'Long (> 10 min)', min: 10, max: 999 },
  ];

  const sortOptions = [
    { id: 'latest', label: 'Latest first' },
    { id: 'popular', label: 'Most popular' },
    { id: 'read-time', label: 'Reading time' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Filter size={20} />
          Filters
        </h3>
        <button
          onClick={() => onFilterChange({
            category: 'all',
            search: '',
            sortBy: 'latest',
            readTime: 'all'
          })}
          className="text-sm text-[var(--accent)] hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div className="card">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-4"
        >
          <span className="font-bold">Topics</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedSections.includes('category') ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.includes('category') && (
          <div className="space-y-2">
            {categories.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => updateFilter('category', id)}
                className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                  filters.category === id
                    ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </div>
                <span className="text-sm text-[var(--text-secondary)] bg-gray-800/30 px-2 py-1 rounded">
                  {articleCounts[id]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Read Time */}
      <div className="card">
        <button
          onClick={() => toggleSection('readTime')}
          className="flex items-center justify-between w-full mb-4"
        >
          <span className="font-bold flex items-center gap-2">
            <Clock size={16} />
            Read Time
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedSections.includes('readTime') ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.includes('readTime') && (
          <div className="space-y-2">
            {readTimeOptions.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => updateFilter('readTime', id)}
                className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                  filters.readTime === id
                    ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="card">
        <div className="mb-4">
          <span className="font-bold">Sort By</span>
        </div>
        <div className="space-y-2">
          {sortOptions.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => updateFilter('sortBy', id)}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                filters.sortBy === id
                  ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Archive */}
      <div className="card">
        <button
          onClick={() => toggleSection('archive')}
          className="flex items-center justify-between w-full mb-4"
        >
          <span className="font-bold flex items-center gap-2">
            <Calendar size={16} />
            Archive
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedSections.includes('archive') ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.includes('archive') && (
          <div className="space-y-2">
            {[
              { year: '2024', quarters: ['Q1', 'Q2'], count: 6 },
              { year: '2023', quarters: ['Q1', 'Q2', 'Q3', 'Q4'], count: 18 },
              { year: '2022', quarters: ['Q3', 'Q4'], count: 9 },
            ].map(({ year, quarters, count }) => (
              <div key={year} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{year}</span>
                  <span className="text-[var(--text-secondary)]">{count} articles</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-2">
                  {quarters.map((quarter) => (
                    <button
                      key={`${year}-${quarter}`}
                      className="px-2 py-1 text-xs rounded bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                    >
                      {quarter}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags Cloud */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={16} />
          <span className="font-bold">Popular Tags</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['security', 'electron', 'tutorial', 'workflow', 'code-signing', 'verification', 'devops', 'react'].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 bg-gray-800/30 hover:bg-gray-800/50 text-sm rounded-full transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}