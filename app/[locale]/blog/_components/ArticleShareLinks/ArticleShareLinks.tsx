'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { buildArticleShareLinks } from '@/lib/client/articleShare';
import styles from './ArticleShareLinks.module.css';

const SHARE_ITEMS = [
  {
    id: 'x' as const,
    icon: '/icons/social/prime_twitter.svg',
    size: 18,
    action: 'share-x' as const,
  },
  {
    id: 'twitch' as const,
    icon: '/icons/social/twitch.svg',
    size: 18,
    action: 'copy' as const,
  },
  {
    id: 'facebook' as const,
    icon: '/icons/social/ic_round-facebook.svg',
    size: 18,
    action: 'share-facebook' as const,
  },
  {
    id: 'instagram' as const,
    icon: '/icons/social/ri_instagram-fill.svg',
    size: 18,
    action: 'copy' as const,
  },
];

type ArticleShareLinksProps = {
  title: string;
  className?: string;
  linkClassName?: string;
};

function getPageUrl() {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.location.href;
}

export default function ArticleShareLinks({
  title,
  className,
  linkClassName,
}: ArticleShareLinksProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = useTranslations('blog');
  const itemClassName = linkClassName ?? styles.link;

  const copyLink = useCallback(async (id: string) => {
    const url = getPageUrl();
    if (!url) {
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(current => (current === id ? null : current)), 2000);
    } catch {
      // Clipboard API may be blocked outside secure context.
    }
  }, []);

  const openShare = useCallback(
    (platform: 'x' | 'facebook') => {
      const url = getPageUrl();
      if (!url) {
        return;
      }

      const links = buildArticleShareLinks(url, title);
      window.open(platform === 'x' ? links.x : links.facebook, '_blank', 'noopener,noreferrer');
    },
    [title],
  );

  const handleClick = useCallback(
    (item: (typeof SHARE_ITEMS)[number]) => {
      if (item.action === 'share-x') {
        openShare('x');
        return;
      }

      if (item.action === 'share-facebook') {
        openShare('facebook');
        return;
      }

      if (item.action === 'copy') {
        void copyLink(item.id);
      }
    },
    [copyLink, openShare],
  );

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {SHARE_ITEMS.map(item => {
        const isCopied = copiedId === item.id;
        const labelKey = `share.${item.id}` as Parameters<typeof t>[0];

        return (
          <button
            key={item.id}
            type="button"
            className={[itemClassName, isCopied && styles.linkCopied].filter(Boolean).join(' ')}
            aria-label={isCopied ? t('share.copied') : t(labelKey)}
            onClick={() => handleClick(item)}
          >
            <Image src={item.icon} alt="" width={item.size} height={item.size} />
          </button>
        );
      })}
    </div>
  );
}
