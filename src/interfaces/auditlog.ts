import type { ReactNode } from 'react';
import type { PaginationMeta } from '.';

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: Date;
  userId: string | null;
  metadata: {
    productName?: string;
    createdAt?: string;
    reason?: string;
  };
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
}

export interface ProductAuditLogsResponse<T = AuditLog> {
  auditLogs: T[];
  meta: PaginationMeta;
}

export interface AuditLogDetailsModalProps {
  isOpen: boolean;
  auditLog: AuditLog | null;
  onClose: () => void;
}

export interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export interface ChangeItemProps {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface ValueBoxProps {
  label: string;
  value: string;
  isNew?: boolean;
}
