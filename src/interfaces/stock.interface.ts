import type { MutationType, MutationReason } from '@/enum/stock.enum';

export interface IStock {
  id: string;
  product_id: string;
  product?: {
    id: string;
    name: string;
    sku?: string;
  };
  type: MutationType;
  reason: MutationReason;
  quantity: number;
  unit_cost_price: number;
  unit_selling_price: number;
  created_at: Date;
  updated_at: Date;
}
