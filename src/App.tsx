import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';

import { Products } from './components/Products';
import { Dashboard } from './components/Dashboard';
import ProductDetails from './components/Products/ProductDetails';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Products */}
            <Route path="/products" element={<Products />} />

            {/* Product details */}
            <Route path="/products/:productId" element={<ProductDetails />} />

            {/* Default */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
