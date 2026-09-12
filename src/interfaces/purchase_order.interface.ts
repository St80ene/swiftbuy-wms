export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SENT_TO_SUPPLIER = 'SENT_TO_SUPPLIER',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: string;
  product_name: string;
  quantity_requested: number;
  estimated_unit_cost: number;
}
