'use client';

import { useEffect, useState } from 'react';

const ACTIVE_SECTION_ROOT_MARGIN = '-20% 0px -55% 0px';

function getSectionElements(sectionIds: readonly string[]) {
  return sectionIds
    .map(id => document.getElementById(`section-${id}`))
    .filter((section): section is HTMLElement => section !== null);
}

export function useFaqArticleToc<T extends string>(sectionIds: readonly T[]) {
  const [activeId, setActiveId] = useState<T>(sectionIds[0]);

  useEffect(() => {
    const sections = getSectionElements(sectionIds);
    if (sections.length === 0) {
      return;
    }

    const activeObserver = new IntersectionObserver(
      entries => {
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => entry.target as HTMLElement);

        if (visibleSections.length === 0) {
          return;
        }

        const currentSection = visibleSections.reduce((lowest, section) =>
          section.offsetTop > lowest.offsetTop ? section : lowest,
        );

        setActiveId(currentSection.id.replace('section-', '') as T);
      },
      { rootMargin: ACTIVE_SECTION_ROOT_MARGIN, threshold: 0 },
    );

    sections.forEach(section => activeObserver.observe(section));

    return () => {
      activeObserver.disconnect();
    };
  }, [sectionIds]);

  const scrollToSection = (id: T) => {
    setActiveId(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return { activeId, scrollToSection };
}
