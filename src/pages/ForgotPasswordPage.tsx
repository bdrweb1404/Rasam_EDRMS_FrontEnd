import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Smartphone,
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  RotateCw,
} from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { navigateTo, addToast } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('admin@archive-system.ir');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('لطفاً ایمیل یا شماره همراه سازمانی خود را وارد فرمایید.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setOtpCode('482910'); // Simulated code for demonstration
      addToast('کد تأیید ارسال شد', 'کد یکبار مصرف شش رقمی ارسال گردید (کد نمونه: 482910)', 'info');
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpCode || otpCode.length < 5) {
      setError('کد تأیید نامعتبر است.');
      return;
    }

    if (newPassword.length < 8) {
      setError('رمز عبور جدید باید حداقل دارای ۸ کاراکتر باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('تکرار کلمه عبور مطابقت ندارد.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast('رمز عبور تغییر یافت', 'شما هم‌اکنون می‌توانید با رمز عبور جدید وارد شوید.', 'success');
      navigateTo('login');
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-900 text-slate-100 text-right select-none">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-indigo-500/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            بازیابی رمز عبور سامانه
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {step === 1
              ? 'اطلاعات حساب کاربری خود را جهت دریافت کد تأیید وارد کنید'
              : 'کد پیامک/ایمیل شده و کلمه عبور جدید را وارد فرمایید'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900 text-xs">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ایمیل یا شماره همراه سازمانی
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin@archive-system.ir یا ۰۹۱۲..."
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pr-10 pl-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors disabled:opacity-60"
            >
              {isLoading ? 'در حال ارسال کد...' : 'ارسال کد تأیید یکبار مصرف'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  کد تأیید ۶ رقمی (OTP)
                </label>
                <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                  کد نمونه: 482910
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="482910"
                className="w-full text-center tracking-widest text-lg font-mono py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                رمز عبور جدید
              </label>
              <input
                type="password"
                required
                placeholder="حداقل ۸ کاراکتر"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                تکرار رمز عبور جدید
              </label>
              <input
                type="password"
                required
                placeholder="تکرار رمز عبور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors disabled:opacity-60"
            >
              {isLoading ? 'در حال ثبت...' : 'تنظیم رمز جدید و ورود'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={() => navigateTo('login')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به صفحه ورود</span>
          </button>
        </div>
      </div>
    </div>
  );
};
