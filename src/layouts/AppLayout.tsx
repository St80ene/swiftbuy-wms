// src/layouts/AppLayout.tsx

import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
