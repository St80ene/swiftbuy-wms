import { InventoryProvider } from './context/InventoryContextProvider';
import DashboardContent from './pages/DashboardContent';

export default function App() {
  return (
    <InventoryProvider>
      <DashboardContent />
    </InventoryProvider>
  );
}
