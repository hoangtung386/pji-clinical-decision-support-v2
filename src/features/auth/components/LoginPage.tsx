import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../../../lib/utils/apiClient';
import { showToast } from '../../../components/common/Toast';

interface LoginResponse {
  access_token: string;
  user_id: number;
  username: string;
  role: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<LoginResponse>('/auth/login', { username, password });
      setToken(res.access_token);
      localStorage.setItem('user_info', JSON.stringify({
        id: res.user_id,
        username: res.username,
        role: res.role,
      }));
      showToast(`Xin chào, ${res.username}!`, 'success');
      navigate('/');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Đăng nhập thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', {
        username,
        email,
        full_name: fullName,
        password,
        role: 'clinician',
      });
      showToast('Đăng ký thành công! Hãy đăng nhập.', 'success');
      setIsRegister(false);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Đăng ký thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="bg-primary p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-white text-[32px]">orthopedics</span>
          </div>
          <h1 className="text-2xl font-bold text-white">OrthoSurg PJI Advisor</h1>
          <p className="text-white/80 text-sm mt-1">Hệ thống hỗ trợ quyết định lâm sàng</p>
        </div>

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            {isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}
          </h2>

          {isRegister && (
            <>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Họ và tên</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 px-3 rounded-lg border border-slate-300 focus:ring-primary focus:border-primary"
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 px-3 rounded-lg border border-slate-300 focus:ring-primary focus:border-primary"
                  required
                />
              </label>
            </>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Tên đăng nhập</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 px-3 rounded-lg border border-slate-300 focus:ring-primary focus:border-primary"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Mật khẩu</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 px-3 rounded-lg border border-slate-300 focus:ring-primary focus:border-primary"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>

          <p className="text-center text-sm text-slate-500">
            {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary font-medium hover:underline"
            >
              {isRegister ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
