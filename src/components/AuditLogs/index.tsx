import React, { useState } from 'react';
import { FileText, Code2 } from 'lucide-react';
import type { AuditLog } from '@/interfaces/auditlog';
import type { PaginationMeta } from '@/interfaces';
import { getAuditLogColumns } from './audit_logs_columns';
import DataTable from '../common/DataTable';

export const AuditLogsPage: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const auditLogs: AuditLog[] = [
    {
      id: 'log-101',
      action: 'UPDATE',
      userId: 'usr-90182347',
      entity: 'PRODUCTS',
      entityId: 'prd-101',
      oldValue: { price: 29.99, stock_quantity: 45 },
      newValue: { price: 34.99, stock_quantity: 195 },
      metadata: { reason: 'Price adjustment & bulk stock intake' },
      created_at: '2026-09-08T14:32:01Z' as unknown as Date,
    },
    {
      id: 'log-102',
      action: 'DELETE',
      userId: 'usr-90211823',
      entity: 'SUPPLIERS',
      entityId: 'sup-88',
      oldValue: { name: 'Deprecated Logistics Co', status: 'INACTIVE' },
      newValue: null,
      metadata: { reason: 'Supplier contract terminated' },
      created_at: '2026-09-08T11:12:40Z' as unknown as Date,
    },
    {
      id: 'log-103',
      action: 'DEACTIVATE',
      userId: '',
      entity: 'STORES',
      entityId: 'str-04',
      oldValue: { status: 'ACTIVE' },
      newValue: { status: 'INACTIVE' },
      metadata: { reason: 'Scheduled store maintenance shutdown' },
      created_at: '2026-09-07T09:00:00Z' as unknown as Date,
    },
  ];

  const meta: PaginationMeta = {
    currentPage,
    itemCount: auditLogs.length,
    itemsPerPage: pageSize,
    totalItems: auditLogs.length,
    totalPages: Math.ceil(auditLogs.length / pageSize) || 1,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage * pageSize < auditLogs.length,
  };

  // Handler passed into the column generator
  const handleViewChanges = (log: AuditLog) => {
    setSelectedLog(log);
  };

  const columns = getAuditLogColumns(handleViewChanges);

  return (
    <div className="space-y-6 p-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="text-purple-600" size={24} />
          System Audit Logs
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Immutable log trail capturing user mutations, database entity diffs
          (`oldValue` / `newValue`), and activity metadata.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable<AuditLog>
            records={auditLogs}
            columns={columns}
            meta={meta}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onSelectRecord={(log) => setSelectedLog(log)}
            getRowKey={(record) => record.id}
            getRowClassName={(record) =>
              record.id === selectedLog?.id ? 'bg-purple-50/50' : ''
            }
          />
        </div>

        {/* Diff Inspector Side Drawer / Panel */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-4 shadow-xs h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Code2 size={14} className="text-purple-600" />
            Diff Inspector (`oldValue` vs `newValue`)
          </h3>

          {selectedLog ? (
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] text-slate-400 mb-1">
                  Entity Details:
                </p>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px]">
                  <span>{selectedLog.entity}</span>{' '}
                  <span className="text-slate-400">
                    ({selectedLog.entityId})
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 mb-1">
                  Previous State (`oldValue`):
                </p>
                <pre className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-rose-600 text-[11px] overflow-x-auto">
                  {JSON.stringify(selectedLog.oldValue, null, 2) || 'null'}
                </pre>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 mb-1">
                  Updated State (`newValue`):
                </p>
                <pre className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-emerald-600 text-[11px] overflow-x-auto">
                  {JSON.stringify(selectedLog.newValue, null, 2) || 'null'}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
              Click "View changes" on any row to inspect state diffs
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
