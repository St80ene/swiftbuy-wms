import type { Product } from '@/types';
import type { IBusiness } from './business.interface';
import type { IStore } from './store.interface';

export interface IStock {
  id: string;

  product_id: string;
  business_id: string;
  store_id: string;

  quantity: number;
  reorder_level: number;

  product?: Product;
  business?: IBusiness;
  store?: IStore;

  created_at: Date;
  updated_at: Date;
}
