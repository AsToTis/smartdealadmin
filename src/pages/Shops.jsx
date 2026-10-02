import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Star, X, ShoppingBag, DollarSign, Package, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const normalizedPath = path.replace(/\\/g, '/');
  return `${import.meta.env.VITE_API_URL}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
};

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [shopInsights, setShopInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchShops = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/shops`);
      if (Array.isArray(response.data)) {
        setShops(response.data);
      } else if (response.data && Array.isArray(response.data.shops)) {
        setShops(response.data.shops);
      } else if (response.data && Array.isArray(response.data.results)) {
        setShops(response.data.results);
      } else {
        setShops([]);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleViewShop = async (shopId) => {
    setSelectedShopId(shopId);
    setIsPanelOpen(true);
    setLoadingInsights(true);
    setShopInsights(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/shops/${shopId}/insights`);
      setShopInsights(response.data);
    } catch (error) {
      console.error('Error fetching shop insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleSuspendShop = async () => {
    if (!shopInsights) return;
    if (window.confirm(`คุณต้องการระงับการใช้งานร้านค้า ${shopInsights.shop.shop_name} ใช่หรือไม่?`)) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/shops/${selectedShopId}/suspend`);
        alert('ระงับการใช้งานร้านค้าเรียบร้อยแล้ว');
        setIsPanelOpen(false);
        fetchShops();
      } catch (error) {
        console.error('Error suspending shop:', error);
        alert('ไม่สามารถระงับการใช้งานได้');
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">จัดการร้านค้า</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-medium text-slate-500">ชื่อร้าน</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">จำนวนสินค้า</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">เรตติ้ง</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">สถานะ</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : shops.length > 0 ? (
                shops.map((shop) => (
                  <tr key={shop.shop_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{shop.name}</div>
                      <div className="text-slate-500 text-xs truncate max-w-[250px]">{shop.address}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{shop.product_count || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{shop.rating || '0.0'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${shop.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {shop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleViewShop(shop.shop_id)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>ดูรายละเอียด</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">ไม่มีร้านค้าในระบบ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full-Screen Panel View Shop Details */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsPanelOpen(false)} />
          <div className="relative w-[95vw] max-w-7xl h-[95vh] bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              
              {/* Header */}
              <div className="px-6 py-5 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10 shrink-0">
                <h2 className="text-xl font-bold text-slate-900">ข้อมูลเชิงลึกร้านค้า</h2>
                <button onClick={() => setIsPanelOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body (Grid) */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
                {loadingInsights ? (
                  <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
                    <span className="material-symbols-outlined text-4xl animate-spin mb-4">progress_activity</span>
                    <p>กำลังดึงข้อมูลร้านค้า...</p>
                  </div>
                ) : shopInsights ? (
                  <>
                    {/* Left Column (Profile, KPIs, Action Footer) */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                      {/* Section 1: Profile */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden mb-4">
                            {shopInsights.shop.image_url ? (
                              <img 
                                src={getImageUrl(shopInsights.shop.image_url)} 
                                alt="Shop logo" 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/png?text=No+Image'; }}
                              />
                            ) : (
                              <span className="material-symbols-outlined text-4xl text-slate-400">storefront</span>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 text-center">{shopInsights.shop.shop_name}</h3>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="flex items-center text-amber-500 font-medium text-sm">
                              <Star className="w-4 h-4 fill-current mr-1" />
                              {shopInsights.shop.rating || '0.0'}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${shopInsights.shop.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              {shopInsights.shop.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {shopInsights.shop.description && (
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600">
                            {shopInsights.shop.description}
                          </div>
                        )}

                        <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                          <div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">เจ้าของร้าน</span>
                            <p className="text-sm font-medium text-slate-900">{shopInsights.shop.owner_name}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">ช่องทางติดต่อ</span>
                            <p className="text-sm text-slate-600">{shopInsights.shop.owner_phone || '-'}</p>
                            <p className="text-sm text-slate-600">{shopInsights.shop.owner_email || '-'}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">ที่ตั้งร้านค้า</span>
                            <p className="text-sm text-slate-600 truncate">{shopInsights.shop.address || '-'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: KPIs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <DollarSign className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-500">ยอดขายรวม</span>
                          </div>
                          <div className="text-xl font-bold text-slate-900 mt-auto">฿{Number(shopInsights.kpi.total_revenue).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                              <ShoppingBag className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-500">จำนวนคำสั่งซื้อ</span>
                          </div>
                          <div className="text-xl font-bold text-slate-900 mt-auto">{shopInsights.kpi.total_orders}</div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:col-span-2 lg:col-span-1 xl:col-span-2">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                              <Package className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-500">จำนวนสินค้าทั้งหมด</span>
                          </div>
                          <div className="text-xl font-bold text-slate-900 mt-auto">{shopInsights.products.length}</div>
                        </div>
                      </div>

                      {/* Action Footer */}
                      {shopInsights.shop.status === 'approved' && (
                        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm flex justify-center mt-auto">
                          <button 
                            onClick={handleSuspendShop}
                            className="flex w-full items-center justify-center space-x-2 px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium transition-colors"
                          >
                            <AlertTriangle className="w-4 h-4" />
                            <span>ระงับการใช้งานร้านค้า</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right Column (Chart, Product List) */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                      {/* Section 3: Sales Chart */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-shrink-0">
                        <h3 className="font-bold text-slate-800 text-base mb-6">กราฟยอดขาย 7 วันล่าสุด</h3>
                        <div className="h-64 w-full">
                          {shopInsights.weekly_sales && shopInsights.weekly_sales.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={shopInsights.weekly_sales}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} tickMargin={10} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} width={45} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="total" name="ยอดขาย (฿)" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                              <p className="text-slate-400 text-sm">ไม่มีข้อมูลยอดขายใน 7 วันที่ผ่านมา</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Section 4: Product List */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[300px]">
                        <div className="px-6 py-4 border-b border-slate-200 shrink-0">
                          <h3 className="font-bold text-slate-800 text-base">รายการสินค้า (10 อันดับล่าสุด)</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          {shopInsights.products && shopInsights.products.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                                <tr className="border-b border-slate-200">
                                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-50">สินค้า</th>
                                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right bg-slate-50">ราคา</th>
                                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right bg-slate-50">สต็อก</th>
                                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right bg-slate-50">จัดการ</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {shopInsights.products.map(product => (
                                  <tr key={product.product_id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-md overflow-hidden border border-slate-200 shrink-0">
                                          {product.image_url ? (
                                            <img 
                                              src={getImageUrl(product.image_url)} 
                                              alt={product.name} 
                                              className="w-full h-full object-cover" 
                                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/png?text=No+Image'; }}
                                            />
                                          ) : (
                                            <span className="material-symbols-outlined text-slate-400 flex items-center justify-center h-full w-full">fastfood</span>
                                          )}
                                        </div>
                                        <span className="text-sm font-medium text-slate-800 line-clamp-2">{product.name}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-slate-600 text-right font-medium">฿{Number(product.price).toLocaleString()}</td>
                                    <td className="px-6 py-3 text-sm text-slate-600 text-right">{product.stock}</td>
                                    <td className="px-6 py-3 text-right">
                                      <button 
                                        onClick={() => setSelectedProduct(product)}
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                                      >
                                        <Eye className="w-4 h-4 mr-1" /> ดูรายละเอียด
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="p-8 flex flex-col items-center justify-center text-slate-400 h-full">
                              <Package className="w-10 h-10 mb-2 opacity-50" />
                              <p className="text-sm">ยังไม่มีสินค้าในร้านนี้</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
                    <p>ไม่พบข้อมูลร้านค้า</p>
                  </div>
                )}
              </div>
          </div>
        </div>
      )}

      {/* Product Details Sub-Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-500" /> รายละเอียดสินค้า
              </h3>
              <button onClick={() => setSelectedProduct(null)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  {selectedProduct.image_url ? (
                    <img 
                      src={getImageUrl(selectedProduct.image_url)} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/png?text=No+Image'; }}
                    />
                  ) : (
                    <span className="material-symbols-outlined text-slate-400 flex items-center justify-center h-full w-full text-3xl">fastfood</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-lg leading-tight mb-2">{selectedProduct.name}</h4>
                  <div className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    หมวดหมู่ ID: {selectedProduct.category_id || 'ไม่ได้ระบุ'}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-bold text-slate-700 mb-1">คำอธิบายสินค้า</h5>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {selectedProduct.description || 'ไม่มีคำอธิบาย'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider block mb-1">ราคาปกติ</span>
                    <p className="text-lg font-medium text-slate-400 line-through">฿{Number(selectedProduct.original_price || selectedProduct.price).toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider block mb-1">ราคาลดแล้ว</span>
                    <p className="text-xl font-bold text-emerald-700">฿{Number(selectedProduct.price).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 p-4 rounded-xl">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">วันหมดอายุ</span>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedProduct.expiration_date ? new Date(selectedProduct.expiration_date).toLocaleString('th-TH') : 'ไม่ได้ระบุ'}
                    </p>
                  </div>
                  <div className="border border-slate-100 p-4 rounded-xl">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">สต็อกคงเหลือ</span>
                    <p className="text-sm font-medium text-slate-900">{selectedProduct.stock} ชิ้น</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="px-6 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-medium transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shops;
