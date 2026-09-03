import type { IBusiness } from './business.interface';
import type { IUser } from './user.interface';
import type { AuditLog } from './auditlog';
import type { PurchaseOrder } from '@/types';

export interface IStore {
  id: string;

  business_id: string;

  name: string;
  code: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone_number?: string;

  // Relationships
  business?: IBusiness;
  users?: IUser[];
  audit_logs?: AuditLog[];
  purchase_orders?: PurchaseOrder[];

  // Timestamps
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
