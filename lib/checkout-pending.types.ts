export type PendingLine = {
  productId: string;
  quantity: number;
  name: string;
  priceEach: number;
};

export type PendingCheckout = {
  lineItems: PendingLine[];
  totalEgp: number;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  source: 'demo' | 'card';
};
