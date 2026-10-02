import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Settings as SettingsIcon, DollarSign, Activity, Info, AlertTriangle, ShieldCheck, Truck, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('financial'); // financial, operation, info

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/settings`);
      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('ไม่สามารถโหลดข้อมูลการตั้งค่าได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (key, value) => {
    setSettings(settings.map(s => s.setting_key === key ? { ...s, setting_value: value } : s));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const payload = settings.map(s => ({ setting_key: s.setting_key, setting_value: s.setting_value }));
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/settings`, { settings: payload });
      if (response.data.success) {
        toast.success('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  const getSettingsByCategory = (cat) => settings.filter(s => s.category === cat);
  
  const getVal = (key) => {
    const s = settings.find(x => x.setting_key === key);
    return s ? s.setting_value : '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
          <SettingsIcon size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-primary-400" size={32} />
              <h1 className="text-3xl font-extrabold tracking-tight">System Control Panel</h1>
            </div>
            <p className="text-slate-400 text-lg max-w-2xl">แผงควบคุมระบบ (God Mode) จัดการค่าธรรมเนียม, บริหารไรเดอร์ และตั้งค่าแอปพลิเคชันได้ครบจบในหน้าเดียว</p>
          </div>
          <button 
            onClick={saveSettings}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary-500/30 
              \${saving ? 'bg-primary-600/70 text-white cursor-not-allowed' : 'bg-primary-500 text-white hover:bg-primary-400 hover:-translate-y-1'}`}
          >
            {saving ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : <Save size={20} />}
            {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่าทั้งหมด'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <button 
          onClick={() => setActiveTab('financial')}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap \${activeTab === 'financial' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
        >
          <DollarSign size={18} /> ค่าธรรมเนียม & การเงิน (Financials)
        </button>

        <button 
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap \${activeTab === 'info' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
        >
          <Info size={18} /> ข้อมูลแอปพลิเคชัน (App Info)
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* FINANCIAL TAB */}
        {activeTab === 'financial' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
                <span className="material-symbols-outlined mr-2 text-primary-500">storefront</span> ส่วนแบ่งรายได้ (Gross Profit)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">เปอร์เซ็นต์ GP ที่หักจากร้านค้า (%)</label>
                  <p className="text-xs text-slate-500 mb-2">อัตราส่วนที่ระบบจะหักเป็นรายได้เมื่อออเดอร์สำเร็จ</p>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={getVal('platform_fee_percent')} 
                      onChange={(e) => handleInputChange('platform_fee_percent', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold">%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ส่วนแบ่งค่าจัดส่งให้ไรเดอร์ (%)</label>
                  <p className="text-xs text-slate-500 mb-2">หักจากค่าจัดส่งที่ลูกค้าจ่าย (100% = ให้ไรเดอร์ทั้งหมด)</p>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={getVal('rider_commission_percent')} 
                      onChange={(e) => handleInputChange('rider_commission_percent', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
                <Truck className="mr-2 text-primary-500" /> โครงสร้างค่าจัดส่ง (Delivery Fares)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ค่าจัดส่งเริ่มต้น (Base Fare)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={getVal('base_delivery_fee')} 
                      onChange={(e) => handleInputChange('base_delivery_fee', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold">฿</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ค่าจัดส่งบวกเพิ่มต่อกิโลเมตร</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={getVal('per_km_fee')} 
                      onChange={(e) => handleInputChange('per_km_fee', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold">฿/km</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ยอดสั่งซื้อขั้นต่ำ (Minimum Order)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={getVal('minimum_order_value')} 
                      onChange={(e) => handleInputChange('minimum_order_value', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold">฿</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* APP INFO TAB */}
        {activeTab === 'info' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
                <Info className="mr-2 text-indigo-500" /> ข้อมูลพื้นฐานแอปพลิเคชัน
              </h2>
              
              <div className="space-y-5 max-w-3xl">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ชื่อแอปพลิเคชัน (App Name)</label>
                  <input 
                    type="text" 
                    value={getVal('app_name')} 
                    onChange={(e) => handleInputChange('app_name', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">อีเมลฝ่ายสนับสนุน (Support Email)</label>
                    <input 
                      type="email" 
                      value={getVal('support_email')} 
                      onChange={(e) => handleInputChange('support_email', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">เบอร์ติดต่อฉุกเฉิน (Hotline)</label>
                    <input 
                      type="text" 
                      value={getVal('support_phone')} 
                      onChange={(e) => handleInputChange('support_phone', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-sm font-bold text-slate-700">Facebook Page URL</label>
                  <div className="flex">
                    <div className="flex items-center justify-center bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-4">
                      <span className="material-symbols-outlined text-slate-500">link</span>
                    </div>
                    <input 
                      type="url" 
                      value={getVal('facebook_url')} 
                      onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-r-xl px-4 py-3 text-base text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Settings;
