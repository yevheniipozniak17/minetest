import { NextRequest, NextResponse } from 'next/server';
import { backend, backendAuth } from '@/lib/server/backend';
import { withAuth } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';
import type { ApplyPromoInput } from '@/lib/api/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ApplyPromoInput;
    const data = await withAuth(async token => {
      const res = await backend.post('/core/promos/apply/', body, backendAuth(token));
      return res.data;
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return handleApiError(err, 'Failed to apply promo');
  }
}
