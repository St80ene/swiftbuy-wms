import type { Product } from '../types';

// Interface definitions for incoming query configuration parameters
export interface GetAllProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  category?: string;
  search?: string;
}

// Interface wrapper representing the NestJS backend response envelope structure
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProductsWithMeta {
  products: Product[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
