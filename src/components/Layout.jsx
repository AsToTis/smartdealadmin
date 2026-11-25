import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { getAdmin } from '../lib/adminSession';

const Layout = () => {
  if (!getAdmin()) return <Navigate to="/login" replace />;
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
