import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  Search,
  UploadCloud,
  Bell,
  ChevronDown,
  KeyRound,
  LogOut,
  User,
  Shield,
  Trash2,
  Check,
} from 'lucide-react';
import { PageRoute } from '../../types';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const {
    theme,
    toggleTheme,
    currentPage,
    navigateTo,
    currentUser,
    logout,
    setIsUploadModalOpen,
    auditLogs,
    documents,
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageTitles: Record<PageRoute, { parent: string; current: string }> = {
    dashboard: { parent: 'سامانه', current: 'داشبورد آماری' },
    documents: { parent: 'بایگانی دیجیتال', current: 'مدیریت و مخزن اسناد' },
    trash: { parent: 'بایگانی دیجیتال', current: 'سطل زباله و اسناد منسوخ' },
    folders: { parent: 'ساختار سازمانی', current: 'پوشه‌ها و دسته‌بندی درختی' },
    users: { parent: 'امنیت و دسترسی', current: 'کاربران و ماتریس نقش‌ها (RBAC)' },
    search: { parent: 'کاوش اطلاعات', current: 'جستجوی پیشرفته و فیلتر ترکیبی' },
    reports: { parent: 'نظارت و تحلیل', current: 'گزارش‌های آماری و لاگ بازرسی' },
    settings: { parent: 'پیکربندی', current: 'تنظیمات سامانه و الگوهای متادیتا' },
    login: { parent: 'احراز هویت', current: 'ورود به سامانه' },
    'change-password': { parent: 'حساب کاربری', current: 'تغییر رمز عبور' },
    'forgot-password': { parent: 'احراز هویت', current: 'بازیابی رمز عبور' },
  };

  const breadcrumb = pageTitles[currentPage] || { parent: 'سامانه', current: 'صفحه اصلی' };
  const trashCount = documents.filter((d) => d.status === 'trash').length;
  const recentLogs = auditLogs.slice(0, 5);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="باز کردن منو"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <nav aria-label="موقعیت فعلی" className="flex items-center gap-2 text-xs md:text-sm">
          <span className="text-slate-400 dark:text-slate-500 font-medium">{breadcrumb.parent}</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px] md:max-w-none">
            {breadcrumb.current}
          </span>
        </nav>
      </div>

      {/* Zone 2: Search shortcut bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={() => navigateTo('search')}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg transition-colors group text-right"
        >
          <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            <span>جستجو در متن سند، شماره پرونده یا برچسب...</span>
          </span>
          <kbd className="font-mono text-[10px] bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
            جستجو
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions (Upload, Notifications, Theme, User) */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Upload Button */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
        >
          <UploadCloud className="w-4 h-4" />
          <span className="hidden sm:inline">آپلود سند جدید</span>
          <span className="sm:hidden">آپلود</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'حالت روز' : 'حالت شب'}
          aria-label="تغییر تم"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="اعلان‌ها و رویدادها"
            aria-label="اعلان‌ها"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
          </button>

          {isNotifMenuOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 text-right animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">رویدادهای اخیر بایگانی</span>
                <button
                  onClick={() => {
                    setIsNotifMenuOpen(false);
                    navigateTo('reports');
                  }}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  مشاهده همه لاگ‌ها
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {recentLogs.map((log) => (
                  <div key={log.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {log.actionFa}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {log.details}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                      <span>{log.userName}</span>
                      <span className="tabular-nums font-mono">{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right"
            aria-expanded={isProfileMenuOpen}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {currentUser?.name || 'کاربر سیستم'}
              </p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                {currentUser?.roleTitleFa || 'مدیر بایگانی'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 text-right animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                  {currentUser?.email}
                </p>
                <div className="mt-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                  {currentUser?.roleTitleFa} · {currentUser?.department}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigateTo('change-password');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  <span>تغییر رمز عبور</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigateTo('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>تنظیمات امنیتی</span>
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>خروج از حساب کاربری</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
