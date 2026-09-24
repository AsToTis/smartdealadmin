import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  StoreIcon, 
  MessageSquareWarning, 
  Settings,
  Wallet,
  Megaphone,
  Bike
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
    { name: 'ภาพรวม', path: '/', icon: LayoutDashboard },
    { name: 'จัดการผู้ใช้', path: '/users', icon: Users },
    { name: 'จัดการร้านค้า', path: '/shops', icon: Store },
    { name: 'จัดการพนักงานส่งของ', path: '/riders', icon: Bike },
    { name: 'อนุมัติพนักงานส่งของ', path: '/rider-approvals', icon: Bike },
    { name: 'อนุมัติร้านใหม่', path: '/approvals', icon: StoreIcon },
    { name: 'คำขอถอนเงิน', path: '/withdrawals', icon: Wallet },
    { name: 'เรื่องร้องเรียน', path: '/tickets', icon: MessageSquareWarning },
    { name: 'จัดการแบนเนอร์', path: '/banners', icon: Megaphone },
    { name: 'ตั้งค่าระบบ', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-primary-600">Smart Deal</h1>
        <span className="ml-2 text-xs font-medium text-slate-400 mt-1">ADMIN</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
        Smart Deal Admin v1.0
      </div>
    </div>
  );
};

export default Sidebar;
