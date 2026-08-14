'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './HowToStart.module.css';

type StepStatus = 'completed' | 'current' | 'pending';

type Step = {
  id: number;
  navLabel: string;
  title: string;
  titleDesktop?: string;
  description: string;
  descriptionDesktop: string;
  bullets: string[];
  bulletsDesktop: string[];
  callout?: string;
  calloutDesktop?: string;
  status: StepStatus;
  image?: string;
};

type StepDef = {
  id: number;
  status: StepStatus;
  hasTitleDesktop: boolean;
  hasCallout: boolean;
  image?: string;
};

const STEP_DEFS: StepDef[] = [
  {
    id: 1,
    status: 'completed',
    hasTitleDesktop: false,
    hasCallout: true,
    image: '/how-to-start/private-image-desktop.webp',
  },
  { id: 2, status: 'completed', hasTitleDesktop: false, hasCallout: false },
  { id: 3, status: 'current', hasTitleDesktop: false, hasCallout: true },
  { id: 4, status: 'pending', hasTitleDesktop: true, hasCallout: false },
  { id: 5, status: 'pending', hasTitleDesktop: true, hasCallout: false },
  { id: 6, status: 'pending', hasTitleDesktop: true, hasCallout: false },
  { id: 7, status: 'pending', hasTitleDesktop: true, hasCallout: true },
];

const TOTAL_STEPS = STEP_DEFS.length;
const DONE_COUNT = 3;
const PROGRESS_PERCENT = (DONE_COUNT / TOTAL_STEPS) * 100;
const DEFAULT_ACTIVE_STEP = 3;

function getDesktopSidebarStatus(stepId: number, activeStepId: number): StepStatus {
  if (stepId <= 2) return 'completed';
  if (stepId === activeStepId) return 'current';
  return 'pending';
}

function scrollSidebarItemIntoView(button: HTMLButtonElement | undefined) {
  button?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
  });
}

function MobileStepBadge({ step }: { step: Step }) {
  if (step.status === 'completed') {
    return (
      <span className={styles.stepBadgeDone} aria-hidden="true">
        ✓
      </span>
    );
  }

  return (
    <span
      className={step.status === 'current' ? styles.stepBadgeCurrent : styles.stepBadgePending}
      aria-hidden="true"
    >
      {String(step.id).padStart(2, '0')}
    </span>
  );
}

function SidebarBadge({ step, status }: { step: Step; status: StepStatus }) {
  if (status === 'completed') {
    return (
      <span className={styles.navBadgeDone} aria-hidden="true">
        ✓
      </span>
    );
  }

  if (status === 'current') {
    return (
      <span className={styles.navBadgeCurrent} aria-hidden="true">
        {step.id}
      </span>
    );
  }

  return (
    <span className={styles.navBadgePending} aria-hidden="true">
      {step.id}
    </span>
  );
}

export default function HowToStart() {
  const t = useTranslations('account');
  const [activeStepId, setActiveStepId] = useState(DEFAULT_ACTIVE_STEP);
  const sidebarButtonRefs = useRef(new Map<number, HTMLButtonElement>());
  const isProgrammaticScroll = useRef(false);
  const lastSyncedStepId = useRef(DEFAULT_ACTIVE_STEP);

  const steps: Step[] = useMemo(
    () =>
      STEP_DEFS.map(def => {
        const sk = `hts.s${def.id}` as const;
        return {
          id: def.id,
          status: def.status,
          image: def.image,
          navLabel: t(`${sk}.nav` as Parameters<typeof t>[0]),
          title: t(`${sk}.title` as Parameters<typeof t>[0]),
          titleDesktop: def.hasTitleDesktop
            ? t(`${sk}.titleDesktop` as Parameters<typeof t>[0])
            : undefined,
          description: t(`${sk}.descMobile` as Parameters<typeof t>[0]),
          descriptionDesktop: t(`${sk}.descDesktop` as Parameters<typeof t>[0]),
          bullets: t.raw(`${sk}.bullets` as Parameters<typeof t>[0]) as string[],
          bulletsDesktop: t.raw(`${sk}.bulletsDesktop` as Parameters<typeof t>[0]) as string[],
          callout: def.hasCallout ? t(`${sk}.callout` as Parameters<typeof t>[0]) : undefined,
          calloutDesktop: def.hasCallout
            ? t(`${sk}.calloutDesktop` as Parameters<typeof t>[0])
            : undefined,
        };
      }),
    [t]
  );

  const scrollToStep = useCallback((id: number) => {
    setActiveStepId(id);
    lastSyncedStepId.current = id;
    isProgrammaticScroll.current = true;

    document.getElementById(`how-to-start-step-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    scrollSidebarItemIntoView(sidebarButtonRefs.current.get(id));

    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const resolveActiveStep = () => {
      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height')
      );
      const marker = (Number.isFinite(headerHeight) ? headerHeight : 72) + 40;
      let nextActiveStep = steps[0].id;

      for (const step of steps) {
        const element = document.getElementById(`how-to-start-step-${step.id}`);
        if (!element) continue;

        if (element.getBoundingClientRect().top <= marker) {
          nextActiveStep = step.id;
        }
      }

      setActiveStepId(nextActiveStep);

      if (lastSyncedStepId.current !== nextActiveStep) {
        lastSyncedStepId.current = nextActiveStep;
        scrollSidebarItemIntoView(sidebarButtonRefs.current.get(nextActiveStep));
      }
    };

    const onScroll = () => {
      if (!mediaQuery.matches || isProgrammaticScroll.current) return;
      resolveActiveStep();
    };

    const onMediaChange = () => {
      if (mediaQuery.matches) {
        resolveActiveStep();
      } else {
        setActiveStepId(DEFAULT_ACTIVE_STEP);
      }
    };

    onMediaChange();
    window.addEventListener('scroll', onScroll, { passive: true });
    mediaQuery.addEventListener('change', onMediaChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      mediaQuery.removeEventListener('change', onMediaChange);
    };
  }, [steps]);

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>{t('hts.eyebrow')}</span>
          <h1 className={styles.title}>{t('hts.title')}</h1>
          <p className={styles.subtitleMobile}>{t('hts.subtitleMobile')}</p>
          <p className={styles.subtitleDesktop}>{t('hts.subtitleDesktop')}</p>
        </header>

        <section className={styles.progressCard} aria-label={t('hts.allDoneLabel')}>
          <div className={styles.progressTop}>
            <span className={styles.progressLabel}>{t('hts.progressLabel')}</span>
            <span className={styles.progressValue}>
              {t('hts.progressValue', { done: DONE_COUNT, total: TOTAL_STEPS })}
            </span>
          </div>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuenow={DONE_COUNT}
            aria-valuemin={0}
            aria-valuemax={TOTAL_STEPS}
            aria-label={t('hts.progressAriaLabel', { done: DONE_COUNT, total: TOTAL_STEPS })}
          >
            <span className={styles.progressFill} style={{ width: `${PROGRESS_PERCENT}%` }} />
          </div>
        </section>

        <div className={styles.body}>
          <nav className={styles.sidebar} aria-label={t('hts.sidebarAriaLabel')}>
            <span className={styles.sidebarLabel}>{t('hts.sidebarLabel')}</span>
            <ul className={styles.sidebarList}>
              {steps.map(step => {
                const sidebarStatus = getDesktopSidebarStatus(step.id, activeStepId);

                return (
                  <li key={step.id}>
                    <button
                      ref={node => {
                        if (node) {
                          sidebarButtonRefs.current.set(step.id, node);
                        } else {
                          sidebarButtonRefs.current.delete(step.id);
                        }
                      }}
                      type="button"
                      className={[
                        styles.sidebarItem,
                        sidebarStatus === 'completed' && styles.sidebarItemDone,
                        sidebarStatus === 'current' && styles.sidebarItemCurrent,
                        sidebarStatus === 'pending' && styles.sidebarItemPending,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-current={sidebarStatus === 'current' ? 'step' : undefined}
                      onClick={() => scrollToStep(step.id)}
                    >
                      <SidebarBadge step={step} status={sidebarStatus} />
                      <span className={styles.sidebarItemLabel}>{step.navLabel}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.content}>
            <ol className={styles.steps}>
              {steps.map(step => (
                <li
                  key={step.id}
                  id={`how-to-start-step-${step.id}`}
                  className={[
                    styles.stepCard,
                    step.status === 'completed' && styles.stepCardDone,
                    step.status === 'current' && styles.stepCardCurrent,
                    step.status === 'pending' && styles.stepCardPending,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className={styles.stepHeadMobile}>
                    <MobileStepBadge step={step} />
                    <h2 className={styles.stepTitleMobile}>{step.title}</h2>
                  </div>

                  <div className={styles.stepHeadDesktop}>
                    <span className={styles.stepNumberDesktop} aria-hidden="true">
                      {String(step.id).padStart(2, '0')}
                    </span>
                    <h2 className={styles.stepTitleDesktop}>{step.titleDesktop ?? step.title}</h2>
                  </div>

                  <p className={styles.stepDescriptionMobile}>{step.description}</p>
                  <p className={styles.stepDescriptionDesktop}>{step.descriptionDesktop}</p>

                  <ul className={styles.stepList}>
                    {step.bullets.map(bullet => (
                      <li key={`${step.id}-m-${bullet}`} className={styles.stepListItemMobile}>
                        <span className={styles.stepDot} aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                    {step.bulletsDesktop.map(bullet => (
                      <li key={`${step.id}-d-${bullet}`} className={styles.stepListItemDesktop}>
                        <span className={styles.stepDot} aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {step.image ? (
                    <div className={styles.stepMedia}>
                      <Image
                        src={step.image}
                        alt={t('hts.downloadIllustrationAlt')}
                        fill
                        className={styles.stepImage}
                        sizes="(min-width: 1024px) 50vw, 0px"
                        priority={step.id === 1}
                      />
                    </div>
                  ) : null}

                  {step.callout ? <p className={styles.stepCalloutMobile}>{step.callout}</p> : null}
                  {step.calloutDesktop ? (
                    <p className={styles.stepCalloutDesktop}>{step.calloutDesktop}</p>
                  ) : null}
                </li>
              ))}
            </ol>

            <section className={styles.doneCard} aria-label={t('hts.allDoneLabel')}>
              <div className={styles.doneMain}>
                <span className={styles.doneIcon} aria-hidden="true">
                  ✓
                </span>
                <div className={styles.doneCopy}>
                  <h2 className={styles.doneTitle}>{t('hts.doneTitle')}</h2>
                  <p className={styles.doneText}>{t('hts.doneText')}</p>
                </div>
              </div>
              <div className={styles.doneActions}>
                <Link href="/faq" className={styles.doneButtonPrimary}>
                  {t('hts.openSupport')}
                </Link>
                <Link href="/dashboard" className={styles.doneButtonSecondary}>
                  {t('hts.goToDashboard')}
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
