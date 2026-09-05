import type { Product } from '@/types';
import type { IBusiness } from './business.interface';

export const CATEGORY_SORT_FIELD_NAMES = [
  'name',
  'createdAt',
  'updatedAt',
] as const;

export type CategorySortField = (typeof CATEGORY_SORT_FIELD_NAMES)[number];

export interface ICategory {
  id: string;

  name: string;
  description?: string;

  business_id: string;

  // Relationships
  business?: IBusiness;
  products?: Product[];

  // Timestamps
  created_at: Date;
  updated_at: Date;
}
