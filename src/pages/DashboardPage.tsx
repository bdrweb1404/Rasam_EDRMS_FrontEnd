import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Files,
  UploadCloud,
  Users2,
  HardDrive,
  FileCheck2,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  FolderPlus,
  Search,
  Eye,
  Download,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
} from 'lucide-react';
import { DocumentItem } from '../types';

export const DashboardPage: React.FC = () => {
  const {
    documents,
    users,
    folders,
    auditLogs,
    setSelectedDocForPreview,
    setIsUploadModalOpen,
    setIsFolderModalOpen,
    navigateTo,
    addToast,
  } = useApp();

  const activeDocs = documents.filter((d) => d.status === 'active');
  const todayDocs = activeDocs.filter((d) => d.createdAt.includes('۰۷/۲۰') || d.updatedAt.includes('۰۷/۲۰'));
  const activeUsers = users.filter((u) => u.status === 'active');

  // Document types breakdown calculation
  const typeCounts = activeDocs.reduce((acc, doc) => {
    acc[doc.type] = (acc[doc.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeLabels: Record<string, { label: string; color: string }> = {
    contract: { label: 'قراردادها', color: 'bg-emerald-500' },
    invoice: { label: 'فاکتورها و مالی', color: 'bg-amber-500' },
    letter: { label: 'مکاتبات اداری', color: 'bg-blue-500' },
    personnel: { label: 'پرونده پرسنلی', color: 'bg-purple-500' },
    technical: { label: 'مستندات فنی', color: 'bg-cyan-500' },
    legal: { label: 'مصوبات حقوقی', color: 'bg-rose-500' },
    report: { label: 'گزارش‌های دوره‌ای', color: 'bg-indigo-500' },
  };

  // Recent 5 documents
  const recentDocuments = activeDocs.slice(0, 5);

  // Recent 6 activities
  const recentActivities = auditLogs.slice(0, 6);

  // Monthly upload trends data for SVG graph
  const monthlyData = [
    { month: 'اردیبهشت', count: 120 },
    { month: 'خرداد', count: 185 },
    { month: 'تیر', count: 240 },
    { month: 'مرداد', count: 210 },
    { month: 'شهریور', count: 320 },
    { month: 'مهر', count: 410 },
  ];

  const maxVal = Math.max(...monthlyData.map((d) => d.count));

  return (
    <div className="space-y-6 text-right pb-10">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            میز کار و داشبورد مدیریتی اسناد
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            وضعیت کلی مخزن اسناد، روند ثبت مدارک، پایش دسترسی‌ها و آخرین تغییرات بایگانی
          </p>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>آپلود سند جدید</span>
          </button>

          <button
            onClick={() => setIsFolderModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-slate-400" />
            <span>پوشه جدید</span>
          </button>

          <button
            onClick={() => navigateTo('search')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>جستجوی پیشرفته</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Docs */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>کل اسناد در بایگانی</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Files className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {activeDocs.length + 12480}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>۱۲.۴٪ رشد نسبت به ماه گذشته</span>
            </div>
          </div>
        </div>

        {/* Card 2: Today's Docs */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>اسناد ثبت شده امروز</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {todayDocs.length + 38}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <span>در ۷ بخش و دبیرخانه سازمانی</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Staff */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>کاربران فعال سامانه</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {activeUsers.length + 136}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              <span>۴ نقش دسترسی تفکیک‌شده</span>
            </div>
          </div>
        </div>

        {/* Card 4: Disk Storage */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>فضای ذخیره‌سازی ابری</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                ۶۴.۸ GB
              </span>
              <span className="text-xs text-slate-400 font-mono">از ۱۰۰ GB</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full"
                style={{ width: '64.8%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Uploads Trend Chart (Area / Line SVG) */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                روند ماهانه بارگذاری اسناد
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تعداد فایل‌های ثبت شده در ۶ ماه اخیر
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono">سال ۱۴۰۳</div>
          </div>

          {/* SVG Line / Bar visualization */}
          <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyData.map((item, idx) => {
              const heightPercent = Math.round((item.count / maxVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[11px] font-mono tabular-nums text-slate-400 group-hover:text-indigo-600 transition-colors">
                    {item.count}
                  </span>
                  <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-700 group-hover:to-indigo-500 rounded-t-lg transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200 font-medium">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Document Types Distribution */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              توزیع اسناد بر اساس نوع
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">دسته‌بندی ساختاریافته مدارک سازمانی</p>

            <div className="space-y-3 mt-6">
              {Object.entries(typeLabels).slice(0, 5).map(([typeKey, cfg]) => {
                const count = (typeCounts[typeKey] || 0) + (typeKey === 'contract' ? 28 : typeKey === 'invoice' ? 45 : typeKey === 'letter' ? 78 : 19);
                const percent = Math.min(100, Math.round((count / 220) * 100));

                return (
                  <div key={typeKey} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {cfg.label}
                      </span>
                      <span className="font-mono tabular-nums text-slate-500 text-[11px]">
                        {count} مورد ({percent}٪)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cfg.color} rounded-full`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">مجموع انواع فعال: ۷ الگو</span>
            <button
              onClick={() => navigateTo('settings')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>تنظیم الگوها</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Split Section: Recent Documents Table & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents Table (2 columns) */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                آخرین اسناد بارگذاری و بروزرسانی شده
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                دسترسی سریع به آخرین مدارک ورودی به سیستم
              </p>
            </div>
            <button
              onClick={() => navigateTo('documents')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>مشاهده همه اسناد</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto">
            {recentDocuments.map((doc) => (
              <div
                key={doc.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs uppercase shrink-0 font-mono">
                    {doc.extension}
                  </div>
                  <div className="min-w-0">
                    <p
                      onClick={() => setSelectedDocForPreview(doc)}
                      className="text-xs font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                        {doc.documentNumber}
                      </span>
                      <span>·</span>
                      <span>{doc.folderName}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{doc.size}</span>
                      <span>·</span>
                      <span>{doc.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setSelectedDocForPreview(doc)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="پیش‌نمایش آنلاین"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      addToast('دانلود فایل', `فایل ${doc.title} دانلود شد.`, 'success');
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="دریافت فایل"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Activity Stream (1 column) */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                رویدادها و لاگ بازرسی
              </h2>
              <button
                onClick={() => navigateTo('reports')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                لاگ کامل
              </button>
            </div>

            <div className="space-y-3.5">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {act.actionFa}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {act.details}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
                      <span>{act.userName}</span>
                      <span className="tabular-nums">{act.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>رمزنگاری AES-256</span>
            </span>
            <span>بک‌آپ خودکار شبانه</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}
