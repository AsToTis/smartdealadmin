import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ShopApprovals from './pages/ShopApprovals';
import Users from './pages/Users';
import Shops from './pages/Shops';
import Tickets from './pages/Tickets';
import Withdrawals from './pages/Withdrawals';
import Banners from './pages/Banners';
import Settings from './pages/Settings';
import Riders from './pages/Riders';
import RiderApprovals from './pages/RiderApprovals';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.DEV ? '/' : '/244/'}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="approvals" element={<ShopApprovals />} />
          <Route path="users" element={<Users />} />
          <Route path="shops" element={<Shops />} />
          <Route path="riders" element={<Riders />} />
          <Route path="rider-approvals" element={<RiderApprovals />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="banners" element={<Banners />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
