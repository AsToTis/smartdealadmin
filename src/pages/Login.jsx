import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Mail, LogIn } from 'lucide-react';
import { getAdmin, setAdmin } from '../lib/adminSession';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (getAdmin()) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/login`, { email: email.trim(), password });
      if (res.data?.success) {
        setAdmin(res.data.admin);
        navigate('/', { replace: true });
      } else {
        setError(res.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-600">Smart Deal</h1>
          <p className="text-xs font-medium text-slate-400 mt-1">ADMIN · เข้าสู่ระบบผู้ดูแล</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">อีเมลผู้ดูแลระบบ</span>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="admin@smartdeal.com" autoComplete="username" />
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">รหัสผ่าน</span>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                autoComplete="current-password" />
            </div>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-60 transition-colors">
            <LogIn className="h-4 w-4" />
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}
