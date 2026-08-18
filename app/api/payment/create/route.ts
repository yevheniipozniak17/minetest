import { NextRequest, NextResponse } from 'next/server';
import { backend, backendAuth } from '@/lib/server/backend';
import { withAuth } from '@/lib/server/withAuth';
import { handleApiError } from '@/lib/server/apiError';
import type { CreatePaymentInput } from '@/lib/api/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreatePaymentInput;
    const data = await withAuth(async token => {
      // Django тут ще й ходить до платіжного провайдера за сесією — стандартних
      // 15 с не завжди вистачає, а обрив виглядає для покупця як «оплата не працює».
      const res = await backend.post('/payment/create_payment/', body, {
        ...backendAuth(token),
        timeout: 30_000,
      });
      return res.data;
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err, 'Failed to create payment');
  }
}
