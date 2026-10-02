import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Bike } from 'lucide-react';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const normalizedPath = path.replace(/\\/g, '/');
  return `${import.meta.env.VITE_API_URL}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
};

const Riders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRider, setSelectedRider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [selectedRiderDetails, setSelectedRiderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchRiders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/riders`);
      console.log('API Response (Riders):', response.data);
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
      console.error('Error fetching riders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const handleViewDetails = async (rider) => {
    setSelectedRider(rider);
    setIsModalOpen(true);
    setDetailsLoading(true);
    setSelectedRiderDetails(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/riders/${rider.id || rider.rider_id}/details`);
      if (response.data.success) {
        setSelectedRiderDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching rider details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">จัดการพนักงานส่งของ</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-medium text-slate-500">รหัส</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">ทะเบียนรถ</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-center">จำนวนงานส่งสำเร็จ</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-center">เรตติ้ง (⭐)</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">สถานะ (Online/Offline)</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : riders.length > 0 ? (
                riders.map((rider) => (
                  <tr key={rider.id || rider.rider_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{rider.id || rider.rider_id}</td>
                    <td className="px-6 py-4 text-slate-700">{rider.real_name || rider.first_name || rider.firstName || rider.name} {rider.last_name || rider.lastName || ''}</td>
                    <td className="px-6 py-4 text-slate-700">{rider.license_plate || rider.licensePlate || '-'}</td>
                    <td className="px-6 py-4 text-center text-slate-700">{rider.total_jobs || 0}</td>
                    <td className="px-6 py-4 text-center text-yellow-500 font-medium">{rider.average_rating ? Number(rider.average_rating).toFixed(1) : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rider.rider_status === 'online' ? 'bg-green-100 text-green-800' : 
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {rider.rider_status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => handleViewDetails(rider)}
                          className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          <span>ดูรายละเอียด</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">ไม่มีข้อมูลพนักงานส่งของ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-sm z-10">
              <h2 className="text-xl font-bold text-slate-800">รายละเอียดพนักงานส่งของ #{selectedRider.id || selectedRider.rider_id}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {detailsLoading ? (
                <div className="flex justify-center items-center h-64 text-slate-500">
                  กำลังโหลดข้อมูล...
                </div>
              ) : selectedRiderDetails ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Section 1 (Left - Profile & Stats) */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center border-b border-slate-100 pb-2">
                        <Bike className="w-5 h-5 mr-2 text-blue-500" /> ข้อมูลทั่วไป
                      </h3>
                      <div className="space-y-3">
                        <div><span className="text-slate-500 text-sm">ชื่อ-นามสกุล:</span> <p className="font-medium text-slate-900">{selectedRiderDetails.profile.real_name || selectedRiderDetails.profile.user_full_name || selectedRiderDetails.profile.name || '-'}</p></div>
                        <div><span className="text-slate-500 text-sm">อีเมล:</span> <p className="text-sm font-medium text-slate-900">{selectedRiderDetails.profile.email || '-'}</p></div>
                        <div><span className="text-slate-500 text-sm">เบอร์โทรศัพท์:</span> <p className="font-medium text-slate-900">{selectedRiderDetails.profile.phone || '-'}</p></div>
                        <div><span className="text-slate-500 text-sm">ทะเบียนรถ:</span> <p className="font-medium text-slate-900">{selectedRiderDetails.profile.license_plate || '-'}</p></div>
                        <div><span className="text-slate-500 text-sm">สถานะ:</span> 
                          <p className={`font-medium ${selectedRiderDetails.profile.rider_status === 'online' ? 'text-green-600' : 'text-slate-600'}`}>
                            {selectedRiderDetails.profile.rider_status === 'online' ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium mb-1">จำนวนงานส่งสำเร็จ</p>
                        <p className="text-2xl font-bold text-blue-700">{selectedRiderDetails.stats?.total_jobs || 0}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <p className="text-xs text-green-600 font-medium mb-1">รายได้รวม (บาท)</p>
                        <p className="text-2xl font-bold text-green-700">{selectedRiderDetails.stats?.total_earnings?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-800 text-md mb-3 border-b border-slate-100 pb-2">รูปยานพาหนะ / ใบขับขี่</h3>
                      <div className="space-y-4 mt-4">
                        {selectedRiderDetails.profile.vehicle_image || selectedRiderDetails.profile.vehicleImage ? (
                          <a href={getImageUrl(selectedRiderDetails.profile.vehicle_image)} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg border border-slate-200 hover:opacity-90">
                            <img src={getImageUrl(selectedRiderDetails.profile.vehicle_image)} alt="Vehicle" className="w-full h-32 object-contain bg-slate-50" />
                          </a>
                        ) : (
                          <div className="w-full h-32 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                            <span className="material-symbols-outlined mr-2">image_not_supported</span> ไม่มีรูปรถ
                          </div>
                        )}
                        {selectedRiderDetails.profile.driver_license_image || selectedRiderDetails.profile.driverLicenseImage || selectedRiderDetails.profile.document_image ? (
                          <a href={getImageUrl(selectedRiderDetails.profile.driver_license_image || selectedRiderDetails.profile.document_image)} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg border border-slate-200 hover:opacity-90">
                            <img src={getImageUrl(selectedRiderDetails.profile.driver_license_image || selectedRiderDetails.profile.document_image)} alt="License" className="w-full h-32 object-contain bg-slate-50" />
                          </a>
                        ) : (
                          <div className="w-full h-32 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                            <span className="material-symbols-outlined mr-2">image_not_supported</span> ไม่มีรูปใบขับขี่
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-2 space-y-6 flex flex-col">
                    {/* Section 2 (Right Top - History) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-72">
                      <div className="px-5 py-4 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center">
                          <span className="material-symbols-outlined mr-2 text-purple-500">history</span> ประวัติการส่งสินค้าล่าสุด
                        </h3>
                      </div>
                      <div className="flex-1 overflow-y-auto p-5">
                        {selectedRiderDetails.history && selectedRiderDetails.history.length > 0 ? (
                          <div className="space-y-3">
                            {selectedRiderDetails.history.map((job, idx) => (
                              <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                <div>
                                  <p className="font-bold text-slate-800 text-sm">ออเดอร์ #{job.order_id}</p>
                                  <p className="text-xs text-slate-500 mt-1">ร้านค้า: {job.shop_name || `ร้าน #${job.shop_id || '-'}`}</p>
                                </div>
                                <div className="text-right">
                                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-md mb-1 ${job.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {job.status === 'delivered' ? 'จัดส่งสำเร็จ' : job.status}
                                  </span>
                                  <p className="text-xs text-slate-400">{new Date(job.created_at).toLocaleString('th-TH')}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">receipt_long</span>
                            <p>ไม่มีประวัติการส่งสินค้า</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 3 (Right Bottom - Reviews) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-[18rem]">
                      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center">
                          <span className="material-symbols-outlined mr-2 text-yellow-500">star</span> รีวิวจากลูกค้า
                        </h3>
                      </div>
                      <div className="flex-1 overflow-y-auto p-5">
                        {selectedRiderDetails.reviews && selectedRiderDetails.reviews.length > 0 ? (
                          <div className="space-y-3">
                            {selectedRiderDetails.reviews.map((rev, idx) => (
                              <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex text-yellow-400 text-sm">
                                    {'⭐'.repeat(Math.round(rev.rating))}
                                    <span className="ml-2 text-slate-600 font-bold">{Number(rev.rating).toFixed(1)}</span>
                                  </div>
                                  <span className="text-xs text-slate-400">{new Date(rev.created_at).toLocaleString('th-TH')}</span>
                                </div>
                                <p className="text-sm text-slate-700">"{rev.comment || 'ไม่มีความคิดเห็น'}"</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">rate_review</span>
                            <p>ยังไม่มีรีวิวจากลูกค้า</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64 text-red-500 flex-col">
                  <span className="material-symbols-outlined text-4xl mb-2">error</span>
                  ไม่พบข้อมูลรายละเอียดพนักงาน
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Riders;
