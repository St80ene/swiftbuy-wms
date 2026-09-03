import type { UserRole } from '@/enum/role';

export interface Role {
  id: string;
  name: UserRole;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
