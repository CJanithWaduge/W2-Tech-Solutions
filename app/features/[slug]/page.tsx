import { notFound } from 'next/navigation';
import ArticleClient from './ArticleClient';
import { getArticlesData, getArticleBySlug } from '@/lib/data';

export async function generateStaticParams() {
    const articles = await getArticlesData();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return <ArticleClient article={article} />;
}
