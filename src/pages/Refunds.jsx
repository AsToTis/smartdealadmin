import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Use environment variables for dynamic routing
const BASE_URL = `${import.meta.env.VITE_API_URL}/api`; 
const UPLOADS_URL = `${import.meta.env.VITE_API_URL}/uploads`;

export default function Refunds() {
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/refunds`);
      if (res.data.success) {
        setRefunds(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    if(!window.confirm(`ต้องการเปลี่ยนสถานะเป็น ${status} หรือไม่?`)) return;
    try {
      await axios.put(`${BASE_URL}/admin/refund-status/${id}`, { status });
      fetchRefunds();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm m-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">จัดการการคืนเงิน (ออเดอร์ยกเลิกอัตโนมัติ)</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="p-3 border-b">รหัส Order</th>
              <th className="p-3 border-b">ลูกค้า</th>
              <th className="p-3 border-b">ยอดเงินคืน</th>
              <th className="p-3 border-b">บัญชีลูกค้า</th>
              <th className="p-3 border-b">หลักฐาน (สลิป)</th>
              <th className="p-3 border-b">สถานะ</th>
              <th className="p-3 border-b">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {refunds.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">ไม่มีรายการขอคืนเงิน</td>
              </tr>
            ) : (
              refunds.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3 font-semibold text-gray-700">#{r.order_id}</td>
                  <td className="p-3">
                    <p className="font-medium">{r.full_name}</p>
                    <p className="text-sm text-gray-500">{r.phone_number}</p>
                  </td>
                  <td className="p-3 text-red-500 font-bold">{Number(r.amount).toLocaleString()} ฿</td>
                  <td className="p-3 text-sm">
                    <p><span className="font-semibold">ธนาคาร:</span> {r.bank_name}</p>
                    <p><span className="font-semibold">เลขบัญชี:</span> {r.account_number}</p>
                    <p><span className="font-semibold">ชื่อบัญชี:</span> {r.account_name}</p>
                  </td>
                  <td className="p-3">
                    {r.slip_image ? (
                       <a 
                         href={`${UPLOADS_URL}/${r.slip_image}`} 
                         target="_blank" 
                         rel="noreferrer"
                         className="text-blue-600 underline hover:text-blue-800"
                       >
                         ดูรูปสลิป
                       </a>
                    ) : (
                      <span className="text-gray-400">ไม่มีรูป</span>
                    )}
                  </td>
                  <td className="p-3">
                    {r.status === 'pending' && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">รอตรวจสอบ</span>}
                    {r.status === 'approved' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">คืนเงินแล้ว</span>}
                    {r.status === 'rejected' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">ปฏิเสธ</span>}
                  </td>
                  <td className="p-3">
                    {r.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateStatus(r.id, 'approved')} 
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          อนุมัติคืนเงิน
                        </button>
                        <button 
                          onClick={() => updateStatus(r.id, 'rejected')} 
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
