import type { ProductStatus } from '@/enum/product';

export interface CloudinaryImage {
  url: string;
  publicId: string;
}

export enum UomType {
  UNIT = 'UNIT',
  WEIGHT = 'WEIGHT',
  VOLUME = 'VOLUME',
}

export enum UomBaseName {
  PCS = 'pcs',
  G = 'g',
  ML = 'ml',
}

export enum UomDisplayName {
  PCS = 'pcs',
  G = 'g',
  KG = 'kg',
  ML = 'ml',
  L = 'L',
}

export interface ProductImage {
  url: string;
  publicId?: string;
  publicID?: string;
}

export interface Product {
  images: CloudinaryImage[];
  id: string;
  name: string;
  stock_quantity: number;
  reorder_level: number;
  cost_price: number;
  selling_price: number;
  uom_type: UomType;
  uom_base_name: UomBaseName;
  uom_display_name: UomDisplayName;
  createdAt: Date;
  updatedAt: Date;
  status: ProductStatus;
  category?: string;
  description?: string;
  suppliers?: Supplier[];
  purchase_orders?: PurchaseOrder[];
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_name: string;
  status: 'DRAFT' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  total_estimated_cost: number;
  createdAt: string;
  items: { product_name: string; quantity: number; cost: number }[];
}

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  address: string;
  last_purchase_price?: number;
  lead_time_days?: number;
  is_primary?: boolean;
  is_active?: boolean;
  city?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_name: string;
  status: 'DRAFT' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  total_estimated_cost: number;
  createdAt: string;
  items: { product_name: string; quantity: number; cost: number }[];
}
