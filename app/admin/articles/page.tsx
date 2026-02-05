'use client';

import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, FileText, Tag, User, Save, Plus, ArrowLeft, CheckCircle, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/home/Footer';

export default function UploadArticlePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'development',
        tags: [] as string[],
        featured: false,
        authorName: 'Janith Waduge',
        authorRole: 'Founder & Lead Architect',
        status: 'published' as const
    });

    const [tagInput, setTagInput] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Auto-generate slug from title
    useEffect(() => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
        setFormData(prev => ({ ...prev, slug }));
    }, [formData.title]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleTagAdd = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'avatar') => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'cover') {
                setCoverFile(file);
                setCoverPreview(URL.createObjectURL(file));
            } else {
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
            }
        }
    };

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        return Math.max(1, Math.ceil(words / wordsPerMinute));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const articleId = formData.slug || Date.now().toString();
            let coverPath = '/images/Articles/default-cover.jpg';
            let avatarPath = '/images/about/avatar.jpeg'; // Default

            // 1. Upload Cover Image if exists
            if (coverFile) {
                const coverFormData = new FormData();
                coverFormData.append('file', coverFile);
                coverFormData.append('type', 'cover');
                coverFormData.append('articleId', articleId);

                const res = await fetch('/api/upload/article-image', {
                    method: 'POST',
                    body: coverFormData
                });
                const data = await res.json();
                if (data.success) coverPath = data.path;
            }

            // 2. Upload Avatar Image if exists
            if (avatarFile) {
                const avatarFormData = new FormData();
                avatarFormData.append('file', avatarFile);
                avatarFormData.append('type', 'avatar');
                avatarFormData.append('articleId', articleId);

                const res = await fetch('/api/upload/article-image', {
                    method: 'POST',
                    body: avatarFormData
                });
                const data = await res.json();
                if (data.success) avatarPath = data.path;
            }

            // 3. Create Article
            const finalArticle = {
                id: articleId,
                slug: formData.slug,
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                category: formData.category,
                tags: formData.tags,
                readTime: calculateReadTime(formData.content),
                author: {
                    name: formData.authorName,
                    role: formData.authorRole,
                    avatar: avatarPath
                },
                featured: formData.featured,
                coverImage: coverPath,
                status: formData.status
            };

            const res = await fetch('/api/articles/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalArticle)
            });

            if (!res.ok) throw new Error('Failed to create article');

            setSuccess(true);
            setTimeout(() => {
                router.push('/features');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a192f] text-gray-300">
            <Header />

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href="/features" className="inline-flex items-center gap-2 text-[var(--accent)] mb-8 hover:underline">
                    <ArrowLeft size={16} />
                    Back to Features
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Publish New Article</h1>
                        <p className="text-[var(--text-secondary)]">Create and distribute high-fidelity technical content.</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center border border-[var(--accent)]/20 text-[var(--accent)]">
                            <FileText size={32} />
                        </div>
                    </div>
                </div>

                {success && (
                    <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400">
                        <CheckCircle size={20} />
                        <p>Article published successfully! Redirecting...</p>
                    </div>
                )}

                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Cover Image Upload */}
                    <div className="card p-6 bg-[#112240]/40 border-dashed border-2 border-gray-700 hover:border-[var(--accent)]/50 transition-colors cursor-pointer relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'cover')}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        {coverPreview ? (
                            <div className="relative h-64 w-full rounded-lg overflow-hidden">
                                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white font-medium flex items-center gap-2">
                                        <ImageIcon size={20} />
                                        Change Cover Image
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-[var(--text-secondary)]">
                                <Upload size={48} className="mb-4 text-gray-600" />
                                <p className="text-lg font-medium text-white mb-1">Click to upload cover image</p>
                                <p className="text-sm">Recommended: 1600x900px (PNG, JPG)</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white uppercase tracking-wider">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter article title..."
                                    className="w-full bg-[#0a192f] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[var(--accent)] transition-all"
                                />
                            </div>

                            {/* Slug */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white uppercase tracking-wider">Slug (Auto-generated)</label>
                                <div className="flex items-center gap-2 text-sm bg-gray-900/50 p-3 rounded-lg border border-gray-800 text-[var(--text-secondary)]">
                                    <span className="opacity-50">/features/</span>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        className="bg-transparent border-none outline-none text-white w-full"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white uppercase tracking-wider">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0a192f] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[var(--accent)] transition-all"
                                >
                                    <option value="security">Security</option>
                                    <option value="development">Development</option>
                                    <option value="tutorial">Tutorial</option>
                                    <option value="Education">Education</option>
                                    <option value="tools">Tools</option>
                                    <option value="updates">Updates</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Author Info */}
                            <div className="space-y-4 p-4 bg-[#112240]/40 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="relative group w-16 h-16">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'avatar')}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden border-2 border-gray-700 group-hover:border-[var(--accent)] transition-all">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User size={30} className="text-gray-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus size={20} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white mb-1 uppercase tracking-tighter">Author Profile</p>
                                        <input
                                            type="text"
                                            name="authorName"
                                            value={formData.authorName}
                                            onChange={handleInputChange}
                                            placeholder="Name"
                                            className="w-full bg-transparent border-b border-gray-800 py-1 text-sm focus:border-[var(--accent)] outline-none transition-all mb-1"
                                        />
                                        <input
                                            type="text"
                                            name="authorRole"
                                            value={formData.authorRole}
                                            onChange={handleInputChange}
                                            placeholder="Role"
                                            className="w-full bg-transparent border-none py-1 text-xs text-[var(--text-secondary)] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white uppercase tracking-wider">Tags</label>
                                <div className="w-full bg-[#0a192f] border border-gray-700 rounded-lg p-2 focus-within:border-[var(--accent)] transition-all">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs rounded-full">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagAdd}
                                        placeholder="Hit Enter to add tags..."
                                        className="w-full bg-transparent border-none outline-none p-1 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Featured Checkbox */}
                            <div className="flex items-center gap-3 py-4">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded bg-gray-900 border-gray-700 text-[var(--accent)] focus:ring-[var(--accent)]"
                                />
                                <label htmlFor="featured" className="text-sm font-medium text-white cursor-pointer select-none">Mark as Featured Article</label>
                            </div>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white uppercase tracking-wider">Excerpt</label>
                        <textarea
                            name="excerpt"
                            required
                            rows={3}
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            placeholder="Brief summary of the article..."
                            className="w-full bg-[#0a192f] border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[var(--accent)] transition-all"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white uppercase tracking-wider">Content (Markdown)</label>
                        <textarea
                            name="content"
                            required
                            rows={15}
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="# Your Content Here..."
                            className="w-full bg-[#0a192f] border border-gray-700 rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-all bg-[url('/grid.svg')] bg-fixed"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-12 py-4 bg-gradient-to-r from-[var(--accent)] to-teal-400 text-[var(--primary)] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,170,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Publish Article
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}
