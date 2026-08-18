import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import AuthAwareLink from '@/app/_components/AuthAwareLink/AuthAwareLink';
import { getPublicServerHref } from '@/lib/data/servers';
import { TWITCH_URL } from '@/lib/data/social';
import { MINECRAFT_VERSION_LABEL } from '@/lib/server/gameServers';
import styles from './Hero.module.css';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import img1 from '@/public/how-to-start/1.webp';
import img2 from '@/public/how-to-start/2.webp';
import img3 from '@/public/how-to-start/3.webp';
import img4 from '@/public/how-to-start/4.webp';
import img5 from '@/public/how-to-start/5.webp';
import img6 from '@/public/how-to-start/6.webp';
import type { StaticImageData } from 'next/image';

const STEPPER_IMAGE_STYLE = { height: 'auto' } as const;

function StepperImage({ src }: { src: StaticImageData }) {
  return (
    <div className={styles.stepperImageWrap}>
      <Image src={src} alt="" className={styles.stepperImage} style={STEPPER_IMAGE_STYLE} />
    </div>
  );
}

export default async function Hero({ isAuthed = false }: { isAuthed?: boolean }) {
  const t = await getTranslations('marketing');

  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className={styles.title}>{t('howToStart.title')}</h1>
        </Container>
      </section>

      <Container>
        <div className={styles.stepper}>
          <ul className={styles.stepperList}>
            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                1
              </span>

              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>
                  {t('howToStart.step1Title')}
                  <a
                    href={TWITCH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.stepperVersion}
                  >
                    <Image src="/icons/social/twitch.svg" alt="" width={24} height={24} />
                    {MINECRAFT_VERSION_LABEL}
                  </a>
                </h3>
                <p className={styles.stepperDescription}>{t('howToStart.step1Desc')}</p>
                <a
                  href="https://www.minecraft.net/en-us/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.stepperButton}
                >
                  {t('howToStart.step1Button')}
                </a>
              </div>
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                2
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>{t('howToStart.step2Title')}</h3>
                <p className={styles.stepperDescription}>{t('howToStart.step2Desc')}</p>
                <Link href="/register" className={styles.stepperButton}>
                  {t('howToStart.step2Button')}
                </Link>
              </div>
              <StepperImage src={img1} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                3
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>{t('howToStart.step3Title')}</h3>
                <p className={styles.stepperDescription}>{t('howToStart.step3Desc')}</p>
                <Link href={isAuthed ? '/dashboard' : '/login'} className={styles.stepperButton}>
                  {t('howToStart.step3Button')}
                </Link>
              </div>
              <StepperImage src={img2} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                4
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>{t('howToStart.step4Title')}</h3>
                <p className={styles.stepperDescription}>
                  {t.rich('howToStart.step4Desc', {
                    br: () => <span className={styles.stepperDescBreak} aria-hidden="true" />,
                    lucky: chunks => (
                      <Link href={getPublicServerHref('luckysurvival')} className={styles.stepperLink}>
                        {chunks}
                      </Link>
                    ),
                    minewars: chunks => (
                      <Link href={getPublicServerHref('minewars')} className={styles.stepperLink}>
                        {chunks}
                      </Link>
                    ),
                    calmsky: chunks => (
                      <Link href={getPublicServerHref('calmsky')} className={styles.stepperLink}>
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
              <StepperImage src={img3} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                5
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>{t('howToStart.step5Title')}</h3>
                <p className={styles.stepperDescription}>{t('howToStart.step5Desc')}</p>
                <Link href="/servers" className={styles.stepperButton}>
                  {t('howToStart.step5Button')}
                </Link>
              </div>
              <StepperImage src={img4} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                6
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>{t('howToStart.step6Title')}</h3>
                <p className={styles.stepperDescription}>{t('howToStart.step6Desc')}</p>
                <AuthAwareLink isAuthed={isAuthed} intent="play" className={styles.stepperButton}>
                  {t('howToStart.step6Button')}
                </AuthAwareLink>
              </div>
              <StepperImage src={img5} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                7
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>{t('howToStart.step7Title')}</h3>
                <p className={styles.stepperDescription}>{t('howToStart.step7Desc')}</p>
                <AuthAwareLink isAuthed={isAuthed} intent="store" className={styles.stepperButton}>
                  {t('howToStart.step7Button')}
                </AuthAwareLink>
              </div>
              <StepperImage src={img6} />
            </li>
          </ul>
        </div>
      </Container>
    </>
  );
}
