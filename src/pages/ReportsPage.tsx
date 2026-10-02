import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileBarChart,
  Download,
  Printer,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Calendar,
  Building,
  HardDrive,
  Users,
} from 'lucide-react';
import { AuditLogItem } from '../types';

export const ReportsPage: React.FC = () => {
  const { auditLogs, documents, folders, users, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'audit' | 'analytics'>('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filtered audit logs
  const filteredLogs = auditLogs.filter((log) => {
    if (selectedAction !== 'all' && log.action !== selectedAction) return false;
    if (selectedStatus !== 'all' && log.status !== selectedStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.actionFa.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.documentTitle && log.documentTitle.toLowerCase().includes(q)) ||
        log.ip.includes(q)
      );
    }
    return true;
  });

  // Export to CSV generator
  const exportToCSV = () => {
    const headers = ['شناسه', 'کاربر', 'نقش', 'عملیات', 'عنوان سند', 'آدرس IP', 'تاریخ و ساعت', 'وضعیت', 'توضیحات'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.actionFa}"`,
      `"${l.documentTitle || '-'}"`,
      l.ip,
      `"${l.timestamp}"`,
      l.status,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EDMS_Audit_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('خروجی اکسل ایجاد شد', 'فایل گزارش با فرمت CSV دانلود گردید.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const statusIcons: Record<AuditLogItem['status'], React.ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    error: <XCircle className="w-4 h-4 text-rose-500" />,
  };

  return (
    <div className="space-y-6 text-right pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>گزارش‌های نظارتی و لاگ بازرسی سامانه (Audit Trail)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ردیابی موشکافانه رفتار کاربران، عملیات بر روی اسناد، استخراج گزارش و مستندسازی بازرسی
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>خروجی اکسل / CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>چاپ گزارش (PDF)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>لاگ کامل فعالیت‌ها و امنیت ({filteredLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileBarChart className="w-4 h-4" />
          <span>گزارش‌های تحلیلی و آماری</span>
        </button>
      </div>

      {activeTab === 'audit' ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="جستجو در لاگ، نام کاربر، IP یا سند..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
              >
                <option value="all">همه انواع عملیات</option>
                <option value="create">بارگذاری سند</option>
                <option value="update">ویرایش متادیتا و نسخه</option>
                <option value="download">دانلود فایل</option>
                <option value="delete">حذف سند</option>
                <option value="login">احراز هویت</option>
                <option value="permission_change">تغییر دسترسی</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="success">موفقیت‌آمیز</option>
                <option value="warning">هشدار</option>
                <option value="error">خطا / ناموفق</option>
              </select>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">وضعیت</th>
                    <th className="py-3.5 px-4">کاربر اقدام‌کننده</th>
                    <th className="py-3.5 px-4">نوع اقدام</th>
                    <th className="py-3.5 px-4">سند مربوطه</th>
                    <th className="py-3.5 px-4">شرح رویداد</th>
                    <th className="py-3.5 px-4">آدرس IP</th>
                    <th className="py-3.5 px-4">زمان وقوع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center">{statusIcons[log.status]}</div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{log.userName}</p>
                        <p className="text-[10px] text-slate-400">{log.userRole}</p>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {log.actionFa}
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                        {log.documentTitle || '-'}
                      </td>

                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-[260px] truncate">
                        {log.details}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {log.ip}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 tabular-nums">
                        {log.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Analytics Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department Breakdown */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-500" />
              <span>تفکیک بارگذاری اسناد به تفکیک واحدهای سازمانی</span>
            </h3>

            <div className="space-y-3 pt-2">
              {[
                { dept: 'امور مالی و حسابداری', count: 45, percent: 35 },
                { dept: 'منابع انسانی و پرسنلی', count: 36, percent: 28 },
                { dept: 'امور حقوقی و قراردادها', count: 28, percent: 22 },
                { dept: 'پروژه‌ها و مستندات فنی', count: 19, percent: 15 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300">{item.dept}</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {item.count} سند ({item.percent}٪)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage & Formats Breakdown */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-500" />
              <span>توزیع حجم فایل‌ها بر اساس فرمت ذخیره‌سازی</span>
            </h3>

            <div className="space-y-3 pt-2">
              {[
                { ext: 'PDF (اسناد اسکن‌شده و رسمی)', size: '42.6 GB', percent: 65 },
                { ext: 'DOCX / XLSX (فایل‌های اداری و مالی)', size: '14.2 GB', percent: 22 },
                { ext: 'TIFF / JPG (تصاویر اسکن با وضوح بالا)', size: '5.8 GB', percent: 9 },
                { ext: 'سایر فرمت‌ها (ZIP, CAD)', size: '2.2 GB', percent: 4 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300">{item.ext}</span>
                    <span className="font-mono text-slate-500 text-[11px] tabular-nums">
                      {item.size}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
