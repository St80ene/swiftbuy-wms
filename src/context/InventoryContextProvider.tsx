import React, { createContext, useContext, useState } from 'react';
import type { Product, PurchaseOrder } from '../types';

interface InventoryContextType {
  products: Product[];
  purchaseOrders: PurchaseOrder[];
  currentTab: string;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCurrentTab: (tab: string) => void;
  formatStock: (product: Product) => string;
  approveOrder: (id: string) => void;
  receiveOrder: (id: string) => void;
}

// 1. THE SINGLE SOURCE OF TRUTH CONTEXT
export const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined,
);

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Premium Coffee Beans',
    stock_quantity: 1500,
    reorder_level: 5000,
    is_low_stock: true,
    cost_price: 12.0,
    selling_price: 24.0,
    uom_type: 'WEIGHT',
    uom_base_name: 'g',
    uom_display_name: 'kg',
  },
  {
    id: 'p2',
    name: 'Logitech MX Master 3S',
    stock_quantity: 45,
    reorder_level: 10,
    is_low_stock: false,
    cost_price: 65.0,
    selling_price: 99.0,
    uom_type: 'UNIT',
    uom_base_name: 'pcs',
    uom_display_name: 'pcs',
  },
  {
    id: 'p3',
    name: 'Organic Whole Milk',
    stock_quantity: 8500,
    reorder_level: 10000,
    is_low_stock: true,
    cost_price: 1.1,
    selling_price: 2.5,
    uom_type: 'VOLUME',
    uom_base_name: 'ml',
    uom_display_name: 'L',
  },
];

const initialOrders: PurchaseOrder[] = [
  {
    id: 'po1',
    po_number: 'PO-2026-0001',
    supplier_name: 'Global Beans Distro Inc.',
    status: 'DRAFT',
    total_estimated_cost: 180.0,
    createdAt: '2026-07-13T10:00:00Z',
    items: [
      { product_name: 'Premium Coffee Beans', quantity: 15000, cost: 12.0 },
    ],
  },
  {
    id: 'po2',
    po_number: 'PO-2026-0002',
    supplier_name: 'Logitech Direct WH',
    status: 'APPROVED',
    total_estimated_cost: 3250.0,
    createdAt: '2026-07-11T14:30:00Z',
    items: [
      { product_name: 'Logitech MX Master 3S', quantity: 50, cost: 65.0 },
    ],
  },
];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>(initialOrders);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  const formatStock = (product: Product): string => {
    if (
      (product.uom_type === 'WEIGHT' || product.uom_type === 'VOLUME') &&
      product.stock_quantity >= 1000
    ) {
      return `${(product.stock_quantity / 1000).toFixed(1)} ${product.uom_display_name}`;
    }
    return `${product.stock_quantity} ${product.uom_base_name}`;
  };

  const approveOrder = (id: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: 'APPROVED' } : po)),
    );
  };

  const receiveOrder = (id: string) => {
    const targetOrder = purchaseOrders.find((po) => po.id === id);
    if (!targetOrder) return;

    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: 'RECEIVED' } : po)),
    );
    setProducts((prev) =>
      prev.map((product) => {
        const lineItem = targetOrder.items.find(
          (item) => item.product_name === product.name,
        );
        if (lineItem) {
          const newQty = product.stock_quantity + lineItem.quantity;
          return {
            ...product,
            stock_quantity: newQty,
            is_low_stock: newQty <= product.reorder_level,
          };
        }
        return product;
      }),
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        purchaseOrders,
        currentTab,
        setCurrentTab,
        formatStock,
        setProducts,
        approveOrder,
        receiveOrder,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
