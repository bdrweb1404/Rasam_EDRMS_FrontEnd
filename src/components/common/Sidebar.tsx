import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Files,
  FolderTree,
  Users2,
  SearchCode,
  FileBarChart,
  Settings2,
  Trash2,
  Database,
  Archive,
  ChevronLeft,
  HardDrive,
} from 'lucide-react';
import { PageRoute } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentPage, navigateTo, documents } = useApp();

  const activeDocsCount = documents.filter((d) => d.status === 'active').length;
  const trashDocsCount = documents.filter((d) => d.status === 'trash').length;

  const navGroups = [
    {
      label: 'میز کار و بایگانی',
      items: [
        {
          id: 'dashboard' as PageRoute,
          label: 'داشبورد آماری',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'documents' as PageRoute,
          label: 'مخزن اسناد',
          icon: Files,
          badge: activeDocsCount.toString(),
        },
        {
          id: 'folders' as PageRoute,
          label: 'ساختار پوشه‌ها',
          icon: FolderTree,
          badge: null,
        },
        {
          id: 'trash' as PageRoute,
          label: 'سطل زباله',
          icon: Trash2,
          badge: trashDocsCount > 0 ? trashDocsCount.toString() : null,
          badgeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400',
        },
      ],
    },
    {
      label: 'کاوش و گزارش‌گیری',
      items: [
        {
          id: 'search' as PageRoute,
          label: 'جستجوی پیشرفته',
          icon: SearchCode,
          badge: null,
        },
        {
          id: 'reports' as PageRoute,
          label: 'گزارش‌ها و لاگ‌ها',
          icon: FileBarChart,
          badge: null,
        },
      ],
    },
    {
      label: 'مدیریت و پیکربندی',
      items: [
        {
          id: 'users' as PageRoute,
          label: 'کاربران و نقش‌ها',
          icon: Users2,
          badge: null,
        },
        {
          id: 'settings' as PageRoute,
          label: 'تنظیمات سامانه',
          icon: Settings2,
          badge: null,
        },
      ],
    },
  ];

  const handleNavClick = (page: PageRoute) => {
    navigateTo(page);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 right-0 z-40 h-screen w-64 md:w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                <Archive className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight block">
                  سامانه اسناد اداری
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider block">
                  EDMS ENTERPRISE
                </span>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="بستن منو"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {group.label}
                </p>
                <div className="space-y-0.5 mt-1.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-md font-mono tabular-nums ${
                              item.badgeColor ||
                              (isActive
                                ? 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-bold'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400')
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Storage Meter & Footer Widget */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                  <span>فضای ذخیره‌سازی</span>
                </span>
                <span className="text-[11px] font-mono tabular-nums text-slate-500">۶۴.۸٪</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                  style={{ width: '64.8%' }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono tabular-nums">
                <span>۶۴.۸ GB مصرف‌شده</span>
                <span>از ۱۰۰ GB</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
              <span>نسخه سازمانی ۴.۲</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>متصل به سرور</span>
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
