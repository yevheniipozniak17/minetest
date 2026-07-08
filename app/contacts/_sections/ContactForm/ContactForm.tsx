'use client';

import { isAxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { sendContactForm } from '@/lib/api/contact';
import { CONTACT_TOPICS, SUPPORT_EMAIL } from '@/lib/data/contacts';
import styles from './ContactForm.module.css';

type FormStatus = 'idle' | 'submitting' | 'sent';

function isRateLimitError(status: number | undefined, detail: unknown): boolean {
  if (status === 429) return true;
  if (typeof detail !== 'string') return false;
  const lower = detail.toLowerCase();
  return lower.includes('limit') || lower.includes('daily') || lower.includes('3');
}

export default function ContactForm() {
  const t = useTranslations('marketing');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !topic || !message.trim()) {
      setFormError(t('contacts.form.error'));
      return;
    }

    setStatus('submitting');
    try {
      await sendContactForm({
        name: name.trim(),
        email: email.trim(),
        topic,
        message: message.trim(),
      });
      setStatus('sent');
    } catch (err) {
      setStatus('idle');
      if (isAxiosError(err)) {
        const statusCode = err.response?.status;
        const detail = err.response?.data?.detail;
        if (isRateLimitError(statusCode, detail)) {
          setFormError(t('contacts.form.errorRateLimit'));
        } else if (typeof detail === 'string') {
          setFormError(detail);
        } else {
          setFormError(t('contacts.form.errorNetwork'));
        }
      } else {
        setFormError(t('contacts.form.errorNetwork'));
      }
    }
  }

  return (
    <article className={styles.formCard} aria-labelledby="contact-form-heading">
      <p className={styles.formLabel}>{t('contacts.form.label')}</p>
      <h2 id="contact-form-heading" className={styles.formTitle}>
        {t('contacts.form.title')}
      </h2>
      <p className={styles.formDescription}>{t('contacts.form.description')}</p>

      {status === 'sent' ? (
        <div className={styles.success} role="status">
          <p className={styles.successTitle}>{t('contacts.form.successTitle')}</p>
          <p className={styles.successText}>{t('contacts.form.successText')}</p>
          <p className={styles.successText}>
            {t('contacts.form.successFallback')}{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.successLink}>
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <button
            type="button"
            className={styles.resetButton}
            onClick={() => {
              setStatus('idle');
              setName('');
              setEmail('');
              setTopic('');
              setMessage('');
            }}
          >
            {t('contacts.form.sendAnother')}
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {formError ? <p className={styles.formError}>{formError}</p> : null}

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-name">
                {t('contacts.form.nameLabel')}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={t('contacts.form.namePlaceholder')}
                className={styles.input}
                value={name}
                onChange={event => setName(event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-email">
                {t('contacts.form.emailLabel')}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t('contacts.form.emailPlaceholder')}
                className={styles.input}
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-topic">
              {t('contacts.form.topicLabel')}
            </label>
            <div className={styles.selectWrap}>
              <select
                id="contact-topic"
                name="topic"
                className={styles.select}
                value={topic}
                onChange={event => setTopic(event.target.value)}
                required
              >
                <option value="" disabled>
                  {t('contacts.form.topicPlaceholder')}
                </option>
                {CONTACT_TOPICS.map(item => (
                  <option key={item.value} value={item.value}>
                    {t(`contacts.data.topic.${item.value}`)}
                  </option>
                ))}
              </select>
              <span className={styles.chevron} aria-hidden="true">
                ▾
              </span>
            </div>
          </div>

          <div className={`${styles.field} ${styles.messageField}`}>
            <label className={styles.label} htmlFor="contact-message">
              {t('contacts.form.messageLabel')}
            </label>
            <textarea
              id="contact-message"
              name="message"
              className={styles.textarea}
              placeholder={t('contacts.form.messagePlaceholder')}
              rows={5}
              value={message}
              onChange={event => setMessage(event.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
            {status === 'submitting' ? t('contacts.form.submitting') : t('contacts.form.submit')}
          </button>
        </form>
      )}
    </article>
  );
}
