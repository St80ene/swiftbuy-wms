import type { UserRole } from '@/enum/role';
import type { RolePermission } from './role_permission.interface';

export interface Role {
  id: string;
  name: UserRole;
  rolePermissions?: RolePermission[];
  description: string | null;
  created_at: Date;
  updated_at: Date;
}
