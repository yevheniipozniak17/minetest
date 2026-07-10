'use client';

import { isAxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { sendContactForm } from '@/lib/api/contact';
import { CONTACT_TOPICS, SUPPORT_EMAIL } from '@/lib/data/contacts';
import type { ContactTopicValue } from '@/lib/data/contacts';
import styles from './ContactForm.module.css';

type FormStatus = 'idle' | 'submitting' | 'sent';
type FieldKey = 'name' | 'email' | 'topic' | 'message';
type FieldErrors = Partial<Record<FieldKey, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TOPICS = new Set<string>(CONTACT_TOPICS.map(item => item.value));
const MESSAGE_MIN_LENGTH = 10;

function fieldClass(base: string, errorClass: string, hasError: boolean) {
  return [base, hasError ? errorClass : ''].filter(Boolean).join(' ');
}

function mapApiErrors(data: unknown): { fields: FieldErrors; general: string | null } {
  const fields: FieldErrors = {};
  let general: string | null = null;

  if (typeof data === 'string') {
    return { fields, general: data };
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    (['name', 'email', 'topic', 'message'] as const).forEach(key => {
      const value = obj[key];
      if (Array.isArray(value) && value.length) fields[key] = String(value[0]);
      else if (typeof value === 'string') fields[key] = value;
    });
    if (typeof obj.detail === 'string') general = obj.detail;
    else if (Array.isArray(obj.detail) && obj.detail.length) general = String(obj.detail[0]);
  }

  return { fields, general };
}

function isRateLimitError(status: number | undefined, detail: unknown): boolean {
  if (status === 429) return true;
  const text =
    typeof detail === 'string'
      ? detail
      : Array.isArray(detail) && detail.length
        ? String(detail[0])
        : null;
  if (!text) return false;
  const lower = text.toLowerCase();
  return lower.includes('limit') || lower.includes('daily') || lower.includes('3');
}

function validateContactForm(
  values: { name: string; email: string; topic: string; message: string },
  t: (key: string) => string,
): FieldErrors {
  const errors: FieldErrors = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedMessage = values.message.trim();

  if (!trimmedName) errors.name = t('contacts.form.errorNameRequired');
  else if (trimmedName.length > 255) errors.name = t('contacts.form.errorNameTooLong');

  if (!trimmedEmail) errors.email = t('contacts.form.errorEmailRequired');
  else if (trimmedEmail.length > 254) errors.email = t('contacts.form.errorEmailTooLong');
  else if (!EMAIL_RE.test(trimmedEmail)) errors.email = t('contacts.form.errorEmailInvalid');

  if (!values.topic || !VALID_TOPICS.has(values.topic)) {
    errors.topic = t('contacts.form.errorTopicRequired');
  }

  if (!trimmedMessage) errors.message = t('contacts.form.errorMessageRequired');
  else if (trimmedMessage.length < MESSAGE_MIN_LENGTH) {
    errors.message = t('contacts.form.errorMessageTooShort');
  }

  return errors;
}

export default function ContactForm() {
  const t = useTranslations('marketing');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function clearFieldError(key: FieldKey) {
    setFieldErrors(prev => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const errors = validateContactForm({ name, email, topic, message }, t);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
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
        const { fields, general } = mapApiErrors(err.response?.data);

        if (Object.keys(fields).length > 0) {
          setFieldErrors(fields);
          if (general && !isRateLimitError(statusCode, general)) {
            setFormError(general);
          }
          return;
        }

        if (isRateLimitError(statusCode, general ?? err.response?.data?.detail)) {
          setFormError(t('contacts.form.errorRateLimit'));
        } else if (general) {
          setFormError(general);
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
      {status !== 'sent' ? (
        <p className={styles.formDescription}>{t('contacts.form.description')}</p>
      ) : null}

      {status === 'sent' ? (
        <div className={styles.success} role="status">
          <p className={styles.successTitle}>{t('contacts.form.successTitle')}</p>
          <p className={styles.successText}>
            {t('contacts.form.successText', { email })}
          </p>
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
              setFormError(null);
              setFieldErrors({});
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
                className={fieldClass(styles.input, styles.inputError, !!fieldErrors.name)}
                value={name}
                maxLength={255}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                onChange={event => {
                  setName(event.target.value);
                  clearFieldError('name');
                }}
                required
              />
              {fieldErrors.name ? (
                <p id="contact-name-error" className={styles.fieldError}>
                  {fieldErrors.name}
                </p>
              ) : null}
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
                className={fieldClass(styles.input, styles.inputError, !!fieldErrors.email)}
                value={email}
                maxLength={254}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                onChange={event => {
                  setEmail(event.target.value);
                  clearFieldError('email');
                }}
                required
              />
              {fieldErrors.email ? (
                <p id="contact-email-error" className={styles.fieldError}>
                  {fieldErrors.email}
                </p>
              ) : null}
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
                className={fieldClass(styles.select, styles.selectError, !!fieldErrors.topic)}
                value={topic}
                aria-invalid={!!fieldErrors.topic}
                aria-describedby={fieldErrors.topic ? 'contact-topic-error' : undefined}
                onChange={event => {
                  setTopic(event.target.value);
                  clearFieldError('topic');
                }}
                required
              >
                <option value="" disabled>
                  {t('contacts.form.topicPlaceholder')}
                </option>
                {CONTACT_TOPICS.map(item => (
                  <option key={item.value} value={item.value}>
                    {t(`contacts.data.topic.${item.value as ContactTopicValue}`)}
                  </option>
                ))}
              </select>
              <span className={styles.chevron} aria-hidden="true">
                ▾
              </span>
            </div>
            {fieldErrors.topic ? (
              <p id="contact-topic-error" className={styles.fieldError}>
                {fieldErrors.topic}
              </p>
            ) : null}
          </div>

          <div className={`${styles.field} ${styles.messageField}`}>
            <label className={styles.label} htmlFor="contact-message">
              {t('contacts.form.messageLabel')}
            </label>
            <textarea
              id="contact-message"
              name="message"
              className={fieldClass(styles.textarea, styles.textareaError, !!fieldErrors.message)}
              placeholder={t('contacts.form.messagePlaceholder')}
              rows={5}
              value={message}
              aria-invalid={!!fieldErrors.message}
              aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
              onChange={event => {
                setMessage(event.target.value);
                clearFieldError('message');
              }}
              required
            />
            {fieldErrors.message ? (
              <p id="contact-message-error" className={styles.fieldError}>
                {fieldErrors.message}
              </p>
            ) : null}
          </div>

          <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
            {status === 'submitting' ? t('contacts.form.submitting') : t('contacts.form.submit')}
          </button>
        </form>
      )}
    </article>
  );
}
