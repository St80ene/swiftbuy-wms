import type { AuditLog } from '@/interfaces/auditlog';
import type { PurchaseOrder } from '@/types';

export interface Store {
  id: string;

  business_id: string;

  business: Business;

  name: string;

  code: string;

  address?: string;

  city?: string;

  state?: string;

  country?: string;

  phone_number?: string;

  audit_logs: AuditLog[];

  users: User[];

  purchase_orders: PurchaseOrder[];

  created_at: Date;

  updated_at: Date;

  deleted_at?: Date | null;
}
