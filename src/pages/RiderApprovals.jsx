import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, User, Bike, FileText } from 'lucide-react';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const normalizedPath = path.replace(/\\/g, '/');
  return `${import.meta.env.VITE_API_URL}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
};

const ImageDisplay = ({ path, alt, defaultIcon, emptyText }) => {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getImageUrl(path);

  if (!imageUrl) {
    return (
      <div className="w-full h-48 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-400">
        <span className="material-symbols-outlined text-4xl mb-2">{defaultIcon}</span>
        <span className="text-sm">{emptyText}</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full h-48 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-red-400">
        <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
        <span className="text-sm">ไม่พบรูปภาพ</span>
      </div>
    );
  }

  return (
    <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-100 hover:opacity-90 transition-opacity cursor-pointer h-48 flex items-center justify-center">
      <img 
        src={imageUrl} 
        alt={alt} 
        className="max-w-full max-h-full object-contain"
        onError={() => setHasError(true)}
      />
    </a>
  );
};

const RiderApprovals = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRider, setSelectedRider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRiders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/riders/pending`);
      console.log('API Response (RiderApprovals):', response.data);
      if (Array.isArray(response.data)) {
        setRiders(response.data);
      } else if (response.data && Array.isArray(response.data.riders)) {
        setRiders(response.data.riders);
      } else if (response.data && Array.isArray(response.data.results)) {
        setRiders(response.data.results);
      } else {
        setRiders([]);
      }
    } catch (error) {
      console.error('Error fetching pending riders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const handleApprove = async () => {
    if (!selectedRider) return;
    try {
      const riderId = selectedRider.id || selectedRider.rider_id;
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/riders/${riderId}/approve`);
      fetchRiders();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error approving rider:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedRider) return;
    const reason = window.prompt('กรุณาระบุเหตุผลที่ปฏิเสธการสมัคร:');
    if (reason !== null) {
      if (!reason.trim()) {
        alert('กรุณาระบุเหตุผลที่ปฏิเสธ');
        return;
      }
      try {
        const riderId = selectedRider.id || selectedRider.rider_id;
        await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/riders/${riderId}/reject`, { reason });
        fetchRiders();
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error rejecting rider:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">อนุมัติพนักงานส่งของ</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-medium text-slate-500">รหัสผู้สมัคร</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">ชื่อผู้สมัคร</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">วันที่สมัคร</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : riders.length > 0 ? (
                riders.map((rider) => (
                  <tr key={rider.id || rider.rider_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{rider.id || rider.rider_id}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {rider.real_name || rider.first_name + ' ' + rider.last_name || rider.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {rider.created_at ? new Date(rider.created_at).toLocaleDateString('th-TH') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => {
                            setSelectedRider(rider);
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
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">ไม่มีคำขอสมัครพนักงานส่งของ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-slate-800">ตรวจสอบข้อมูลผู้สมัครพนักงานส่งของ</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Section 1: ข้อมูลส่วนตัว */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center border-b border-slate-100 pb-2">
                    <User className="w-5 h-5 mr-2 text-blue-500" /> ข้อมูลส่วนตัว
                  </h3>
                  <div>
                    <span className="text-slate-500 text-sm">ชื่อ-นามสกุล:</span> 
                    <p className="font-medium text-slate-900 text-base">
                      {selectedRider.real_name || selectedRider.first_name + ' ' + selectedRider.last_name || selectedRider.name || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-sm">เบอร์โทรศัพท์:</span> 
                    <p className="font-medium text-slate-900">{selectedRider.phone || selectedRider.phone_number || '-'}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500 text-sm block mb-2">รูปถ่ายบัตรประชาชน:</span>
                    <ImageDisplay 
                      path={selectedRider.id_card_image || selectedRider.idCardImage}
                      alt="ID Card"
                      defaultIcon="badge"
                      emptyText="ไม่ได้อัปโหลดเอกสาร"
                    />
                  </div>
                </div>

                {/* Section 2: ข้อมูลพาหนะ */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center border-b border-slate-100 pb-2">
                    <Bike className="w-5 h-5 mr-2 text-purple-500" /> ข้อมูลพาหนะ
                  </h3>
                  <div>
                    <span className="text-slate-500 text-sm">รายละเอียดรถ (ยี่ห้อ/รุ่น):</span> 
                    <p className="font-medium text-slate-900">{selectedRider.vehicle_type || selectedRider.vehicle_details || selectedRider.vehicleDetails || selectedRider.vehicle_model || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-sm">ทะเบียนรถ:</span> 
                    <p className="font-medium text-slate-900 text-lg">{selectedRider.vehicle_plate || selectedRider.license_plate || selectedRider.licensePlate || '-'}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500 text-sm block mb-2">รูปรถ / เอกสารรถ:</span>
                    <ImageDisplay 
                      path={selectedRider.vehicle_doc_image || selectedRider.vehicle_image || selectedRider.vehicleImage}
                      alt="Vehicle"
                      defaultIcon="two_wheeler"
                      emptyText="ไม่ได้อัปโหลดรูปรถ"
                    />
                  </div>
                </div>

                {/* Section 3: ข้อมูลใบขับขี่ */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center border-b border-slate-100 pb-2">
                    <FileText className="w-5 h-5 mr-2 text-orange-500" /> ข้อมูลใบขับขี่
                  </h3>
                  <div>
                    <span className="text-slate-500 text-sm">เลขที่ใบขับขี่:</span> 
                    <p className="font-medium text-slate-900">{selectedRider.license_number || selectedRider.driver_license_number || selectedRider.driverLicenseNumber || '-'}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 mt-auto">
                    <span className="text-slate-500 text-sm block mb-2">รูปถ่ายใบขับขี่:</span>
                    <ImageDisplay 
                      path={selectedRider.license_image || selectedRider.driver_license_image || selectedRider.driverLicenseImage || selectedRider.document_image}
                      alt="Driver License"
                      defaultIcon="id_card"
                      emptyText="ไม่ได้อัปโหลดเอกสาร"
                    />
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
                    ปฏิเสธการสมัคร
                  </button>
                  <button 
                    onClick={handleApprove}
                    className="px-6 py-3 text-sm font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-sm shadow-green-200 transition-all"
                  >
                    อนุมัติเป็นพนักงานส่งของ
                  </button>
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default RiderApprovals;
