'use client';

import { useEffect, useState } from 'react';

const DESKTOP_MEDIA = '(min-width: 1280px)';

/** Точка на екрані, яку вважаємо «де зараз читаємо» (30% від верху viewport). */
const READING_LINE_RATIO = 0.3;

/** Зона viewport, в якій секція вважається активною (стандарт для scroll spy). */
const ACTIVE_SECTION_ROOT_MARGIN = '-20% 0px -55% 0px';

function isDesktop() {
  return window.matchMedia(DESKTOP_MEDIA).matches;
}

function getSectionElements(sectionIds: readonly string[]) {
  return sectionIds
    .map(id => document.getElementById(`section-${id}`))
    .filter((section): section is HTMLElement => section !== null);
}

/** Скільки % прочитано між першою і останньою секцією — одна формула, без циклів. */
function getReadingProgress(sections: HTMLElement[]) {
  const first = sections[0];
  const last = sections[sections.length - 1];
  const articleStart = first.offsetTop;
  const articleEnd = last.offsetTop + last.offsetHeight;
  const readingPoint = window.scrollY + window.innerHeight * READING_LINE_RATIO;

  if (articleEnd <= articleStart) {
    return 0;
  }

  const ratio = (readingPoint - articleStart) / (articleEnd - articleStart);
  return Math.min(100, Math.max(0, Math.round(ratio * 100)));
}

/**
 * Scroll spy для TOC + reading progress.
 * Active section: IntersectionObserver (як у docs / MDN / dev-блогах).
 * Progress: лінійний прогрес від секції 1 до секції 8.
 */
export function useArticleToc<T extends string>(sectionIds: readonly T[]) {
  const [activeId, setActiveId] = useState<T>(sectionIds[0]);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (!isDesktop()) {
      return;
    }

    const sections = getSectionElements(sectionIds);
    if (sections.length === 0) {
      return;
    }

    const syncProgress = () => {
      setReadingProgress(getReadingProgress(sections));
    };

    const activeObserver = new IntersectionObserver(
      entries => {
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => entry.target as HTMLElement);

        if (visibleSections.length === 0) {
          return;
        }

        // Секція, що нижче на екрані — те, що зараз читаємо
        const currentSection = visibleSections.reduce((lowest, section) =>
          section.offsetTop > lowest.offsetTop ? section : lowest,
        );

        setActiveId(currentSection.id.replace('section-', '') as T);
        syncProgress();
      },
      { rootMargin: ACTIVE_SECTION_ROOT_MARGIN, threshold: 0 },
    );

    sections.forEach(section => activeObserver.observe(section));

    syncProgress();
    window.addEventListener('scroll', syncProgress, { passive: true });
    window.addEventListener('resize', syncProgress);

    return () => {
      activeObserver.disconnect();
      window.removeEventListener('scroll', syncProgress);
      window.removeEventListener('resize', syncProgress);
    };
  }, [sectionIds]);

  return { activeId, readingProgress, setActiveId };
}
