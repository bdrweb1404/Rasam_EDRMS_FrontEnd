import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Shield } from 'lucide-react';
import { UserItem, UserRole } from '../../types';

interface UserModalProps {
  editingUser?: UserItem | null;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ editingUser, onClose }) => {
  const { addUser, updateUser } = useApp();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('فناوری اطلاعات');
  const [role, setRole] = useState<UserRole>('operator');

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setUsername(editingUser.username);
      setEmail(editingUser.email);
      setPhone(editingUser.phone);
      setDepartment(editingUser.department);
      setRole(editingUser.role);
    } else {
      setName('');
      setUsername('');
      setEmail('');
      setPhone('۰۹۱۲');
      setDepartment('فناوری اطلاعات');
      setRole('operator');
    }
  }, [editingUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim()) return;

    const roleTitles: Record<UserRole, string> = {
      admin: 'مدیر کل سیستم',
      archivist: 'مدیر ارشد بایگانی',
      operator: 'کارشناس بایگانی',
      viewer: 'کاربر مشاهده‌گر',
    };

    if (editingUser) {
      updateUser(editingUser.id, {
        name,
        username,
        email,
        phone,
        department,
        role,
        roleTitleFa: roleTitles[role],
      });
    } else {
      addUser({
        name,
        username,
        email,
        phone,
        department,
        role,
        roleTitleFa: roleTitles[role],
        status: 'active',
        avatar: '',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-right">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingUser ? 'ویرایش کاربر سامانه' : 'تعریف کاربر جدید'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                نام و نام خانوادگی <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: مریم احمدی"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                نام کاربری (انگلیسی) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="m.ahmadi"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                پست الکترونیک (ایمیل) <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@organization.ir"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                شماره همراه
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                واحد سازمانی / دپارتمان
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
              >
                <option value="فناوری اطلاعات و زیرساخت">فناوری اطلاعات و زیرساخت</option>
                <option value="امور مالی و حسابداری">امور مالی و حسابداری</option>
                <option value="منابع انسانی و پرسنلی">منابع انسانی و پرسنلی</option>
                <option value="امور حقوقی و قراردادها">امور حقوقی و قراردادها</option>
                <option value="دبیرخانه مرکزی">دبیرخانه مرکزی</option>
                <option value="حراست و بازرسی">حراست و بازرسی</option>
                <option value="روابط عمومی">روابط عمومی</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                نقش و سطح دسترسی (RBAC)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
              >
                <option value="admin">مدیر کل سیستم (دسترسی کامل)</option>
                <option value="archivist">مدیر بایگانی (پوشه‌ها و تایید اسناد)</option>
                <option value="operator">کارشناس بایگانی (آپلود و ثبت)</option>
                <option value="viewer">مشاهده‌کننده اسناد (فقط خواندنی)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700 dark:text-slate-300">نکته امنیتی:</span> رمز عبور موقت پس از ثبت کاربر تولید و به آدرس ایمیل وی ارسال خواهد شد. کاربر در اولین ورود ملزم به تغییر رمز عبور خواهد بود.
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              {editingUser ? 'ذخیره تغییرات' : 'ایجاد حساب کاربری'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
