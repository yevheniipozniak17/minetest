'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const COPY_FEEDBACK_MS = 2000;

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

async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy fallback.
    }
  }

  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  } finally {
    document.body.removeChild(textarea);
  }

  return copied;
}

export default function ArticleShareLinks({
  title,
  className,
  linkClassName,
}: ArticleShareLinksProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations('blog');
  const itemClassName = linkClassName ?? styles.link;
  const copiedLabel = t('share.copied');

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const showCopiedFeedback = useCallback((id: string) => {
    setCopiedId(id);

    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }

    copyTimerRef.current = setTimeout(() => {
      setCopiedId(current => (current === id ? null : current));
      copyTimerRef.current = null;
    }, COPY_FEEDBACK_MS);
  }, []);

  const copyLink = useCallback(
    async (id: string) => {
      const url = getPageUrl();
      if (!url) {
        return;
      }

      const copied = await copyTextToClipboard(url);
      if (copied) {
        showCopiedFeedback(id);
      }
    },
    [showCopiedFeedback],
  );

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
      <span className={styles.srOnly} aria-live="polite">
        {copiedId ? copiedLabel : ''}
      </span>

      {SHARE_ITEMS.map(item => {
        const isCopied = copiedId === item.id;
        const labelKey = `share.${item.id}` as Parameters<typeof t>[0];

        return (
          <span key={item.id} className={styles.item}>
            {isCopied && (
              <span className={styles.tooltip} role="status">
                {copiedLabel}
              </span>
            )}

            <button
              type="button"
              className={[itemClassName, isCopied && styles.linkCopied].filter(Boolean).join(' ')}
              aria-label={isCopied ? copiedLabel : t(labelKey)}
              onClick={() => handleClick(item)}
            >
              <Image src={item.icon} alt="" width={item.size} height={item.size} />
            </button>
          </span>
        );
      })}
    </div>
  );
}
