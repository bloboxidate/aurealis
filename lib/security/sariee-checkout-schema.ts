import 'server-only';
import { z } from 'zod';

const item = z.object({
  productId: z.string().min(1).max(64),
  quantity: z.number().int().min(1).max(99),
});

export const sarieeCheckoutBodySchema = z.object({
  locale: z.enum(['en', 'ar']),
  items: z.array(item).min(1).max(100),
  fullName: z.string().min(1).max(200),
  email: z.string().email().max(254),
  phone: z.string().min(3).max(40).regex(/^[+0-9.\s()-]+$/u),
  address: z.string().min(1).max(2000),
  city: z.string().min(1).max(200),
  cityId: z.union([z.string(), z.number()]).optional(),
  promoCode: z.string().max(50).optional(),
  paymentMethodId: z.union([z.string(), z.number()]).optional(),
  sarieeSession: z.string().max(512).optional(),
  customerBearer: z.string().max(512).optional(),
});

export type SarieeCheckoutBody = z.infer<typeof sarieeCheckoutBodySchema>;
