'use client';

import { Filter, Tag, Monitor, ChevronDown, Layers, Terminal } from 'lucide-react';

// In my previous step I updated FilterState to have specific string unions or strings.
// Let's check what I updated in project.ts.
// export interface FilterState {
//   category: Category | 'all'; -> Category is now string union
//   os: OS | 'all'; -> OS is now string union
// ...
// }
// Wait, in my previous `write_to_file` for `project.ts`, I defined `Category` as 'Desktop Apps' | ... 
// But in `FilterSidebar` I need to match those.

import { useState } from 'react';

interface FilterSidebarProps {
  filters: any; // Using any temporarily if types mismatch, but better to use proper type
  onFilterChange: (filters: any) => void;
  projects: any[]; // For counts
  onCategorySelect?: (category: string) => void;
  availableFilters?: { // New prop to pass dynamic filters from JSON
    categories: string[];
    operatingSystems: string[];
    techStack: string[];
  }
}

export default function FilterSidebar({ filters, onFilterChange, projects, onCategorySelect, availableFilters }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'os']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Helper to safely get unique values if not provided
  const getCategories = () => availableFilters?.categories || ['Desktop Apps', 'Web Tools', 'CLI Tools', 'Libraries'];
  const getOSs = () => availableFilters?.operatingSystems || ['Windows', 'macOS', 'Linux'];
  const getTechs = () => availableFilters?.techStack || ['React', 'Electron', 'Node.js'];

  // Calculate counts
  const getCount = (field: string, value: string) => {
    if (!projects) return 0;
    if (field === 'category') return projects.filter(p => p.category === value).length;
    if (field === 'os') return projects.filter(p => p.compatibility?.includes(value)).length;
    if (field === 'tech') return projects.filter(p => p.tags?.includes(value)).length;
    return 0;
  };

  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Filter size={20} className="text-[var(--accent)]" />
          <span>Filters</span>
        </h3>
        <button
          onClick={() => onFilterChange({
            category: 'All Projects',
            os: 'All OS',
            tags: [],
            search: '',
            sortBy: 'latest' // We'll keep sort logic in page
          })}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div className="card p-4 border border-gray-800 bg-[var(--secondary)]/50">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <span className="font-bold text-sm flex items-center gap-2 group-hover:text-[var(--accent)] transition-colors">
            <Layers size={16} /> Category
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform text-gray-500 ${expandedSections.includes('category') ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.includes('category') && (
          <div className="space-y-1">
            <button
              onClick={() => {
                updateFilter('category', 'All Projects');
                onCategorySelect?.('All Projects');
              }}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${filters.category === 'All Projects'
                ? 'bg-[var(--accent)] text-[var(--primary)] font-bold shadow-lg shadow-[var(--accent)]/20'
                : 'text-[var(--text-secondary)] hover:bg-gray-800'
                }`}
            >
              <span>All Projects</span>
              <span className="opacity-60 text-xs bg-black/20 px-1.5 py-0.5 rounded">{projects.length}</span>
            </button>
            {getCategories().filter(c => c !== 'All Projects').map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  updateFilter('category', cat);
                  onCategorySelect?.(cat);
                }}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${filters.category === cat
                  ? 'bg-[var(--accent)] text-[var(--primary)] font-bold shadow-lg shadow-[var(--accent)]/20'
                  : 'text-[var(--text-secondary)] hover:bg-gray-800'
                  }`}
              >
                <span>{cat}</span>
                <span className={`opacity-60 text-xs px-1.5 py-0.5 rounded ${filters.category === cat ? 'bg-black/20' : 'bg-gray-800'}`}>
                  {getCount('category', cat)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Operating Systems */}
      <div className="card p-4 border border-gray-800 bg-[var(--secondary)]/50">
        <button
          onClick={() => toggleSection('os')}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <span className="font-bold text-sm flex items-center gap-2 group-hover:text-[var(--accent)] transition-colors">
            <Monitor size={16} /> OS Compatibility
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform text-gray-500 ${expandedSections.includes('os') ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.includes('os') && (
          <div className="space-y-1">
            <button
              onClick={() => updateFilter('os', 'All OS')}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${filters.os === 'All OS'
                ? 'bg-[var(--accent)] text-[var(--primary)] font-bold'
                : 'text-[var(--text-secondary)] hover:bg-gray-800'
                }`}
            >
              <span>Any OS</span>
            </button>
            {getOSs().filter(o => o !== 'All OS').map((os) => (
              <button
                key={os}
                onClick={() => updateFilter('os', os)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${filters.os === os
                  ? 'bg-[var(--accent)] text-[var(--primary)] font-bold'
                  : 'text-[var(--text-secondary)] hover:bg-gray-800'
                  }`}
              >
                <span>{os}</span>
                <span className={`opacity-60 text-xs px-1.5 py-0.5 rounded ${filters.os === os ? 'bg-black/20' : 'bg-gray-800'}`}>
                  {getCount('os', os)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tech Stack */}
      <div className="card p-4 border border-gray-800 bg-[var(--secondary)]/50">
        <button
          onClick={() => toggleSection('tech')}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <span className="font-bold text-sm flex items-center gap-2 group-hover:text-[var(--accent)] transition-colors">
            <Tag size={16} /> Frameworks
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform text-gray-500 ${expandedSections.includes('tech') ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.includes('tech') && (
          <div className="flex flex-wrap gap-2">
            {getTechs().map((tech) => {
              const isSelected = filters.tags.includes(tech);
              return (
                <button
                  key={tech}
                  onClick={() => {
                    const newTags = isSelected
                      ? filters.tags.filter((t: string) => t !== tech)
                      : [...filters.tags, tech];
                    updateFilter('tags', newTags);
                  }}
                  className={`px-3 py-1.5 rounded text-xs border transition-all ${isSelected
                    ? 'bg-[var(--accent)] text-[var(--primary)] border-[var(--accent)] font-bold'
                    : 'bg-transparent border-gray-700 text-[var(--text-secondary)] hover:border-gray-500'
                    }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Installation Tip - Added as per Visual Guide */}
      <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-l-4 border-blue-500/50">
        <div className="flex items-center gap-2 mb-2 text-blue-400">
          <Layers size={16} /> {/* Using Layers as a placeholder for a lightbulb/info icon if needed, or stick to blue theme */}
          <span className="font-bold text-sm">Installation Tip</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          For a smooth setup, always run as administrator and check the App Guide for your OS. This ensures all features work perfectly!
        </p>
      </div>
    </div>
  );
}