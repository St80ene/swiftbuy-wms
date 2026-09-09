import { useState, useMemo } from 'react';

import {
  Plus,
  Search,
  ArrowUpDown,
  FolderTree,
  Package,
  Layers,
  X,
  Filter,
} from 'lucide-react';

import { getCategoryColumns } from './CategoriesTableColumns';
import type {
  ICategory,
  CategorySortField,
} from '@/interfaces/category.interface';
import DataTable from '../common/DataTable';
import useDebouncedValue from '@/hooks/debounceHook';
import { categoryService } from '@/services/categories';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { CategoriesResponse } from '@/types';
import { LoadingScreen } from '../common/Error/LoadingScreen';
import { ErrorPage } from '../common/Error/ErrorPage';
import { useNavigate } from 'react-router-dom';

export const CategoriesPage = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(7);

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<CategorySortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const debouncedSearch = useDebouncedValue(searchQuery.trim(), 350);

  // Category Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  // Handlers
  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: ICategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setLimit(newSize);
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const {
    data,
    isLoading,
    isError,
    error,
    // isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery<CategoriesResponse>({
    queryKey: ['categories', { page, limit, search: debouncedSearch }],
    queryFn: () =>
      categoryService.getAllCategories({
        page,
        limit,
        sortBy: 'created_at',
        search: debouncedSearch,
      }),
    placeholderData: (previousData) => previousData,
  });

  const handleDeleteCategory = (category: ICategory) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      queryClient.invalidateQueries({
        queryKey: ['categories'],
        exact: true,
      });
    }
  };

  // Metrics summary
  const totalProductsCount = useMemo(() => {
    return data?.meta?.totalItems ?? 0;
  }, [data?.meta?.totalItems]);

  // 1. Loading state (triggers on initial mount when no cached/placeholder data exists)
  if (isLoading) {
    return <LoadingScreen label="Fetching product catalogue..." />;
  }

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
        onNavigateHome={() => navigate('/dashboard')}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 min-h-screen bg-slate-50/50">
      {/* 1. Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize products, assign attributes, and track inventory
            distribution.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="
            inline-flex items-center justify-center gap-2
            px-4 py-2.5
            text-sm font-semibold text-white
            bg-slate-900 hover:bg-slate-800
            rounded-lg shadow-sm
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2
            cursor-pointer shrink-0
          "
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* 2. Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Categories
            </p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {data?.categories.length || 0}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Products Linked
            </p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {totalProductsCount}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Avg Products / Category
            </p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {totalProductsCount}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Table Wrapper with Custom Header Filter Toolbar */}
      <DataTable<ICategory>
        records={data?.categories || []}
        columns={getCategoryColumns({
          onEdit: handleOpenEditModal,
          onDelete: handleDeleteCategory,
        })}
        meta={data?.meta}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
        getRowKey={(record: ICategory) => record.id}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyState={{
          icon: <FolderTree className="w-7 h-7" />,
          title: 'No categories found',
          description:
            'Get started by creating a new category for your inventory items.',
        }}
        header={
          <div className="p-4 border-b border-slate-200/60 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <label htmlFor="category-search" className="sr-only">
                Search Categories
              </label>
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="category-search"
                type="search"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-9 pr-3 py-1.5
                  text-xs font-normal text-slate-800
                  placeholder:text-slate-400
                  bg-slate-50/50 border border-slate-200
                  rounded-lg outline-none
                  focus:bg-white focus:ring-2 focus:ring-slate-300 focus:border-slate-300
                  transition-all
                "
              />
            </div>

            {/* Sorting & Filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5 bg-slate-50/50 border border-slate-200 rounded-lg p-1">
                <span className="text-xs text-slate-500 pl-2 font-medium flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Sort by:
                </span>
                <select
                  aria-label="Select sort field"
                  value={selectedSort}
                  onChange={(e) =>
                    setSelectedSort(e.target.value as CategorySortField)
                  }
                  className="bg-transparent text-xs text-slate-700 font-medium outline-none cursor-pointer pr-1"
                >
                  <option value="name">Name</option>
                  <option value="createdAt">Date Created</option>
                  <option value="updatedAt">Date Updated</option>
                </select>
                <button
                  type="button"
                  onClick={toggleSortOrder}
                  aria-label={`Sort direction ${sortOrder}`}
                  className="p-1 hover:bg-slate-200/60 rounded text-slate-600 transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        }
      />

      {/* 4. Add/Edit Dialog Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2
                id="modal-title"
                className="text-base font-semibold text-slate-800"
              >
                {selectedCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(false);
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label
                  htmlFor="cat-name"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="cat-name"
                  type="text"
                  required
                  defaultValue={selectedCategory?.name || ''}
                  placeholder="e.g. Hardware & Machinery"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
                />
              </div>

              <div>
                <label
                  htmlFor="cat-desc"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="cat-desc"
                  rows={3}
                  defaultValue={selectedCategory?.description || ''}
                  placeholder="Optional context about what belongs in this category..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {selectedCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
