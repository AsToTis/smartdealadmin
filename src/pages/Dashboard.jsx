import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Activity } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <div className="p-2 bg-slate-50 rounded-lg">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
    </div>
    <div className="flex items-baseline space-x-3">
      <h2 className="text-2xl font-bold text-slate-900">{value}</h2>
      {trend === 'up' ? (
        <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trendValue}
        </span>
      ) : trend === 'down' ? (
        <span className="flex items-center text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
          <TrendingDown className="w-3 h-3 mr-1" />
          {trendValue}
        </span>
      ) : null}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesPeriod, setSalesPeriod] = useState('30');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard?period=${salesPeriod}`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [salesPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <p className="text-slate-500 text-lg">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  // Fallback if data is not available
  const data = stats || {
    stats: {
      total_sales: 0,
      total_orders: 0,
      total_users: 0,
      total_shops: 0
    },
    recent_orders: [],
    top_shops: []
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">ภาพรวมระบบ</h1>
        <div className="text-sm text-slate-500">
          อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="ยอดขายรวม" 
          value={`฿${Number(data.stats?.total_sales || 0).toLocaleString()}`} 
          icon={DollarSign} 
        />
        <StatCard 
          title="จำนวนออเดอร์" 
          value={Number(data.stats?.total_orders || 0).toLocaleString()} 
          icon={ShoppingBag} 
        />
        <StatCard 
          title="จำนวนผู้ใช้" 
          value={Number(data.stats?.total_users || 0).toLocaleString()} 
          icon={Users} 
        />
        <StatCard 
          title="จำนวนร้านค้า" 
          value={Number(data.stats?.total_shops || 0).toLocaleString()} 
          icon={Activity} 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">แนวโน้มยอดขาย</h3>
            <select
              value={salesPeriod}
              onChange={(e) => setSalesPeriod(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 p-2 outline-none cursor-pointer"
            >
              <option value="7">7 วันล่าสุด (รายวัน)</option>
              <option value="30">30 วันล่าสุด (รายวัน)</option>
              <option value="365">1 ปีล่าสุด (รายเดือน)</option>
            </select>
          </div>
          <div className="h-80 w-full">
            {data.sales_trend && data.sales_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.sales_trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} tickMargin={10} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-50 rounded-lg">
                <p className="text-slate-400">ไม่พบข้อมูล</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">สัดส่วนตามหมวดหมู่</h3>
          <div className="h-64 w-full">
            {data.category_stats && data.category_stats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.category_stats} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#10b981" label>
                    {data.category_stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-50 rounded-lg">
                <p className="text-slate-400">ไม่พบข้อมูล</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Shops */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">ร้านค้ายอดนิยม 5 อันดับแรก</h3>
            <button onClick={() => navigate('/shops')} className="text-sm text-primary-600 font-medium hover:text-primary-700">ดูทั้งหมด</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-sm font-medium text-slate-500">ร้านค้า</th>
                  <th className="pb-3 text-sm font-medium text-slate-500 text-right">ยอดขายรวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.top_shops?.length > 0 ? data.top_shops.map((shop, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 text-xs font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{shop.shop_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <p className="font-medium text-primary-600">฿{Number(shop.total_sales).toLocaleString()}</p>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="2" className="py-8 text-center text-slate-500">ไม่พบข้อมูล</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">ออเดอร์ล่าสุด</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-sm font-medium text-slate-500">รหัสออเดอร์</th>
                  <th className="pb-3 text-sm font-medium text-slate-500">ร้านค้า</th>
                  <th className="pb-3 text-sm font-medium text-slate-500 text-right">ยอดรวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recent_orders?.length > 0 ? data.recent_orders.map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-medium text-slate-700">#ORD-{order.order_id}</td>
                    <td className="py-3 text-slate-600">{order.shop_name}</td>
                    <td className="py-3 text-right font-medium text-slate-900">฿{Number(order.total_amount).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-slate-500">ไม่พบข้อมูล</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
