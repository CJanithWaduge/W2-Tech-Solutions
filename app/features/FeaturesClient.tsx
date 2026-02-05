'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, X } from 'lucide-react';
import ArticleCard from '@/components/features/ArticleCard';
import SeriesCard from '@/components/features/SeriesCard';
import { Article, ArticleCategory } from '@/types/article';

export default function FeaturesClient({ initialArticles }: { initialArticles: Article[] }) {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>(initialArticles);
    const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredArticles, setFeaturedArticles] = useState<Article[]>(initialArticles.filter(a => a.featured).slice(0, 2));

    // Apply filters
    useEffect(() => {
        let result = [...articles];

        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            result = result.filter(article =>
                article.title.toLowerCase().includes(searchLower) ||
                article.excerpt.toLowerCase().includes(searchLower) ||
                article.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                (article.content && article.content.toLowerCase().includes(searchLower))
            );
        }

        if (selectedCategory !== 'all') {
            result = result.filter(article => article.category === selectedCategory);
        }

        result.sort((a, b) =>
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );

        setFilteredArticles(result);
    }, [articles, selectedCategory, searchQuery]);

    const categories: { id: ArticleCategory | 'all', label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'security', label: 'Security' },
        { id: 'development', label: 'Dev' },
        { id: 'tutorial', label: 'Tutorials' },
        { id: 'tools', label: 'Tools' },
        { id: 'updates', label: 'Updates' },
    ];

    const series = [
        {
            title: 'Security Deep Dive',
            description: 'Zero to Hero in App Security',
            articleCount: 5,
            readTime: 25,
            progress: 40,
            color: 'blue',
            icon: <span className="text-xl">🛡️</span>
        },
        {
            title: 'Developer Toolkit',
            description: 'Modern Workflows & Tools',
            articleCount: 4,
            readTime: 34,
            progress: 50,
            color: 'green',
            icon: <span className="text-xl">🛠️</span>
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a192f]">
            <div className="relative pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                    <span className="text-[var(--text-primary)]">Knowledge</span>
                                    <span className="text-[var(--accent)]">Base</span>
                                </h1>
                                <p className="text-[var(--text-secondary)] text-lg max-w-xl">
                                    Deep dives into security, development, and the tech behind W2 Solutions.
                                </p>
                            </div>
                        </div>

                        <div className="w-full md:w-auto min-w-[300px]">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[var(--secondary)] border border-gray-800 rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-16 border-b border-gray-800 pb-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id
                                    ? 'bg-[var(--accent)] text-[var(--primary)] shadow-[0_0_15px_rgba(0,212,170,0.3)]'
                                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {selectedCategory === 'all' && !searchQuery && featuredArticles.length > 0 && (
                        <div className="mb-20">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp className="text-[var(--accent)]" size={20} />
                                <h2 className="text-xl font-bold">Featured Insights</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {featuredArticles.map((article) => (
                                    <ArticleCard key={article.id} article={article} variant="featured" />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {selectedCategory === 'all' && !searchQuery ? (
                                    <>
                                        <Clock className="text-[var(--accent)]" size={20} />
                                        Latest Articles
                                    </>
                                ) : (
                                    <>
                                        <Search className="text-[var(--accent)]" size={20} />
                                        {filteredArticles.length} Result{filteredArticles.length !== 1 ? 's' : ''}
                                    </>
                                )}
                            </h2>
                        </div>

                        {filteredArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredArticles.map((article) => (
                                    <ArticleCard key={article.id} article={article} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-[var(--secondary)] rounded-xl border border-gray-800 border-dashed">
                                <div className="text-4xl mb-4 opacity-50">🔭</div>
                                <h3 className="text-xl font-bold mb-2">No articles found</h3>
                                <p className="text-gray-400">
                                    Try adjusting your search or category filter.
                                </p>
                                <button
                                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                                    className="mt-6 text-[var(--accent)] hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>

                    {selectedCategory === 'all' && !searchQuery && (
                        <div className="mt-20 pt-10 border-t border-gray-800">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold">Curated Series</h2>
                                <span className="text-sm text-gray-500">Structured learning paths</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {series.map((s, i) => (
                                    <SeriesCard key={i} {...s} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
