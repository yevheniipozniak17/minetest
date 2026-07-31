import { http } from './http';
import type { ApplyPromoInput, ApplyPromoResult } from './types';

// Перевіряє промокод по активному кошику й повертає розрахунок знижки.
// Нічого не зберігає — той самий код далі передається у створення платежу.
export async function applyPromo(input: ApplyPromoInput) {
  const { data } = await http.post<ApplyPromoResult>('/promos/apply', input);
  return data;
}
