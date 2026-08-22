export interface Product {
  images: any;
  id: string;
  name: string;
  stock_quantity: number;
  reorder_level: number;
  is_low_stock: boolean;
  cost_price: number;
  selling_price: number;
  uom_type: 'UNIT' | 'WEIGHT' | 'VOLUME';
  uom_base_name: string;
  uom_display_name: string;
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
