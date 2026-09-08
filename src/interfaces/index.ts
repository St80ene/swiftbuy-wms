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

export interface ApiResponse {
  status: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: unknown;
}
