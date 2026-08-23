import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  ImageIcon,
  DollarSign,
  TrendingUp,
  Tag,
  Clock,
  Edit,
  MoreVertical,
  History,
  Layers,
  Building2,
  Box,
} from 'lucide-react';
import { productService } from '../../services/products';
import { LoadingScreen } from '../Error/LoadingScreen';
import type { Product } from '../entities/product';
import EditProductModal from './modals/EditProduct';

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { productId } = useParams<{ productId: string }>();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'relationships' | 'history'
  >('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading, isError, error } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductByID(productId!),
    enabled: Boolean(productId),
  });

  const product = data;

  const updateProductMutation = useMutation({
    mutationFn: async (updatedProduct: FormData) => {
      return await productService.updateProduct(productId!, updatedProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      console.error('Failed to update product:', error);
    },
  });

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} | Product Details`;
    } else {
      document.title = 'Product Details';
    }
  }, [product]);

  if (isLoading) return <LoadingScreen />;

  if (isError || !product) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          {isError ? 'Error Loading Product' : 'Product Not Found'}
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          {error instanceof Error
            ? error.message
            : 'The requested product could not be located or loaded.'}
        </p>
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>
      </div>
    );
  }

  const profitMargin = product.selling_price - product.cost_price;
  const marginPercentage =
    product.selling_price > 0
      ? ((profitMargin / product.selling_price) * 100).toFixed(1)
      : '0';

  const isOut = product.stock_quantity <= 0;
  const isLow =
    product.is_low_stock === true ||
    product.stock_quantity <= product.reorder_level;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to products"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {product.name}
              </h1>
              {isOut ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Out of Stock
                </span>
              ) : isLow ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Low Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  In Stock
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              ID: {product.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Edit className="w-4 h-4 text-slate-500" />
            Edit Product
          </button>
          <button
            type="button"
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Stock Quantity</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {product.stock_quantity}{' '}
              <span className="text-xs text-slate-400 font-normal">
                {product.uom_display_name}
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Reorder Level: {product.reorder_level}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Cost Price</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              ${product.cost_price.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Base procurement cost
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Selling Price</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              ${product.selling_price.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Retail unit price</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Gross Margin</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              ${profitMargin.toFixed(2)}{' '}
              <span className="text-xs text-emerald-700 font-medium">
                ({marginPercentage}%)
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Unit profit yield</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6 -mb-px">
          {[
            { id: 'overview', label: 'Overview', icon: Package },
            {
              id: 'relationships',
              label: 'Relationships & Supply',
              icon: Building2,
            },
            { id: 'history', label: 'Audit History', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Product Images
                </h3>
                {product.images && product.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {product.images?.map((imgObj, index) => {
                      return (
                        <div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                        >
                          <img
                            src={imgObj.url} // Updated from '' to url
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-44 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-medium">No media uploaded</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Product images will appear here
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Description
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.description ||
                    'No detailed description provided for this item.'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-500" />
                  Unit & Measurements
                </h3>
                <dl className="divide-y divide-slate-100 text-sm">
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Unit Type</dt>
                    <dd className="font-medium text-slate-900">
                      {product.uom_type}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Base UOM</dt>
                    <dd className="font-medium text-slate-900">
                      {product.uom_base_name}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Display UOM</dt>
                    <dd className="font-medium text-slate-900">
                      {product.uom_display_name}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  Timestamps
                </h3>
                <dl className="divide-y divide-slate-100 text-sm">
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Created</dt>
                    <dd className="font-medium text-slate-700">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Last Updated</dt>
                    <dd className="font-medium text-slate-700">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'relationships' && (
          <motion.div
            key="relationships"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-8 border border-dashed border-slate-300 rounded-xl bg-white text-center"
          >
            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-900">
              Relational Entities
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Connect this product with Suppliers, Purchase Orders, Warehouses,
              and Categories.
            </p>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-8 border border-dashed border-slate-300 rounded-xl bg-white text-center"
          >
            <History className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-900">
              Stock & Price Audit Logs
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Historical activity for stock adjustments, price changes, and
              order allocations.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <EditProductModal
          product={product}
          isSubmitting={isSubmitting}
          setIsModalOpen={setIsEditModalOpen}
          onSubmit={async (updatedProduct) => {
            // Guard clause: do nothing if request is already in-flight
            if (updateProductMutation.isPending) return;

            updateProductMutation.mutate(updatedProduct);
          }}
        />
      )}
    </div>
  );
}
