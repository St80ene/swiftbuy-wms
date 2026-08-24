export interface CloudinaryImage {
  url: string;
  publicID: string;
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

export interface Product {
  images: unknown[] | CloudinaryImage[] | File[];
  id: string;
  name: string;
  stock_quantity: number;
  reorder_level: number;
  is_low_stock: boolean;
  cost_price: number;
  selling_price: number;
  uom_type: UomType;
  uom_base_name: UomBaseName;
  uom_display_name: UomDisplayName;
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
