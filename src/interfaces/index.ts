export interface RecordsWithMeta<T> {
  records: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T = Record<string, unknown>> {
  status: boolean;
  message: string;
  data?: T;
  error?: unknown;
}
