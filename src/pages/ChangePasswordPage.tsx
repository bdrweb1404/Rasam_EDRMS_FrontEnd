import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  KeyRound,
  Lock,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
} from 'lucide-react';

export const ChangePasswordPage: React.FC = () => {
  const { navigateTo, addToast, addLog, currentUser } = useApp();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password criteria analysis
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  const strengthLabels = ['بسیار ضعیف', 'ضعیف', 'متوسط', 'خوب', 'عالی و امن'];
  const strengthColors = [
    'bg-rose-500',
    'bg-rose-400',
    'bg-amber-500',
    'bg-indigo-500',
    'bg-emerald-500',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('لطفاً رمز عبور فعلی خود را وارد فرمایید.');
      return;
    }

    if (newPassword.length < 8) {
      setError('کلمه عبور جدید باید حداقل دارای ۸ کاراکتر باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('تکرار کلمه عبور جدید با کلمه عبور مطابقت ندارد.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('کلمه عبور جدید نمی‌تواند همان کلمه عبور فعلی باشد.');
      return;
    }

    setSuccess(true);
    addLog('update', 'تغییر رمز عبور کاربر', undefined, undefined, 'رمز عبور حساب کاربری با موفقیت بروزرسانی شد.');
    addToast('رمز عبور تغییر یافت', 'کلمه عبور جدید شما با موفقیت ذخیره گردید.', 'success');

    setTimeout(() => {
      navigateTo('dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 text-right">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>تغییر رمز عبور حساب کاربری</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            جهت حفظ امنیت اطلاعات بایگانی، توصیه می‌شود رمز عبور خود را به صورت دوره‌ای بروزرسانی فرمایید.
          </p>
        </div>

        <button
          onClick={() => navigateTo('dashboard')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به داشبورد</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900 text-xs">
            {error}
          </div>
        )}

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              رمز عبور با موفقیت بروزرسانی شد!
            </h3>
            <p className="text-xs text-slate-500">
              در حال انتقال به صفحه داشبورد سامانه...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                رمز عبور فعلی <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  placeholder="رمز عبور فعلی خود را وارد کنید"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                رمز عبور جدید <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  placeholder="حداقل ۸ کاراکتر به همراه حروف، عدد و علامت"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">میزان قدرت رمز عبور:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {strengthLabels[Math.min(score, 4)]}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 h-1.5">
                    {[0, 1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`rounded-full transition-all duration-300 ${
                          step < score ? strengthColors[Math.min(score, 4)] : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Checklist criteria */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-500">
                    <span className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>حداقل ۸ کاراکتر</span>
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      {hasUppercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>حروف بزرگ انگلیسی (A-Z)</span>
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      {hasNumber ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>اعداد ریاضی (0-9)</span>
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      {hasSpecial ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>علائم نگارشی (!@#$%)</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                تکرار رمز عبور جدید <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="رمز عبور جدید را مجدداً وارد فرمایید"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigateTo('dashboard')}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
              >
                تایید و تغییر کلمه عبور
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
