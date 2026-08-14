'use client';

import { useTranslations } from 'next-intl';
import type { ClientInfo, ClientInfoField } from '../CheckoutModal/clientInfo';
import {
  autoCompleteForClientInfoField,
  CLIENT_INFO_FIELDS,
  CLIENT_INFO_LABEL_KEYS,
  CLIENT_INFO_PLACEHOLDER_KEYS,
  inputTypeForClientInfoField,
  isHalfWidthClientInfoField,
} from './clientInfoFields';
import styles from './ClientInfoForm.module.css';

type ClientInfoFormProps = {
  value: ClientInfo;
  onChange: (info: ClientInfo) => void;
  fieldErrors?: ClientInfoField[];
  onClearFieldError?: (field: ClientInfoField) => void;
  idPrefix?: string;
  disabled?: boolean;
  showValidationNote?: boolean;
};

export function ClientInfoForm({
  value,
  onChange,
  fieldErrors = [],
  onClearFieldError,
  idPrefix = 'client',
  disabled = false,
  showValidationNote = false,
}: ClientInfoFormProps) {
  const t = useTranslations('cart');

  function updateField(field: ClientInfoField, nextValue: string) {
    onChange({ ...value, [field]: nextValue });
    if (fieldErrors.includes(field)) onClearFieldError?.(field);
  }

  return (
    <div className={styles.root}>
      <div className={styles.formGrid}>
        {CLIENT_INFO_FIELDS.map(field => {
          const hasError = fieldErrors.includes(field);
          const isHalf = isHalfWidthClientInfoField(field);

          return (
            <div
              key={field}
              className={`${styles.field} ${isHalf ? styles.fieldHalf : styles.fieldFull}`}
            >
              <label className={styles.fieldLabel} htmlFor={`${idPrefix}-${field}`}>
                {t(CLIENT_INFO_LABEL_KEYS[field])}
              </label>
              <input
                id={`${idPrefix}-${field}`}
                className={`${styles.input} ${hasError ? styles.inputError : ''}`}
                type={inputTypeForClientInfoField(field)}
                value={value[field]}
                onChange={event => updateField(field, event.target.value)}
                placeholder={t(CLIENT_INFO_PLACEHOLDER_KEYS[field])}
                autoComplete={autoCompleteForClientInfoField(field)}
                disabled={disabled}
                aria-invalid={hasError}
              />
            </div>
          );
        })}
      </div>
      {showValidationNote && fieldErrors.length > 0 && (
        <p className={styles.validationNote} role="alert">
          {t('clientInfoValidation')}
        </p>
      )}
    </div>
  );
}
