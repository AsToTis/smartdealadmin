// เก็บข้อมูลแอดมินที่ล็อกอินอยู่ และแนบตัวตนไปกับทุก request เพื่อให้ backend บันทึกว่า "แอดมินคนไหน" เป็นคนกด
import axios from 'axios';

const KEY = 'smartdeal_admin';

export const getAdmin = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setAdmin = (admin) => {
  try { localStorage.setItem(KEY, JSON.stringify(admin)); } catch (e) { /* ignore */ }
};

export const clearAdmin = () => {
  try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
};

let installed = false;
export const installAdminInterceptor = () => {
  if (installed) return;
  installed = true;
  axios.interceptors.request.use((config) => {
    const admin = getAdmin();
    if (admin?.admin_id) {
      config.headers = config.headers || {};
      config.headers['X-Admin-Id'] = String(admin.admin_id);
      config.headers['X-Admin-Name'] = encodeURIComponent(admin.full_name || 'ผู้ดูแลระบบ');
    }
    return config;
  });
};
