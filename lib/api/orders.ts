import { http } from './http';
import type { OrderListItem, Paginated } from './types';

function getOrderTimestamp(order: OrderListItem): number {
  const times = (order.order_item ?? [])
    .map(item => new Date(item.created).getTime())
    .filter(time => !Number.isNaN(time));

  return times.length ? Math.max(...times) : 0;
}

function sortOrdersByDateDesc(orders: OrderListItem[]): OrderListItem[] {
  return [...orders].sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a));
}

export async function getOrders(page = 1, pageSize?: number) {
  const params: Record<string, number> = { page };
  if (pageSize) params.page_size = pageSize;
  const { data } = await http.get<Paginated<OrderListItem>>('/orders', { params });
  return { ...data, results: sortOrdersByDateDesc(data.results) };
}

function parseFilename(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (utf8?.[1]) return decodeURIComponent(utf8[1]);
  const plain = /filename="([^"]+)"/i.exec(contentDisposition);
  return plain?.[1] ?? null;
}

async function fetchOrderBill(orderId: string): Promise<{ blob: Blob; filename: string }> {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/bill`, {
    credentials: 'include',
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(err?.detail ?? 'Could not load receipt.');
  }

  const blob = await res.blob();
  const filename = parseFilename(res.headers.get('content-disposition')) ?? `receipt-${orderId}.pdf`;
  return { blob, filename };
}

function readTruthyFlag(value: string | boolean | null | undefined): boolean | null {
  if (value == null) return null;
  if (value === true) return true;
  if (value === false) return false;
  const normalized = String(value).toLowerCase().trim();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  return null;
}

export function orderHasBill(order: Pick<OrderListItem, 'has_bill'>): boolean {
  const value = order.has_bill;
  if (value == null) return true;
  if (value === true) return true;
  if (value === false) return false;
  const normalized = String(value).toLowerCase().trim();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

export function isOrderRefunded(
  order: Pick<OrderListItem, 'is_refund' | 'is_refunded' | 'status' | 'has_bill'>,
): boolean {
  const refundFlag = readTruthyFlag(order.is_refund) ?? readTruthyFlag(order.is_refunded);
  if (refundFlag === true) return true;
  if (refundFlag === false) return false;

  const status = order.status?.toLowerCase().trim();
  if (status === 'refund' || status === 'refunded') return true;

  const bill = order.has_bill;
  if (bill != null) {
    const normalized = String(bill).toLowerCase().trim();
    if (normalized === 'refund' || normalized === 'refunded') return true;
  }

  return false;
}

export type OrderPaymentStatus = 'paid' | 'pending' | 'refund' | 'failed';

function mapBackendOrderStatus(status: string | null | undefined): OrderPaymentStatus | null {
  const normalized = status?.toUpperCase().trim();
  if (!normalized) return null;

  switch (normalized) {
    case 'PAID':
      return 'paid';
    case 'FAILED':
      return 'failed';
    case 'CREATED':
    case 'PENDING':
      return 'pending';
    default:
      return null;
  }
}

function hasExplicitBill(order: Pick<OrderListItem, 'has_bill'>): boolean {
  const value = order.has_bill;
  if (value == null) return false;
  if (value === true) return true;
  if (value === false) return false;
  const normalized = String(value).toLowerCase().trim();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

export function mapOrderStatus(
  order: Pick<OrderListItem, 'has_bill' | 'is_refund' | 'is_refunded' | 'status'>,
): OrderPaymentStatus {
  if (isOrderRefunded(order)) return 'refund';

  // Receipt exists — payment succeeded even if status field is stale (e.g. FAILED after return).
  if (hasExplicitBill(order)) return 'paid';

  const backendStatus = mapBackendOrderStatus(order.status);
  if (backendStatus) return backendStatus;

  return orderHasBill(order) ? 'paid' : 'failed';
}

export async function downloadOrderBill(orderId: string): Promise<void> {
  const { blob, filename } = await fetchOrderBill(orderId);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function openOrderBill(orderId: string): Promise<void> {
  const { blob } = await fetchOrderBill(orderId);
  const url = URL.createObjectURL(blob);
  const tab = window.open(url, '_blank', 'noopener,noreferrer');
  if (!tab) {
    URL.revokeObjectURL(url);
    throw new Error('Pop-up blocked. Allow pop-ups to open the receipt.');
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
