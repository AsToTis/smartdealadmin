import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import ShopApprovals from './pages/ShopApprovals';
import Users from './pages/Users';
import Shops from './pages/Shops';

import Withdrawals from './pages/Withdrawals';
import Refunds from './pages/Refunds';
import Banners from './pages/Banners';
import Settings from './pages/Settings';
import Riders from './pages/Riders';
import RiderApprovals from './pages/RiderApprovals';
import Complaints from './pages/Complaints';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.DEV ? '/' : '/244/'}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="approvals" element={<ShopApprovals />} />
          <Route path="users" element={<Users />} />
          <Route path="shops" element={<Shops />} />
          <Route path="riders" element={<Riders />} />
          <Route path="rider-approvals" element={<RiderApprovals />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="refunds" element={<Refunds />} />

          <Route path="complaints" element={<Complaints />} />
          <Route path="banners" element={<Banners />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
