import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/server/backend';
import { handleApiError } from '@/lib/server/apiError';
import type { ContactFormInput } from '@/lib/api/types';

function clientIpHeaders(req: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {};
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  if (forwarded) headers['X-Forwarded-For'] = forwarded;
  if (realIp) headers['X-Real-IP'] = realIp;
  return headers;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactFormInput;
    const { data } = await backend.post('/core/contact_form/send/', body, {
      headers: clientIpHeaders(req),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err, 'Failed to send message');
  }
}
