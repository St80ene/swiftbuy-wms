import React, { useState } from 'react';
import { ProductCatalogTable } from './ProductCatalogueTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/products';
import ProductSearch from './ProductSearch';
import useDebouncedValue from '../../hooks/debounceHook';
import { LoadingScreen } from '../Error/LoadingScreen';
import { ErrorPage } from '../Error/ErrorPage';
import AddProductModal from './modals/AddProductModal';
import type { Product } from '../entities/product';

export const Products: React.FC = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const createProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await productService.createProduct(data);
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });

      setIsModalOpen(false);
    },

    onError: (error) => {
      console.error('Failed to create product:', error);
    },
  });

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ['products', { page, limit, order, search: debouncedSearch }],
    queryFn: () =>
      productService.getAllProducts({
        page,
        limit,
        sortBy: 'createdAt',
        order,
        search: debouncedSearch,
      }),
    placeholderData: (previousData) => previousData,
  });

  // 1. Loading state (triggers on initial mount when no cached/placeholder data exists)
  if (isLoading) {
    return <LoadingScreen label="Fetching product catalogue..." />;
  }

  // 2. Error state
  if (isError) {
    return (
      <ErrorPage
        title="Failed to load products"
        message={
          error instanceof Error
            ? error.message
            : 'An error occurred while fetching the product list. Please check your network connection.'
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
      {/* Header View Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Products Management
          </h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2.5 rounded-lg transition-all shadow-xs self-start sm:self-center"
        >
          Add New Product
        </button>
      </div>

      <ProductSearch
        value={search}
        onChange={handleSearchChange}
        isFetching={isFetching}
      />

      {/* Catalogue View */}
      <ProductCatalogTable
        products={data?.products || []}
        meta={data?.meta}
        order={order}
        onOrderChange={setOrder}
        onPageChange={(newPage) => setPage(newPage)}
        isPlaceholderData={isPlaceholderData}
      />

      {/* Modal View Block */}
      {isModalOpen && (
        <AddProductModal
          isSubmitting={isSubmitting}
          setIsModalOpen={setIsModalOpen}
          onSubmit={async (data) => {
            await createProductMutation.mutateAsync(data);
          }}
        />
      )}
    </div>
  );
};
