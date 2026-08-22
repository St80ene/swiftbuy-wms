import { UomBaseName, UomDisplayName, type UomType } from '../../enum/product';
import type { CloudinaryImage } from '../../interfaces/cloudImage';

export class Product {
  id!: string;
  name!: string;
  description?: string;
  images?: CloudinaryImage[];
  stock_quantity!: number;
  cost_price!: number;
  selling_price!: number;
  is_low_stock!: boolean;
  reorder_level!: number;
  uom_type!: UomType; // 'UNIT', 'WEIGHT', 'VOLUME'
  uom_base_name!: UomBaseName; // 'pcs', 'g', 'ml'
  uom_display_name!: UomDisplayName; // 'pcs', 'kg', 'L'
  createdAt!: Date;
}
