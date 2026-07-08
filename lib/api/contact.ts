import { apiClient } from './client';
import type { ContactFormInput } from './types';

export function sendContactForm(input: ContactFormInput) {
  return apiClient.post('/contact/send', input);
}
