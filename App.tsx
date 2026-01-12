
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import AppLayout from './components/Layout';

// Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Sales = lazy(() => import('./pages/Sales'));
const NewSale = lazy(() => import('./pages/NewSale'));
const InvoiceView = lazy(() => import('./pages/InvoiceView'));
const Purchases = lazy(() => import('./pages/Purchases'));
const Settings = lazy(() => import('./pages/Settings'));
const Reports = lazy(() => import('./pages/Reports'));

// Loading Placeholder
const Loading = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 font-orbitron text-xs font-bold text-cyan-500 animate-pulse tracking-widest uppercase">Initializing Interface...</p>
  </div>
);

// Stub pages for demonstration with theme awareness
const Placeholder = ({ title }: { title: string }) => {
  const { state } = useStore();
  const isDark = state.settings.theme === 'dark';
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className={`text-4xl font-orbitron font-bold mb-4 opacity-50 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      <p className="text-slate-500 max-w-md">This module is currently being calibrated in the development sector. Check back in the next cycle.</p>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <AppLayout>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/sales/new" element={<NewSale />} />
              <Route path="/sales/:id" element={<InvoiceView />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="/purchases/new" element={<Placeholder title="Restock Engine" />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </Router>
    </StoreProvider>
  );
};

export default App;
