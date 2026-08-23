import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';

import { Products } from './components/Products';
import { Dashboard } from './components/Dashboard';
// import ProductDetailsPage from './features/products/pages/ProductDetailsPage';
// import StocksPage from './features/stocks/pages/StocksPage';
// import PurchaseOrdersPage from './features/purchase-orders/pages/PurchaseOrdersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Products */}
          <Route path="/products" element={<Products />} />

          {/* Product details */}
          {/* 
          <Route
            path="/products/:productId"
            element={<ProductDetailsPage />}
          />
          */}

          {/* Stocks */}
          {/* <Route path="/stocks" element={<StocksPage />} /> */}

          {/* Purchase Orders */}
          {/* 
          <Route
            path="/purchase-orders"
            element={<PurchaseOrdersPage />}
          />
          */}

          {/* Default */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
