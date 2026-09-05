import type { IBusiness } from './business.interface';
import type { IStore } from './store.interface';
import type { Role } from './role.interface';

export interface IUser {
  id: string;

  first_name: string;
  last_name: string;
  business_email: string;

  role_id: string;
  business_id: string;
  store_id: string;

  is_active: boolean;

  // Relationships
  role?: Role;
  business?: IBusiness;
  store?: IStore;

  // Timestamps
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
