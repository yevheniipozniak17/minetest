export type ClientInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  zipCode: string;
};

export const EMPTY_CLIENT_INFO: ClientInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  zipCode: '',
};

export type ClientInfoField = keyof ClientInfo;

export function validateClientInfo(info: ClientInfo): ClientInfoField[] {
  const missing: ClientInfoField[] = [];
  if (!info.firstName.trim()) missing.push('firstName');
  if (!info.lastName.trim()) missing.push('lastName');
  if (!info.email.trim()) missing.push('email');
  if (!info.phone.trim()) missing.push('phone');
  if (!info.streetAddress.trim()) missing.push('streetAddress');
  if (!info.city.trim()) missing.push('city');
  if (!info.zipCode.trim()) missing.push('zipCode');
  return missing;
}
