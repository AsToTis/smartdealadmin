import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History, LogIn, RefreshCw, Search } from 'lucide-react';

const ACTOR_LABEL = { admin: 'แอดมิน', seller: 'ร้านค้า', rider: 'ไรเดอร์', buyer: 'ลูกค้า', driver: 'ไรเดอร์', system: 'ระบบ' };
const fmt = (d) => (d ? new Date(d.replace(' ', 'T')).toLocaleString('th-TH', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-');

export default function ActivityLogs() {
  const [tab, setTab] = useState('audit');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actorType, setActorType] = useState('');
  const [q, setQ] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL;
      const res = tab === 'audit'
        ? await axios.get(`${base}/api/admin/audit-logs`, { params: { actor_type: actorType || undefined, q: q || undefined } })
        : await axios.get(`${base}/api/admin/login-logs`);
      setRows(res.data?.data || []);
    } catch (e) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab, actorType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">ประวัติการใช้งานระบบ</h2>
          <p className="text-sm text-slate-500 mt-1">ข้อมูลจริงจากตาราง admin_audit_logs และ login_logs ในฐานข้อมูล</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-md hover:bg-slate-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> รีเฟรช
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setTab('audit')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${tab === 'audit' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
          <History className="h-4 w-4" /> การกระทำของผู้ใช้
        </button>
        <button onClick={() => setTab('login')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${tab === 'login' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
          <LogIn className="h-4 w-4" /> ประวัติเข้าสู่ระบบ
        </button>
        {tab === 'audit' && (
          <>
            <select value={actorType} onChange={(e) => setActorType(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-md bg-white">
              <option value="">ทุกบทบาท</option>
              <option value="admin">แอดมิน</option>
              <option value="seller">ร้านค้า</option>
              <option value="rider">ไรเดอร์</option>
              <option value="buyer">ลูกค้า</option>
            </select>
            <form onSubmit={(e) => { e.preventDefault(); load(); }} className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาชื่อ / รายละเอียด"
                className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md bg-white" />
            </form>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            {tab === 'audit' ? (
              <tr><th className="px-4 py-3 w-40">เวลา</th><th className="px-4 py-3 w-24">บทบาท</th><th className="px-4 py-3 w-48">ผู้ดำเนินการ</th><th className="px-4 py-3 w-44">การกระทำ</th><th className="px-4 py-3">รายละเอียด</th></tr>
            ) : (
              <tr><th className="px-4 py-3 w-40">เวลา</th><th className="px-4 py-3">ผู้ใช้</th><th className="px-4 py-3">บทบาท</th><th className="px-4 py-3">แอป</th><th className="px-4 py-3">ผล</th><th className="px-4 py-3">IP / อุปกรณ์</th></tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">{loading ? 'กำลังโหลด...' : 'ยังไม่มีข้อมูล'}</td></tr>
            )}
            {tab === 'audit' && rows.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{fmt(r.created_at)}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">{ACTOR_LABEL[r.actor_type] || r.actor_type}</span></td>
                <td className="px-4 py-3 text-slate-700">{r.actor_name}</td>
                <td className="px-4 py-3 font-medium text-slate-700">{r.action_th}</td>
                <td className="px-4 py-3 text-slate-600">{r.description_th}</td>
              </tr>
            ))}
            {tab === 'login' && rows.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{fmt(r.created_at)}</td>
                <td className="px-4 py-3 text-slate-700">{r.full_name || r.login_identifier || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{r.role_th || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{r.app_name}</td>
                <td className="px-4 py-3">
                  {Number(r.is_success) === 1
                    ? <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs">สำเร็จ</span>
                    : <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs" title={r.fail_reason}>ไม่สำเร็จ: {r.fail_reason}</span>}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{r.ip_address || '-'}<br />{r.device_info || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
