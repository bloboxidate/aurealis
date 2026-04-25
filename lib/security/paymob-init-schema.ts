import 'server-only';
import { z } from 'zod';

const item = z.object({
  productId: z.string().min(1).max(48).regex(/^[a-zA-Z0-9_-]+$/),
  quantity: z.number().int().min(1).max(99),
});

export const paymobInitBodySchema = z.object({
  locale: z.enum(['en', 'ar']),
  items: z.array(item).min(1).max(100),
  fullName: z.string().min(1).max(200),
  email: z.string().email().max(254),
  phone: z.string().min(3).max(40).regex(/^[+0-9.\s-]+$/u),
  address: z.string().min(1).max(2000),
  city: z.string().min(1).max(200),
});

export type PaymobInitBody = z.infer<typeof paymobInitBodySchema>;
