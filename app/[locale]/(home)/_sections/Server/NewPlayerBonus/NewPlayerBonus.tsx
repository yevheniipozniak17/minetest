'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../Server.module.css';

const NEW_PLAYER_PROMO_CODE = 'WELCOME20';

export function NewPlayerBonus() {
  const t = useTranslations('home');
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | null>(null);

  const handleClaim = useCallback(() => {
    void navigator.clipboard.writeText(NEW_PLAYER_PROMO_CODE).then(() => {
      setNotice(t('server.bonusCopyNotice'));
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
      noticeTimer.current = window.setTimeout(() => setNotice(null), 3000);
    });
  }, [t]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  return (
    <>
      <div className={styles.newPlayerBonus}>
        <h2 className={styles.newPlayerBonus_title}>{t('server.bonusTitle')}</h2>
        <p className={styles.newPlayerBonus_text}>{t('server.bonusText')}</p>
        <p className={styles.newPlayerBonus_description}>
          {t('server.bonusDescLine1')}
          <br />
          {t('server.bonusDescLine2')}
        </p>
        <button type="button" className={styles.newPlayerBonus_button} onClick={handleClaim}>
          {t('server.bonusClaim')}
        </button>
        <Image
          className={styles.newPlayerBonus_illustration}
          src="/icons/illustrations/server-illustration.png"
          alt=""
          width={475}
          height={243}
          aria-hidden="true"
        />
      </div>

      {notice && (
        <div className={styles.toast} role="status" aria-live="polite">
          {notice}
        </div>
      )}
    </>
  );
}
