import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Archive,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  HardDrive,
  Users,
} from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, navigateTo } = useApp();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('لطفاً نام کاربری و رمز عبور را وارد فرمایید.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('رمز عبور باید حداقل شامل ۴ کاراکتر باشد.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(username.trim());
    }, 400);
  };

  const handleQuickDemoLogin = (roleUser: string, role: UserRole) => {
    setUsername(roleUser);
    setPassword('123456');
    login(roleUser, role);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-900 text-slate-100 select-none">
      {/* Visual Enterprise Brand Showcase Column */}
      <div className="relative flex-1 hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden border-l border-slate-800">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Ambient glow spots */}
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Archive className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              سامانه جامع بایگانی اسناد اداری
            </h1>
            <p className="text-xs text-indigo-300 font-mono tracking-wider">
              ELECTRONIC DOCUMENT MANAGEMENT SYSTEM (EDMS)
            </p>
          </div>
        </div>

        {/* Hero Features Narrative */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>استاندارد امنیت اطلاعات ISO 27001 و انطباق با اسناد ملی</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">
              مدیریت امن، یکپارچه و هوشمند کلیه اسناد و پرونده‌های سازمان
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed text-justify">
              دسترسی آنی به هزاران سند الکترونیکی، کنترل دقیق نسخه‌ها، ساختار درختی پوشه‌ها و ردیابی کامل لاگ رویدادها در بالاترین استانداردهای امنیتی سازمانی.
            </p>
          </div>

          {/* Quick Metrics Summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>اسناد فعال</span>
              </p>
              <p className="text-lg font-bold font-mono text-white mt-1 tabular-nums">۱۲,۴۸۰</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                <span>فضای امن ابری</span>
              </p>
              <p className="text-lg font-bold font-mono text-white mt-1 tabular-nums">۶۴.۸ GB</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>کاربران فعال</span>
              </p>
              <p className="text-lg font-bold font-mono text-white mt-1 tabular-nums">۱۴۲</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span>کلیه حقوق مادی و معنوی متعلق به سازمان مرکزی است.</span>
          <span className="font-mono">نسخه ۴.۲.۰</span>
        </div>
      </div>

      {/* Login Form Column */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center p-6 md:p-12 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-right">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-2.5 pb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                سامانه اسناد اداری
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">EDMS SYSTEM</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              ورود به سامانه بایگانی
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              لطفاً نام کاربری و کلمه عبور سازمانی خود را وارد فرمایید.
            </p>
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900 text-xs leading-relaxed animate-in fade-in">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                نام کاربری یا ایمیل سازمانی
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin یا ایمیل سازمانی"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pr-10 pl-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  رمز عبور
                </label>
                <button
                  type="button"
                  onClick={() => navigateTo('forgot-password')}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  فراموشی رمز عبور؟
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  مرا در این دستگاه به خاطر بسپار
                </span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <span>در حال اعتبارسنجی...</span>
              ) : (
                <>
                  <span>ورود امن به سامانه</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[11px] text-slate-400 font-medium">
              ورود سریع آزمایشی با نقش‌های مختلف:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin', 'admin')}
                className="p-2 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                مدیر کل (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('m.bahrami', 'archivist')}
                className="p-2 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                مدیر بایگانی
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('f.rasouli', 'operator')}
                className="p-2 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                کارشناس ثبت
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
