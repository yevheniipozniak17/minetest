import { getBlogCategories } from '@/lib/server/blog';
import HeroTagsClient from './HeroTagsClient';

export default async function HeroTags() {
  const categories = await getBlogCategories().catch(() => []);

  return (
    <HeroTagsClient
      categories={categories
        .filter(category => Boolean(category.slug && category.name))
        .map(category => ({
          slug: category.slug as string,
          name: category.name as string,
        }))}
    />
  );
}
