import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Megaphone, Image as ImageIcon, Link as LinkIcon, AlertCircle, X, Check, Pencil } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: ''
  });

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/banners`);
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('โหลดข้อมูลแบนเนอร์ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitBanner = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      toast.error('กรุณากรอกหัวข้อและ URL รูปภาพให้ครบถ้วน');
      return;
    }
    
    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/banners/${editingId}`, formData);
        toast.success('แก้ไขแบนเนอร์เรียบร้อยแล้ว');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/banners`, formData);
        toast.success('เพิ่มแบนเนอร์ใหม่เรียบร้อยแล้ว');
      }
      setIsModalOpen(false);
      setFormData({ title: '', image_url: '', link_url: '' });
      setIsEditing(false);
      setEditingId(null);
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error(isEditing ? 'ไม่สามารถแก้ไขแบนเนอร์ได้' : 'ไม่สามารถเพิ่มแบนเนอร์ได้');
    }
  };

  const openEditModal = (banner) => {
    setFormData({ title: banner.title, image_url: banner.image_url, link_url: banner.link_url || '' });
    setIsEditing(true);
    setEditingId(banner.id);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      // Toggle logic using PUT /api/admin/banners/:id/status
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/banners/${id}/status`, { is_active: !currentStatus });
      toast.success('อัปเดตสถานะแบนเนอร์สำเร็จ');
      setBanners(banners.map(b => b.id === id ? { ...b, is_active: !currentStatus } : b));
    } catch (error) {
      console.error('Error toggling banner status:', error);
      toast.error('ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('คุณต้องการลบแบนเนอร์นี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/banners/${id}`);
      toast.success('ลบแบนเนอร์สำเร็จ');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('ไม่สามารถลบแบนเนอร์ได้');
    }
  };

  return (
    <div className="space-y-6 relative">
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <Megaphone className="w-6 h-6 mr-3 text-green-600" />
          แบนเนอร์โปรโมชั่น (Promotion Banners)
        </h1>
        <button 
          onClick={() => {
            setIsEditing(false);
            setEditingId(null);
            setFormData({ title: '', image_url: '', link_url: '' });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มแบนเนอร์</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm">
            กำลังโหลดข้อมูล...
          </div>
        ) : banners.length > 0 ? (
          banners.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center justify-between group">
              {/* Left Side: Thumbnail & Details */}
              <div className="flex items-center space-x-5 flex-1 min-w-0">
                <div className="w-32 h-20 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x300/f1f5f9/94a3b8?text=Image+Error';
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={() => window.open(item.image_url, '_blank')}
                  >
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-lg font-bold text-slate-900 truncate mb-1">{item.title}</h3>
                  <div className="flex items-center text-sm text-slate-500 mb-1.5">
                    <LinkIcon className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
                    {item.link_url ? (
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 hover:underline truncate">
                        {item.link_url}
                      </a>
                    ) : (
                      <span className="italic">ไม่มีลิงก์ปลายทาง</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span>สร้างเมื่อ: {new Date(item.created_at).toLocaleDateString('th-TH')}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className={`font-medium ${item.is_active ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {item.is_active ? 'กำลังแสดงผล' : 'ซ่อนการแสดงผล'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Actions */}
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-100">
                <div className="flex flex-col items-center mr-2">
                  <button 
                    onClick={() => handleToggleStatus(item.id, item.is_active)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${item.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    title={item.is_active ? "ปิดการแสดงผล" : "เปิดการแสดงผล"}
                  >
                    <span className="sr-only">Toggle status</span>
                    <span 
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.is_active ? 'translate-x-5' : 'translate-x-0'}`} 
                    />
                  </button>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => openEditModal(item)}
                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="แก้ไขแบนเนอร์"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="ลบแบนเนอร์"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Megaphone className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">ยังไม่มีข้อมูลแบนเนอร์</h3>
            <p className="text-sm text-slate-500">คลิกที่ปุ่ม "+ เพิ่มแบนเนอร์" ด้านบนเพื่อเริ่มสร้างแบนเนอร์โปรโมชั่น</p>
          </div>
        )}
      </div>

      {/* Add Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditing ? 'แก้ไขแบนเนอร์' : 'เพิ่มแบนเนอร์ใหม่'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitBanner} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                  หัวข้อโปรโมชัน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="เช่น โปรโมชันลด 50% ต้อนรับปีใหม่"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-slate-700 mb-1">
                  URL รูปภาพแบนเนอร์ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="link_url" className="block text-sm font-medium text-slate-700 mb-1">
                  URL ลิงก์ปลายทาง (ไม่บังคับ)
                </label>
                <input
                  type="url"
                  id="link_url"
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleInputChange}
                  placeholder="https://smartdeal.com/promo"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {formData.image_url && (
                <div className="pt-2">
                  <span className="block text-sm font-medium text-slate-700 mb-2">พรีวิวรูปภาพ</span>
                  <div className="w-full h-32 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/600x300/f1f5f9/94a3b8?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex justify-end space-x-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึก</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
