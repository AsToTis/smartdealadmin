import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, Clock, Banknote, Image as ImageIcon, Eye, X, AlertCircle, Search } from 'lucide-react';

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/withdrawals');
      if (Array.isArray(response.data)) {
        setWithdrawals(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setWithdrawals(response.data.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        setWithdrawals(response.data.results);
      } else {
        setWithdrawals([]);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm('คุณต้องการยืนยันว่าทำการโอนเงินสำเร็จแล้วใช่หรือไม่?')) {
      try {
        await axios.post(`http://localhost:5000/api/admin/withdrawals/${id}/approve`);
        fetchWithdrawals();
      } catch (error) {
        console.error('Error approving withdrawal:', error);
        alert('เกิดข้อผิดพลาดในการยืนยัน');
      }
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('กรุณาระบุเหตุผลที่ปฏิเสธการถอนเงิน:');
    if (reason === null) return; // User cancelled
    if (reason.trim() === '') {
      alert('ต้องระบุเหตุผลในการปฏิเสธ');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/admin/withdrawals/${id}/reject`, { reason });
      fetchWithdrawals();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      alert('เกิดข้อผิดพลาดในการปฏิเสธ');
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">จัดการการถอนเงิน</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">วันที่ขอถอน</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">ชื่อร้านค้า</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">ข้อมูลบัญชีธนาคาร</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right whitespace-nowrap">จำนวนเงิน (฿)</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-center whitespace-nowrap">สถานะ</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : withdrawals.length > 0 ? (
                withdrawals.map((item) => (
                  <tr key={item.withdrawal_id || item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{new Date(item.created_at).toLocaleString('th-TH')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{item.shop_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div 
                          className="w-12 h-12 bg-slate-100 rounded border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
                          onClick={() => {
                            const url = item.bookbank_image ? `http://localhost:5000${item.bookbank_image}` : 'https://placehold.co/800x800/f1f5f9/94a3b8?text=No+Image';
                            window.open(url, '_blank');
                          }}
                          title="คลิกเพื่อดูรูปขนาดเต็ม"
                        >
                          <img 
                            src={item.bookbank_image ? `http://localhost:5000${item.bookbank_image}` : 'https://placehold.co/150x150/f1f5f9/94a3b8?text=No+Image'} 
                            alt="Bookbank" 
                            className="w-full h-full object-cover" 
                            onError={(e) => { 
                              e.target.onerror = null; 
                              e.target.src = 'https://placehold.co/150x150/f1f5f9/94a3b8?text=No+Image'; 
                            }} 
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{item.bank_name || '-'}</div>
                          <div className="text-sm text-slate-500 font-mono mt-0.5">{item.bank_account || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-900 text-lg flex items-center justify-end">
                        <Banknote className="w-5 h-5 text-emerald-500 mr-1.5" />
                        {Number(item.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setSelectedWithdrawal(item); setIsModalOpen(true); }}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-bold transition-all shadow-sm"
                      >
                        <Search className="w-4 h-4" />
                        <span>ตรวจสอบและโอนเงิน</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Banknote className="w-12 h-12 text-slate-300 mb-3" />
                      <p>ไม่มีคำขอถอนเงินที่รอการอนุมัติ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">ตรวจสอบคำขอถอนเงิน</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Part 1: ข้อมูลผู้รับเงิน */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> ข้อมูลผู้รับเงิน</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">ชื่อร้านค้า</div>
                    <div className="font-semibold text-slate-900 text-lg">{selectedWithdrawal.shop_name}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">ชื่อเจ้าของร้าน</div>
                    <div className="font-semibold text-slate-900 text-lg">{selectedWithdrawal.owner_name || '-'}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">เบอร์โทรศัพท์</div>
                    <div className="font-semibold text-slate-900 text-lg">{selectedWithdrawal.owner_phone || '-'}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">ธนาคาร</div>
                    <div className="font-semibold text-slate-900 text-lg">{selectedWithdrawal.bank_name || '-'}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2">
                    <div className="text-sm text-slate-500 mb-1">เลขบัญชี</div>
                    <div className="font-mono font-bold text-slate-900 text-2xl tracking-widest">{selectedWithdrawal.bank_account || '-'}</div>
                  </div>
                </div>
              </div>

              {/* Part 2: สรุปยอดเงิน */}
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 flex flex-col items-center justify-center text-center">
                 <div className="text-amber-800 font-medium mb-2">จำนวนเงินที่ขอถอน</div>
                 <div className="text-4xl font-black text-rose-600 mb-3">
                   ฿{Number(selectedWithdrawal.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                 </div>
                 <div className="text-sm text-slate-600 bg-white/60 px-4 py-2 rounded-full border border-white/80">
                   ยอดเงินคงเหลือในกระเป๋าหลังถอน: <span className="font-bold">฿{Number(selectedWithdrawal.current_balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                 </div>
              </div>

              {/* Part 3: หลักฐานบัญชี */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">หลักฐานสมุดบัญชี (Bookbank)</h3>
                <div 
                  className="w-full h-64 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors relative group"
                  onClick={() => {
                    const url = selectedWithdrawal.bookbank_image && selectedWithdrawal.bookbank_image !== 'null' ? `http://localhost:5000${selectedWithdrawal.bookbank_image}` : 'https://placehold.co/800x800/f1f5f9/94a3b8?text=No+Image';
                    window.open(url, '_blank');
                  }}
                >
                   <img 
                      src={selectedWithdrawal.bookbank_image && selectedWithdrawal.bookbank_image !== 'null' ? `http://localhost:5000${selectedWithdrawal.bookbank_image}` : 'https://placehold.co/800x800/f1f5f9/94a3b8?text=No+Image'} 
                      alt="Bookbank" 
                      className="w-full h-full object-contain" 
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://placehold.co/800x800/f1f5f9/94a3b8?text=No+Image'; 
                      }} 
                    />
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium shadow-sm flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>คลิกเพื่อดูรูปขนาดใหญ่</span>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                ยกเลิก / ปิดหน้าต่าง
              </button>
              <button 
                onClick={() => handleReject(selectedWithdrawal.withdrawal_id || selectedWithdrawal.id)}
                className="px-5 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors shadow-sm shadow-rose-200"
              >
                ปฏิเสธการถอนเงิน (Reject)
              </button>
              <button 
                onClick={() => {
                  handleApprove(selectedWithdrawal.withdrawal_id || selectedWithdrawal.id);
                  setIsModalOpen(false);
                }}
                className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm shadow-emerald-200"
              >
                ยืนยัน โอนเงินสำเร็จแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdrawals;