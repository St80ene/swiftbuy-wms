import type { Permission } from './permission.interface';

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  permission: Permission;
  created_at: Date;
  updated_at: Date;
}
