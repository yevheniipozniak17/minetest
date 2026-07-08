export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username?: string;
  password: string; // 4–24 символи
  email?: string;
  seonSession?: string | null; // SEON device-intelligence session (антифрод)
}

export interface SendCodeInput {
  email: string;
}

export interface VerifyCodeInput {
  email: string;
  email_code: string;
}

export interface RestorePasswordInput {
  email: string;
}

export interface ChangePasswordInput {
  email: string;
  tmp_password: string;
  new_password: string;
}

export interface ContactFormInput {
  name: string;
  email: string;
  topic: string;
  message: string;
}

// ---- User profile ----

export interface UserProfile {
  email: string;
  username: string | null;
  game_username: string | null;
  country: string | null;
  bio?: string | null;
  has_profile_photo: string | boolean;
}

export interface UserProfileUpdate {
  username?: string | null;
  game_username?: string | null;
  country?: string | null;
  bio?: string | null;
}

export interface AuthenticatedChangePasswordInput {
  current: string;
  new_password: string; // 10–24 символи
  confirm: string;
}

// ---- Shop / core ----

export interface Currency {
  abbr: string;
  name: string;
}

export interface ServerItem {
  server_type: string;
}

export interface Product {
  id: string;
  category_slug?: string;
  // Реальний бекенд віддає title/description; translations — опційний фолбек (зі Swagger).
  title?: string;
  description?: string;
  translations?: string;
  price?: string; // присутня лише в приватному списку
  one_to_buy?: boolean;
  image_name?: string | null;
  currency?: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ProductsQuery {
  page?: number;
  page_size?: number;
  search_query?: string;
  category?: string;
  currency?: string;
  priced?: boolean;
  lang?: string;
}

// ---- Cart / orders ----

export interface AddToCartInput {
  amount: number;
  item_id: string;
  currency: string;
}

export interface OrderItem {
  id: string;
  amount: number;
  price: string;
  one_to_buy: boolean;
  sum_item_price: string;
  currency: string;
  product_id: string;
  order_id: string;
  user: string;
  image_name: string;
  updated: string;
  created: string;
}

export interface OrderListItem {
  id: string;
  order_item: OrderItem[];
  total_price: string;
  server?: string | null;
  user_nickname?: string | null;
  has_bill?: string | boolean | null;
  is_refund?: string | boolean | null;
  is_refunded?: string | boolean | null;
  status?: string | null;
}

// ---- Payment ----

export interface CreatePaymentInput {
  user_nickname: string;
  server: string;
}
