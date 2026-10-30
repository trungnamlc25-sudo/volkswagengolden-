import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials (admin / nam123 with password kenda123)
      const validAccounts: Record<string, string> = {
        admin: 'kenda123',
        nam123: 'kenda123',
      };

      const inputUser = username.trim();
      const userKey = inputUser.toLowerCase();

      if (validAccounts[userKey] && validAccounts[userKey] === password) {
        sessionStorage.setItem('vw_admin_auth', 'true');
        sessionStorage.setItem('vw_admin_user', inputUser);
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg('Tài khoản hoặc mật khẩu không chính xác! Vui lòng thử lại.');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background glow accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-vw-blue/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-vw-cyan/20 rounded-full blur-3xl pointer-events-none" />

      {/* Login Box */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6 border border-slate-200">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-vw-blue text-white mx-auto flex items-center justify-center p-2 shadow-lg">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4.5" />
              <path d="M 28,26 L 44,74 L 50,56 L 56,74 L 72,26 L 62,26 L 53,53 L 50,44 L 53,35 L 61,35 L 63,26 L 37,26 L 39,35 L 47,35 L 50,44 L 47,53 L 38,26 Z" />
            </svg>
          </div>
          <span className="text-[11px] font-black tracking-widest text-vw-cyan uppercase block">
            Volkswagen Thế Kiệt
          </span>
          <h2 className="text-2xl font-black text-vw-blue tracking-tight">
            Đăng Nhập Quản Trị
          </h2>
          <p className="text-xs text-slate-500">
            Khu vực dành riêng cho ban quản lý showroom & chuyên viên tư vấn
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Tên tài khoản
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tài khoản (admin / nam123)"
                className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-vw-blue"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu (kenda123)"
                className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-vw-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl font-extrabold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Đang kiểm tra...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>ĐĂNG NHẬP HỆ THỐNG</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Showroom Home link */}
        <div className="pt-2 text-center border-t border-slate-100">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-vw-blue font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trở về Website Bán Hàng</span>
          </button>
        </div>

      </div>

    </div>
  );
};
