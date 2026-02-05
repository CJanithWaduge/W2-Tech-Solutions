import FeaturesClient from './FeaturesClient';
import { getArticlesData } from '@/lib/data';

export default async function FeaturesPage() {
  const articles = await getArticlesData();

  return <FeaturesClient initialArticles={articles} />;
}