import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, X, MessageSquareWarning, Package } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/complaints`);
      const data = response.data.results || response.data;
      if (Array.isArray(data)) {
        const sortedData = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setComplaints(sortedData);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('ไม่สามารถโหลดข้อมูลเรื่องร้องเรียนได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const updateComplaintStatus = async (newStatus) => {
    if (!selectedComplaint) return;
    setIsUpdating(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/complaints/${selectedComplaint.id}/status`, {
        status: newStatus
      });
      
      toast.success('อัปเดตสถานะสำเร็จ');
      
      // Update local state
      setComplaints(complaints.map(c => 
        c.id === selectedComplaint.id ? { ...c, status: newStatus } : c
      ));
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
      
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const term = search.toLowerCase();
    const matchesSearch = (
      (complaint.subject && complaint.subject.toLowerCase().includes(term)) ||
      (complaint.user_name && complaint.user_name.toLowerCase().includes(term)) ||
      (complaint.order_id && complaint.order_id.toString().includes(term))
    );
    const matchesFilter = filterStatus === 'all' || complaint.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'resolved': return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-700 border border-green-200">แก้ไขแล้ว (Resolved)</span>;
      case 'in_progress': return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">กำลังดำเนินการ (In Progress)</span>;
      default: return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">รอดำเนินการ (Pending)</span>;
    }
  };

  return (
    <div className="space-y-6 w-full pb-10 relative">
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquareWarning className="w-6 h-6 text-primary-600" />
          ศูนย์ช่วยเหลือ / เรื่องร้องเรียน
        </h1>
        <div className="text-sm text-slate-500 font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          ทั้งหมด {filteredComplaints.length} รายการ
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filterStatus === 'all' ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              ทั้งหมด
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filterStatus === 'pending' ? 'bg-orange-50 border border-orange-300 text-orange-700 shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              รอดำเนินการ
            </button>
            <button 
              onClick={() => setFilterStatus('in_progress')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filterStatus === 'in_progress' ? 'bg-blue-50 border border-blue-300 text-blue-700 shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              กำลังตรวจสอบ
            </button>
            <button 
              onClick={() => setFilterStatus('resolved')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filterStatus === 'resolved' ? 'bg-green-50 border border-green-300 text-green-700 shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              แก้ไขแล้ว
            </button>
          </div>
          <div className="relative max-w-md w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อผู้ใช้, หัวข้อ, หรือรหัสออเดอร์..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">วันที่แจ้ง</th>
                <th className="px-6 py-4 whitespace-nowrap">ข้อมูลผู้ร้องเรียน</th>
                <th className="px-6 py-4">หัวข้อ (Subject)</th>
                <th className="px-6 py-4 whitespace-nowrap">สถานะ</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                      <p>กำลังโหลดข้อมูล...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <MessageSquareWarning className="w-12 h-12 mb-3 text-slate-300" />
                      <p>ไม่พบข้อมูลเรื่องร้องเรียน</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {formatDate(complaint.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{complaint.user_name || 'ไม่ระบุชื่อ'}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{complaint.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 line-clamp-1">{complaint.subject}</div>
                      {complaint.order_id && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                            <Package className="w-3 h-3" />
                            แจ้งปัญหาจากออเดอร์ #{complaint.order_id}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(complaint.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => openComplaintDetails(complaint)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 hover:border-primary-300 transition-all shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">รายละเอียดเรื่องร้องเรียน</h2>
                <p className="text-sm text-slate-500 mt-1">
                  รหัสอ้างอิง: #{selectedComplaint.id} • {formatDate(selectedComplaint.created_at)}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                
                {selectedComplaint.order_id && (
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-start gap-3">
                    <Package className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-purple-900">ปัญหาเกี่ยวกับออเดอร์</h4>
                      <p className="text-sm text-purple-700 mt-1">ผู้ใช้แจ้งปัญหาที่เกี่ยวข้องกับออเดอร์หมายเลข <strong>#{selectedComplaint.order_id}</strong></p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500 font-medium mb-1">ข้อมูลผู้ติดต่อ</div>
                    <div className="font-semibold text-slate-900">{selectedComplaint.user_name || 'ไม่ระบุชื่อ'}</div>
                    <div className="text-sm text-slate-600 mt-1">{selectedComplaint.email || '-'}</div>
                    <div className="text-sm text-slate-600">{selectedComplaint.phone || '-'}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center items-start">
                    <div className="text-xs text-slate-500 font-medium mb-2">สถานะปัจจุบัน</div>
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">หัวข้อ: {selectedComplaint.subject}</h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                    {selectedComplaint.message}
                  </div>
                </div>

                {selectedComplaint.image_url && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">รูปภาพประกอบ</h3>
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img 
                        src={selectedComplaint.image_url} 
                        alt="รูปภาพประกอบเรื่องร้องเรียน" 
                        className="w-full h-auto object-contain max-h-[300px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 p-6 bg-slate-50 rounded-b-2xl flex items-center justify-between">
              <div className="text-sm text-slate-500">
                จัดการสถานะของเรื่องร้องเรียน
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => updateComplaintStatus('in_progress')}
                  disabled={isUpdating || selectedComplaint.status === 'in_progress'}
                  className="px-4 py-2 rounded-lg font-medium text-sm text-blue-700 bg-blue-100 border border-blue-200 hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  กำลังดำเนินการ
                </button>
                <button
                  onClick={() => updateComplaintStatus('resolved')}
                  disabled={isUpdating || selectedComplaint.status === 'resolved'}
                  className="px-4 py-2 rounded-lg font-medium text-sm text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  แก้ไขแล้ว
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Complaints;
