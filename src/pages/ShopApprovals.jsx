import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';

const ShopApprovals = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchShops = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/shops/pending');
      console.log('API Response (ShopApprovals):', response.data);
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
      console.error('Error fetching pending shops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleApprove = async () => {
    if (!selectedShop) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/shops/${selectedShop.shop_id}/approve`);
      fetchShops();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error approving shop:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedShop) return;
    const reason = window.prompt('กรุณาระบุเหตุผลที่ปฏิเสธ:');
    if (reason !== null) {
      if (!reason.trim()) {
        alert('กรุณาระบุเหตุผลที่ปฏิเสธ');
        return;
      }
      try {
        await axios.put(`http://localhost:5000/api/admin/shops/${selectedShop.shop_id}/reject`, { reason });
        fetchShops();
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error rejecting shop:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">อนุมัติร้านใหม่</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-medium text-slate-500">รหัสร้าน</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">ชื่อร้าน</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">ชื่อผู้สมัคร</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">วันที่สมัคร</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right">จัดการ</th>
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
                    <td className="px-6 py-4 font-medium text-slate-900">#{shop.shop_id}</td>
                    <td className="px-6 py-4 text-slate-700">{shop.shop_name || shop.name}</td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{shop.owner_name || shop.username || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {shop.created_at ? new Date(shop.created_at).toLocaleDateString('th-TH') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => {
                            setSelectedShop(shop);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          <span>ตรวจสอบข้อมูล</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">ไม่มีคำขอเปิดร้านใหม่</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-slate-800">ตรวจสอบเอกสารการเปิดร้าน</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column: Shop & Bank Info */}
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center border-b border-slate-100 pb-2">
                      <span className="material-symbols-outlined mr-2 text-blue-500">storefront</span> ข้อมูลร้านค้า
                    </h3>
                    <div className="space-y-3">
                      <div><span className="text-slate-500 text-sm">ชื่อร้าน:</span> <p className="font-medium text-slate-900">{selectedShop.shop_name}</p></div>
                      <div><span className="text-slate-500 text-sm">รายละเอียด:</span> <p className="text-sm text-slate-700">{selectedShop.description || '-'}</p></div>
                      <div><span className="text-slate-500 text-sm">ที่อยู่:</span> <p className="text-sm text-slate-700">{selectedShop.address || '-'}</p></div>
                      {(selectedShop.latitude || selectedShop.longitude) && (
                        <div>
                          <span className="text-slate-500 text-sm">พิกัด (Lat, Lng):</span> 
                          <p className="text-sm text-slate-700 flex items-center">
                            {selectedShop.latitude}, {selectedShop.longitude}
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${selectedShop.latitude},${selectedShop.longitude}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-700 underline text-xs font-medium flex items-center"
                            >
                              <span className="material-symbols-outlined text-xs mr-1">open_in_new</span>เปิดแผนที่
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center border-b border-slate-100 pb-2">
                      <span className="material-symbols-outlined mr-2 text-green-500">account_balance</span> ข้อมูลบัญชีธนาคาร
                    </h3>
                    <div className="space-y-3 mb-4">
                      <div><span className="text-slate-500 text-sm">ธนาคาร:</span> <p className="font-medium text-slate-900">{selectedShop.bank_name || '-'}</p></div>
                      <div><span className="text-slate-500 text-sm">เลขบัญชี:</span> <p className="font-medium text-slate-900">{selectedShop.bank_account || '-'}</p></div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm block mb-2">รูปถ่ายหน้าสมุดบัญชี:</span>
                      {selectedShop.bookbank_image ? (
                        <a href={`http://localhost:5000${selectedShop.bookbank_image}`} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-100 hover:opacity-90 transition-opacity cursor-pointer">
                          <img src={`http://localhost:5000${selectedShop.bookbank_image}`} alt="Bookbank" className="w-full h-auto max-h-48 object-contain" />
                        </a>
                      ) : (
                        <div className="w-full h-32 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined text-3xl mb-1">image_not_supported</span>
                          <span className="text-sm">ไม่ได้อัปโหลดเอกสาร</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Owner & ID Card Info */}
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center border-b border-slate-100 pb-2">
                      <span className="material-symbols-outlined mr-2 text-purple-500">person</span> ข้อมูลผู้สมัคร
                    </h3>
                    <div><span className="text-slate-500 text-sm">ชื่อ-นามสกุล:</span> <p className="font-medium text-slate-900 text-lg">{selectedShop.owner_name}</p></div>
                    {selectedShop.owner_phone && <div><span className="text-slate-500 text-sm">เบอร์โทรศัพท์:</span> <p className="font-medium text-slate-900">{selectedShop.owner_phone}</p></div>}
                    {selectedShop.owner_email && <div><span className="text-slate-500 text-sm">อีเมล:</span> <p className="font-medium text-slate-900">{selectedShop.owner_email}</p></div>}
                    
                    <div className="mt-6">
                      <span className="text-slate-500 text-sm block mb-2">รูปถ่ายบัตรประชาชน:</span>
                      {selectedShop.id_card_image ? (
                        <a href={`http://localhost:5000${selectedShop.id_card_image}`} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-100 hover:opacity-90 transition-opacity cursor-pointer">
                          <img src={`http://localhost:5000${selectedShop.id_card_image}`} alt="ID Card" className="w-full h-auto object-contain max-h-72" />
                        </a>
                      ) : (
                        <div className="w-full h-48 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined text-4xl mb-2">badge</span>
                          <span className="text-sm">ไม่ได้อัปโหลดเอกสาร</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="px-6 py-5 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={handleReject}
                    className="px-6 py-3 text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    ไม่อนุมัติ (Reject)
                  </button>
                  <button 
                    onClick={handleApprove}
                    className="px-6 py-3 text-sm font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-sm shadow-green-200 transition-all"
                  >
                    อนุมัติร้านค้า (Approve)
                  </button>
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ShopApprovals;
