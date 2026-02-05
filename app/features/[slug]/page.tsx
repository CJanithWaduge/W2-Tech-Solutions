'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Clock, Calendar, Tag, User,
    MessageCircle, Eye, Share2, Heart,
    Bookmark, Send, ChevronRight, X,
    Linkedin, Facebook, Link as LinkIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import { Article } from '@/types/article';

export default function ArticleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<Article | null>(null);
    const [interactions, setInteractions] = useState<{ views: number; comments: any[] }>({ views: 0, comments: [] });
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [slug, setSlug] = useState<string | null>(null);
    const articleRef = useRef<HTMLElement>(null);

    // Extract slug from params (Next.js 15+ requires awaiting params)
    useEffect(() => {
        const getSlug = async () => {
            const resolvedParams = await Promise.resolve(params);
            setSlug(resolvedParams.slug as string);
        };
        getSlug();
    }, [params]);

    // Check if article is already bookmarked
    useEffect(() => {
        if (!slug) return;
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        if (bookmarks.includes(slug)) {
            setIsBookmarked(true);
        }
    }, [slug]);

    // Handle share functionality
    const handleShare = async () => {
        const url = window.location.href;
        const title = article?.title || 'Article';

        if (navigator.share) {
            // Use native share API if available
            try {
                await navigator.share({
                    title,
                    url,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback to copy link
            try {
                await navigator.clipboard.writeText(url);
                // Show toast or feedback
                alert('Link copied to clipboard!');
            } catch (error) {
                console.error('Error copying link:', error);
                // Fallback to manual copy
                prompt('Copy link:', url);
            }
        }
    };

    // Handle bookmark functionality
    const handleBookmark = () => {
        if (!slug) return;
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        let updatedBookmarks;

        if (isBookmarked) {
            updatedBookmarks = bookmarks.filter((slugItem: string) => slugItem !== slug);
        } else {
            updatedBookmarks = [...bookmarks, slug];
        }

        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        setIsBookmarked(!isBookmarked);
    };

    // Reading progress tracker
    useEffect(() => {
        const updateProgress = () => {
            if (!articleRef.current) return;
            const element = articleRef.current;
            const totalHeight = element.clientHeight - window.innerHeight;
            const windowScrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

            if (windowScrollTop === 0) {
                setReadingProgress(0);
                return;
            }
            if (windowScrollTop > totalHeight) {
                setReadingProgress(100);
                return;
            }
            setReadingProgress((windowScrollTop / totalHeight) * 100);
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    useEffect(() => {
        async function loadContent() {
            if (!slug) return;
            try {
                // Fetch article content
                const response = await fetch('/Features.json');
                if (!response.ok) throw new Error('Failed to load articles');
                const data: Article[] = await response.json();
                const foundArticle = data.find(a => a.slug === slug);

                if (foundArticle) {
                    setArticle(foundArticle);
                    window.scrollTo(0, 0);

                    // Fetch and update interactions (views)
                    const intRes = await fetch(`/api/articles/${slug}`);
                    const intData = await intRes.json();
                    setInteractions(intData);

                    // Increment view
                    fetch(`/api/articles/${slug}`, {
                        method: 'POST',
                        body: JSON.stringify({ type: 'view' }),
                    }).then(res => res.json()).then(updated => setInteractions(updated));
                } else {
                    router.push('/features');
                }
            } catch (error) {
                console.error('Error loading article:', error);
            } finally {
                setLoading(false);
            }
        }

        loadContent();
    }, [slug, router]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !authorName.trim() || !slug) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/articles/${slug}`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'comment',
                    comment: {
                        author: authorName,
                        content: commentText
                    }
                })
            });
            const updated = await res.json();
            setInteractions(updated);
            setCommentText('');
            setAuthorName('');
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-[var(--accent)] rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="min-h-screen bg-[#0a192f]">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-gray-800">
                <div
                    className="h-full bg-gradient-to-r from-[var(--accent)] to-teal-400 transition-all duration-150"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* Navigation Header */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#0a192f]/80 backdrop-blur-md border-b border-gray-800 h-16 flex items-center">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/features" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline font-medium">Back to base</span>
                    </Link>

                    <div className="hidden md:block max-w-sm truncate font-bold text-gray-200">
                        {article.title}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleShare}
                            className="p-2 text-gray-400 hover:text-[var(--accent)] transition-colors"
                            title="Share article"
                        >
                            <Share2 size={18} />
                        </button>
                        <button
                            onClick={handleBookmark}
                            className={`p-2 transition-colors ${isBookmarked ? 'text-[var(--accent)]' : 'text-gray-400 hover:text-[var(--accent)]'}`}
                            title={isBookmarked ? 'Remove from bookmarks' : 'Save to bookmarks'}
                        >
                            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-24" ref={articleRef}>
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-mono">
                        <Link href="/features" className="hover:text-[var(--accent)]">Features</Link>
                        <ChevronRight size={14} />
                        <span className="text-gray-300 truncate">{article.category}</span>
                    </nav>

                    {/* Article Cover Image */}
                    {article.coverImage && (
                        <div className="mb-12 relative rounded-3xl overflow-hidden aspect-video shadow-2xl border border-gray-800">
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/40 to-transparent" />
                        </div>
                    )}

                    {/* Meta Header */}
                    <div className="mb-12">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold uppercase tracking-widest rounded-md border border-[var(--accent)]/20">
                                {article.category}
                            </span>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <Clock size={16} />
                                    {article.readTime} min read
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={16} />
                                    {new Date(article.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black mb-8 text-white leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex items-center justify-between py-8 border-y border-gray-800/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-teal-500 p-0.5">
                                    <div className="w-full h-full rounded-full bg-[#0a192f] flex items-center justify-center overflow-hidden border border-gray-800">
                                        {article.author.avatar ? (
                                            <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="text-gray-500" />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold text-white mb-0.5">{article.author.name}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest">{article.author.role}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Eye size={18} />
                                    <span className="text-sm font-bold">{interactions.views.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MessageCircle size={18} />
                                    <span className="text-sm font-bold">{interactions.comments.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Article Body */}
                    <article className="prose prose-invert prose-lg max-w-none 
                        prose-headings:text-white prose-headings:font-black
                        prose-p:text-gray-400 prose-p:leading-relaxed
                        prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white
                        prose-code:text-[var(--accent)] prose-code:bg-gray-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
                        prose-pre:bg-[#112240] prose-pre:border prose-pre:border-gray-800 prose-pre:shadow-2xl
                        prose-img:rounded-2xl prose-img:border prose-img:border-gray-800
                        prose-blockquote:border-l-[var(--accent)] prose-blockquote:bg-gray-800/20 prose-blockquote:py-2 prose-blockquote:pr-8
                    ">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {article.content}
                        </ReactMarkdown>
                    </article>

                    {/* Tags */}
                    <div className="mt-16 pt-8 border-t border-gray-800">
                        <div className="flex flex-wrap gap-2 text-sm">
                            <span className="text-gray-500 mr-2 flex items-center gap-1.5 py-1">
                                <Tag size={16} />
                                Tags:
                            </span>
                            {article.tags.map(tag => (
                                <Link
                                    key={tag}
                                    href={`/features?search=${tag}`}
                                    className="px-4 py-1.5 bg-gray-800/50 text-gray-400 rounded-full hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] border border-gray-700 hover:border-[var(--accent)]/30 transition-all font-medium"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Social Share Callout */}
                    <div className="mt-12 p-10 rounded-3xl bg-gradient-to-br from-[#112240] to-transparent border border-gray-800/50 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent"></div>
                        <h3 className="text-xl font-bold text-white mb-2">Enjoyed this article?</h3>
                        <p className="text-gray-500 mb-8">Share it with your network or leave a thought below.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article?.title || 'Check out this article')}`, '_blank')}
                                className="w-12 h-12 rounded-2xl bg-gray-800/50 hover:bg-black text-white flex items-center justify-center transition-all group active:scale-90 border border-gray-700/50"
                                title="Share on X"
                            >
                                <X size={20} />
                            </button>
                            <button
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                className="w-12 h-12 rounded-2xl bg-gray-800/50 hover:bg-[#0077B5] text-white flex items-center justify-center transition-all group active:scale-90 border border-gray-700/50"
                                title="Share on LinkedIn"
                            >
                                <Linkedin size={20} />
                            </button>
                            <button
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                                className="w-12 h-12 rounded-2xl bg-gray-800/50 hover:bg-[#4267B2] text-white flex items-center justify-center transition-all group active:scale-90 border border-gray-700/50"
                                title="Share on Facebook"
                            >
                                <Facebook size={20} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="w-12 h-12 rounded-2xl bg-gray-800/50 hover:bg-[var(--accent)] text-white flex items-center justify-center transition-all group active:scale-90 border border-gray-700/50"
                                title="Copy link"
                            >
                                <LinkIcon size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <section id="comments" className="mt-24">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-black text-white flex items-center gap-4">
                                Discussions
                                <span className="text-[var(--accent)] text-lg font-mono">({interactions.comments.length})</span>
                            </h2>
                        </div>

                        {/* Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="mb-16 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                        className="w-full bg-gray-800/30 border border-gray-700 rounded-xl px-6 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-all font-medium"
                                    />
                                    <textarea
                                        rows={4}
                                        placeholder="Add to the discussion..."
                                        required
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        className="w-full bg-gray-800/30 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[var(--accent)] transition-all resize-none leading-relaxed"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--accent)] to-teal-500 text-[var(--primary)] font-black rounded-xl hover:shadow-[0_0_20px_rgba(0,212,170,0.4)] transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-8">
                            {interactions.comments.length > 0 ? (
                                interactions.comments.slice().reverse().map((comment) => (
                                    <div key={comment.id} className="group flex gap-4 md:gap-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700 shadow-xl">
                                                <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="flex-grow space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-gray-200">{comment.author}</h4>
                                                <span className="text-xs text-gray-500 font-mono">
                                                    {new Date(comment.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                                {comment.content}
                                            </p>
                                            <div className="flex items-center gap-4 pt-2">
                                                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-pink-500 transition-colors group/like">
                                                    <Heart size={14} className="group-hover/like:fill-current" />
                                                    Liked
                                                </button>
                                                <button className="text-xs text-gray-500 hover:text-[var(--accent)] transition-colors">
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-800/10 rounded-3xl border border-gray-800 border-dashed">
                                    <p className="text-gray-500 italic">No discussions yet. Be the first to start the conversation!</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
