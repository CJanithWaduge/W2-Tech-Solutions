export type ArticleCategory = 'security' | 'development' | 'tutorial' | 'behind-scenes' | 'updates' | 'tools';

export interface ArticleAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface ArticleComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  replies: ArticleComment[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  tags: string[];
  readTime: number;
  publishDate: string;
  author: ArticleAuthor;
  views: number;
  comments: number;
  featured: boolean;
  series?: string;
  seriesOrder?: number;
  coverImage: string;
  status: 'published' | 'draft';
}

export interface ArticleSeries {
  id: string;
  title: string;
  description: string;
  articles: Article[];
  totalParts: number;
}

export interface FilterOptions {
  category: ArticleCategory | 'all';
  search: string;
  sortBy: 'latest' | 'popular' | 'read-time';
  readTime: 'all' | 'short' | 'medium' | 'long';
}