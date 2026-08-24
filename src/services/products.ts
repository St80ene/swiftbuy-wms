import type { Product } from '../components/entities/product';
import type {
  ApiResponse,
  GetAllProductsParams,
  ProductsWithMeta,
} from '../interfaces/products';
import { apiClient } from './api';

// Single source of truth for the resource sub-route
const PRODUCTS_RESOURCE = '/products';

// 2. Abstracted product endpoints container module
export const productService = {
  /**
   * Fetches paginated, sorted, and optionally category-filtered products.
   * Leverages Axios config params to build clean URL query strings safely.
   */
  getAllProducts: async (
    params: GetAllProductsParams = {},
  ): Promise<ProductsWithMeta> => {
    const {
      page = 1,
      limit = 10,
      search = '',
      order = 'DESC',

      // sortBy = 'createdAt',
      // order = 'DESC',
      // category,
    } = params;

    const response = await apiClient.get<ApiResponse<ProductsWithMeta>>(
      PRODUCTS_RESOURCE,
      {
        params: {
          page,
          limit,
          search,
          // sortBy,
          order,
          // ...(category && { category }), // Conditionally appends key if filter exists
        },
      },
    );

    return response.data.data;
  },

  /**
   * Fetches a single product record via its unique identifier string.
   */
  getProductByID: async (productId: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `${PRODUCTS_RESOURCE}/${productId}`,
    );
    return response.data.data;
  },

  /**
   * Legacy standalone method to get products by category.
   * Maps internally to the modular getAllProducts configuration function.
   */
  getProductsByCategory: async (
    categoryId: string,
  ): Promise<ProductsWithMeta> => {
    return productService.getAllProducts({ category: categoryId });
  },

  /**
   * Sends a payload blueprint to the backend service to generate a new product asset.
   */
  createProduct: async (productData: FormData): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>(
      PRODUCTS_RESOURCE,
      productData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data.data;
  },

  updateProduct: async (
    productId: string,
    productData: FormData,
  ): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `${PRODUCTS_RESOURCE}/${productId}`,
      productData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data.data;
  },
};

// Backwards-compatibility export wrappers for standard decoupled imports
export const {
  getAllProducts,
  getProductByID,
  getProductsByCategory,
  createProduct,
  updateProduct,
} = productService;
