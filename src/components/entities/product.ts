import type { CloudinaryImage } from '../../interfaces/cloudImage';
import type { UomBaseName, UomDisplayName, UomType } from '../../types';

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
  updatedAt!: Date;
  deletedAt?: Date | null;
  stock?: ProductStock | null;
  suppliers?: unknown[]; // This should be replaced with the actual type for suppliers
  primarySupplier?: unknown;
  purchaseOrders?: unknown[];
}

export class ProductStock {
  product_id!: string;
  type!: MutationType; // 'INFLOW' or 'OUTFLOW'
  reason!: MutationReason; // 'SUPPLIER_RESTOCK', 'STOLEN', 'DAMAGED', etc.
  quantity!: number;
  unit_selling_price!: number;
  unit_cost_price!: number;
  createdAt!: Date;
  updatedAt?: Date;
}

export enum MutationType {
  INFLOW = 'INFLOW',
  OUTFLOW = 'OUTFLOW',
}

export enum MutationReason {
  SUPPLIER_RESTOCK = 'SUPPLIER_RESTOCK',
  CUSTOMER_SALE = 'CUSTOMER_SALE',
  STOLEN = 'STOLEN',
  DAMAGED = 'DAMAGED',
  EXPIRED = 'EXPIRED',
  AUDIT_CORRECTION = 'AUDIT_CORRECTION',
  NEW_PRODUCT_INITIALIZATION = 'NEW_PRODUCT_INITIALIZATION',
}
