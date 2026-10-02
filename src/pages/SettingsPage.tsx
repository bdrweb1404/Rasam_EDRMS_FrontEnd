import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings2,
  Sliders,
  Shield,
  Clock,
  Save,
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
  HardDrive,
  Lock,
} from 'lucide-react';
import { DocumentType } from '../types';

export const SettingsPage: React.FC = () => {
  const {
    systemSettings,
    updateSystemSettings,
    documentTypes,
    updateDocumentTypeRetention,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'schemas' | 'retention'>('general');

  // General settings state
  const [systemTitle, setSystemTitle] = useState(systemSettings.systemTitle);
  const [orgName, setOrgName] = useState(systemSettings.orgName);
  const [maxUploadSizeMb, setMaxUploadSizeMb] = useState(systemSettings.maxUploadSizeMb);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(
    systemSettings.sessionTimeoutMinutes
  );
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(systemSettings.twoFactorEnabled);

  // Selected doc type for schema review
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('contract');

  const currentTypeConfig = documentTypes.find((dt) => dt.type === selectedDocType);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
      systemTitle,
      orgName,
      maxUploadSizeMb,
      sessionTimeoutMinutes,
      twoFactorEnabled,
    });
  };

  const handleRetentionChange = (type: DocumentType, years: number) => {
    updateDocumentTypeRetention(type, years);
  };

  return (
    <div className="space-y-6 text-right pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>پیکربندی و تنظیمات سامانه بایگانی</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          تنظیمات عمومی، طراحی الگوهای متادیتای سفارشی و خط‌مشی‌های نگهداری قانونی اسناد
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('general')}
          className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'general'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>تنظیمات عمومی و برندینگ</span>
        </button>

        <button
          onClick={() => setActiveTab('schemas')}
          className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'schemas'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>انواع سند و فیلدهای متادیتا (Schema)</span>
        </button>

        <button
          onClick={() => setActiveTab('retention')}
          className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'retention'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>دوره نگهداری و امنیت اسناد (Retention)</span>
        </button>
      </div>

      {/* TAB 1: General Settings */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              عنوان سامانه در سربرگ
            </label>
            <input
              type="text"
              value={systemTitle}
              onChange={(e) => setSystemTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              نام سازمان / شرکت مالک
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                حداکثر حجم مجاز آپلود فایل (مگابایت)
              </label>
              <input
                type="number"
                value={maxUploadSizeMb}
                onChange={(e) => setMaxUploadSizeMb(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                مدت زمان انقضای نشست (دقیقه)
              </label>
              <input
                type="number"
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* 2FA Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  الزام احراز هویت دومرحله‌ای (2FA) برای ورود مدیران
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  ارسال رمز یکبار مصرف به شماره همراه در هنگام ورود با نقش‌های مدیریتی
                </span>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره تنظیمات عمومی</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Metadata Schemas */}
      {activeTab === 'schemas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Doc types selector */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2 px-2">
              انواع اسناد سازمانی
            </h3>
            {documentTypes.map((dt) => (
              <button
                key={dt.type}
                onClick={() => setSelectedDocType(dt.type)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                  selectedDocType === dt.type
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{dt.nameFa}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {dt.fields.length} فیلد
                </span>
              </button>
            ))}
          </div>

          {/* Active Type Schema Editor */}
          <div className="md:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            {currentTypeConfig && (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      فیلدهای متادیتای «{currentTypeConfig.nameFa}»
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentTypeConfig.description}
                    </p>
                  </div>
                  <button
                    onClick={() => addToast('فیلد جدید', 'قابلیت تعریف فیلد شاخص سفارشی فعال گردید.', 'info')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن فیلد متادیتا</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {currentTypeConfig.fields.map((f) => (
                    <div
                      key={f.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {f.nameFa}
                          </span>
                          {f.required && (
                            <span className="text-[10px] text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                              الزامی
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          کلید داده: {f.key} · نوع: {f.type === 'text' ? 'متنی' : f.type === 'date' ? 'تاریخ' : f.type === 'select' ? 'گزینه‌ای' : 'عددی'}
                        </p>
                      </div>

                      <span className="text-[11px] text-slate-400">فیلد شاخص فعال</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Retention Policy */}
      {activeTab === 'retention' && (
        <div className="max-w-3xl bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              خط‌مشی دوره نگهداری و امحای قانونی اسناد (Retention Policy)
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              بر اساس قوانین سازمان اسناد و کتابخانه ملی، هر دسته از اسناد دارای دوره نگهداری مصوب بوده و پس از انقضا به صورت خودکار نشانه‌گذاری یا به بایگانی راکد منتقل می‌شوند.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {documentTypes.map((dt) => (
              <div key={dt.type} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {dt.nameFa}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {dt.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">مدت نگهداری:</span>
                  <select
                    value={dt.retentionYears}
                    onChange={(e) => handleRetentionChange(dt.type, Number(e.target.value))}
                    className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono"
                  >
                    <option value={3}>۳ سال خورشیدی</option>
                    <option value={5}>۵ سال خورشیدی</option>
                    <option value={10}>۱۰ سال خورشیدی</option>
                    <option value={15}>۱۵ سال خورشیدی</option>
                    <option value={30}>۳۰ سال (دائمی/پرسنلی)</option>
                    <option value={50}>۵۰ سال (اسناد ملی و اساسنامه)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <span className="font-bold">هشدار انطباق با قوانین:</span> اسناد مالیاتی و احکام کارگزینی طبق مقررات اداری نباید دوره‌ای کمتر از ۱۰ و ۳۰ سال داشته باشند.
          </div>
        </div>
      )}
    </div>
  );
};
