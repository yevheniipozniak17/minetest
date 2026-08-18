import { Link } from '@/i18n/navigation';
import { categoryHref } from '@/app/[locale]/blog/categories';
import type { ArticleSidebarTag } from '@/app/[locale]/blog/_adapter';

type ArticleSidebarTagsProps = {
  tags: readonly ArticleSidebarTag[];
  listClassName?: string;
  tagClassName?: string;
};

export default function ArticleSidebarTags({
  tags,
  listClassName,
  tagClassName,
}: ArticleSidebarTagsProps) {
  return (
    <ul className={listClassName}>
      {tags.map(tag => (
        <li key={`${tag.slug}-${tag.label}`}>
          <Link href={categoryHref(tag.slug)} className={tagClassName}>
            {tag.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
