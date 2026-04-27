export type StoredLine = {
  productId: string;
  name: string;
  quantity: number;
  priceEach: number;
};

export type StoredOrder = {
  ref: string;
  createdAt: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  totalEgp: number;
  lines: StoredLine[];
  paymobTxn?: string;
  source: 'demo' | 'card';
};

const ORDERS_KEY = 'aurealis-orders';
const MAX_ORDERS = 80;

function safeParse(): StoredOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const r = localStorage.getItem(ORDERS_KEY);
    if (!r) return [];
    const j = JSON.parse(r) as unknown;
    return Array.isArray(j) ? (j as StoredOrder[]) : [];
  } catch {
    return [];
  }
}

function save(list: StoredOrder[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(list.slice(0, MAX_ORDERS)));
}

export function getStoredOrders(): StoredOrder[] {
  return safeParse().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getStoredOrderByRef(ref: string): StoredOrder | undefined {
  const decoded = decodeURIComponent(ref);
  return safeParse().find((o) => o.ref === decoded);
}

export function appendStoredOrder(order: StoredOrder): void {
  const list = safeParse();
  if (list.some((o) => o.ref === order.ref)) return;
  list.unshift(order);
  save(list);
}

export function findOrderForTracking(ref: string, emailNorm: string): StoredOrder | undefined {
  const e = emailNorm.trim().toLowerCase();
  return safeParse().find(
    (o) => o.ref === ref.trim() && o.email.trim().toLowerCase() === e
  );
}
