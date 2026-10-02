import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Calendar,
  Tag,
  Shield,
  FileText,
  User,
  RotateCcw,
  Eye,
  Download,
  Folder,
  Sliders,
  Check,
  Sparkles,
  FileType,
  FileSpreadsheet,
  Image,
  Archive as ArchiveIcon,
  X,
  ChevronDown,
  CalendarDays,
} from 'lucide-react';
import { DocumentType, ConfidentialityLevel } from '../types';

type DateRangePreset = 'all' | 'today' | 'week' | 'month' | 'season' | 'year' | 'custom';
type FormatPreset = 'all' | 'pdf' | 'docx' | 'xlsx' | 'image' | 'archive';

export const AdvancedSearchPage: React.FC = () => {
  const { documents, folders, documentTypes, setSelectedDocForPreview, addToast } = useApp();

  // Search parameters
  const [keyword, setKeyword] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedConfidentiality, setSelectedConfidentiality] = useState<string>('all');
  const [author, setAuthor] = useState('');
  const [tag, setTag] = useState('');

  // Quick Filters state
  const [dateRange, setDateRange] = useState<DateRangePreset>('all');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [formatPreset, setFormatPreset] = useState<FormatPreset>('all');

  // Convert Persian numbers to English for uniform date comparison
  const normalizeDigits = (str: string) => {
    return str.replace(/[۰-۹]/g, (w) => (w.charCodeAt(0) - 1776).toString());
  };

  // Quick preset filters
  const applyPreset = (preset: 'contracts' | 'confidential' | 'recent' | 'letters') => {
    if (preset === 'contracts') {
      setSelectedType('contract');
      setSelectedFolder('all');
      setSelectedConfidentiality('all');
      setKeyword('');
    } else if (preset === 'confidential') {
      setSelectedType('all');
      setSelectedConfidentiality('confidential');
      setKeyword('');
    } else if (preset === 'recent') {
      setDateRange('month');
      setKeyword('');
    } else if (preset === 'letters') {
      setSelectedType('letter');
    }
    addToast('فیلتر سریع اعمال شد', 'پارامترهای جستجو تنظیم گردید.', 'info');
  };

  const handleReset = () => {
    setKeyword('');
    setDocNumber('');
    setSelectedType('all');
    setSelectedFolder('all');
    setSelectedConfidentiality('all');
    setAuthor('');
    setTag('');
    setDateRange('all');
    setCustomFromDate('');
    setCustomToDate('');
    setFormatPreset('all');
    addToast('فیلترها ریست شدند', 'تمام شروط جستجو پاکسازی گردید.', 'info');
  };

  // Live evaluated search results
  const searchResults = useMemo(() => {
    return documents.filter((doc) => {
      if (doc.status !== 'active') return false;

      // 1. Keyword search (in title, description, metadata, snippet)
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const inTitle = doc.title.toLowerCase().includes(q);
        const inSnippet = doc.contentSnippet?.toLowerCase().includes(q);
        const inDesc = doc.description?.toLowerCase().includes(q);
        const inMeta = Object.values(doc.metadata).some((v) => v.toLowerCase().includes(q));
        if (!inTitle && !inSnippet && !inDesc && !inMeta) return false;
      }

      // 2. Document Number
      if (docNumber.trim() && !doc.documentNumber.toLowerCase().includes(docNumber.toLowerCase())) {
        return false;
      }

      // 3. Document Type
      if (selectedType !== 'all' && doc.type !== selectedType) {
        return false;
      }

      // 4. Folder
      if (selectedFolder !== 'all' && doc.folderId !== selectedFolder) {
        return false;
      }

      // 5. Confidentiality
      if (selectedConfidentiality !== 'all' && doc.confidentiality !== selectedConfidentiality) {
        return false;
      }

      // 6. Author
      if (author.trim() && !doc.author.toLowerCase().includes(author.toLowerCase())) {
        return false;
      }

      // 7. Tag
      if (tag.trim() && !doc.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))) {
        return false;
      }

      // 8. File Format Quick Filter
      if (formatPreset !== 'all') {
        const ext = doc.extension.toLowerCase();
        if (formatPreset === 'pdf' && ext !== 'pdf') return false;
        if (formatPreset === 'docx' && ext !== 'docx' && ext !== 'doc') return false;
        if (formatPreset === 'xlsx' && ext !== 'xlsx' && ext !== 'xls') return false;
        if (
          formatPreset === 'image' &&
          !['jpg', 'jpeg', 'png', 'tiff', 'tif', 'webp', 'bmp'].includes(ext)
        )
          return false;
        if (formatPreset === 'archive' && !['zip', 'rar', '7z', 'tar', 'gz'].includes(ext))
          return false;
      }

      // 9. Date Range Quick Filter
      if (dateRange !== 'all') {
        const docDateNorm = normalizeDigits(doc.createdAt); // e.g. 1403/07/20

        if (dateRange === 'today') {
          // Today in mock data is 1403/07/20
          if (!docDateNorm.includes('07/20')) return false;
        } else if (dateRange === 'week') {
          // Past 7 days: 07/14 to 07/20
          const matchMonth = docDateNorm.includes('1403/07');
          const dayPart = parseInt(docDateNorm.split('/')[2] || '0', 10);
          if (!matchMonth || dayPart < 14) return false;
        } else if (dateRange === 'month') {
          // Current month: 1403/07
          if (!docDateNorm.includes('1403/07')) return false;
        } else if (dateRange === 'season') {
          // Last 3 months (Summer/Fall: 1403/05, 1403/06, 1403/07)
          const inSeason =
            docDateNorm.includes('1403/05') ||
            docDateNorm.includes('1403/06') ||
            docDateNorm.includes('1403/07');
          if (!inSeason) return false;
        } else if (dateRange === 'year') {
          // Current year: 1403
          if (!docDateNorm.includes('1403')) return false;
        } else if (dateRange === 'custom') {
          if (customFromDate && normalizeDigits(customFromDate) > docDateNorm) return false;
          if (customToDate && normalizeDigits(customToDate) < docDateNorm) return false;
        }
      }

      return true;
    });
  }, [
    documents,
    keyword,
    docNumber,
    selectedType,
    selectedFolder,
    selectedConfidentiality,
    author,
    tag,
    formatPreset,
    dateRange,
    customFromDate,
    customToDate,
  ]);

  // Formats definition for Quick Filter pills
  const formatOptions = [
    { id: 'all' as FormatPreset, label: 'همه فرمت‌ها', icon: FileText },
    { id: 'pdf' as FormatPreset, label: 'PDF اسناد رسمی', icon: FileType },
    { id: 'docx' as FormatPreset, label: 'Word (DOCX)', icon: FileText },
    { id: 'xlsx' as FormatPreset, label: 'Excel (XLSX)', icon: FileSpreadsheet },
    { id: 'image' as FormatPreset, label: 'تصاویر اسکن (JPG / TIFF)', icon: Image },
    { id: 'archive' as FormatPreset, label: 'فایل فشرده (ZIP)', icon: ArchiveIcon },
  ];

  // Date range options for Quick Filter pills
  const dateOptions = [
    { id: 'all' as DateRangePreset, label: 'همه زمان‌ها' },
    { id: 'today' as DateRangePreset, label: 'امروز' },
    { id: 'week' as DateRangePreset, label: 'هفته اخیر' },
    { id: 'month' as DateRangePreset, label: 'ماه جاری (مهر)' },
    { id: 'season' as DateRangePreset, label: '۳ ماه اخیر' },
    { id: 'year' as DateRangePreset, label: 'سال جاری (۱۴۰۳)' },
    { id: 'custom' as DateRangePreset, label: 'بازه دلخواه...' },
  ];

  // Determine active filter badges for the Active Filter Summary
  const activeFilters = useMemo(() => {
    const list: { key: string; label: string; onRemove: () => void }[] = [];

    if (keyword.trim()) {
      list.push({
        key: 'keyword',
        label: `کلمه: ${keyword}`,
        onRemove: () => setKeyword(''),
      });
    }

    if (formatPreset !== 'all') {
      const match = formatOptions.find((f) => f.id === formatPreset);
      list.push({
        key: 'format',
        label: `فرمت: ${match?.label || formatPreset}`,
        onRemove: () => setFormatPreset('all'),
      });
    }

    if (dateRange !== 'all') {
      const match = dateOptions.find((d) => d.id === dateRange);
      list.push({
        key: 'date',
        label: `تاریخ: ${match?.label || dateRange}`,
        onRemove: () => setDateRange('all'),
      });
    }

    if (selectedType !== 'all') {
      const t = documentTypes.find((dt) => dt.type === selectedType);
      list.push({
        key: 'type',
        label: `نوع: ${t?.nameFa || selectedType}`,
        onRemove: () => setSelectedType('all'),
      });
    }

    if (selectedFolder !== 'all') {
      const f = folders.find((fol) => fol.id === selectedFolder);
      list.push({
        key: 'folder',
        label: `پوشه: ${f?.name || selectedFolder}`,
        onRemove: () => setSelectedFolder('all'),
      });
    }

    if (selectedConfidentiality !== 'all') {
      const confMap: Record<string, string> = {
        normal: 'عادی',
        confidential: 'محرمانه',
        secret: 'به‌کلی سری',
      };
      list.push({
        key: 'conf',
        label: `طبقه‌بندی: ${confMap[selectedConfidentiality] || selectedConfidentiality}`,
        onRemove: () => setSelectedConfidentiality('all'),
      });
    }

    if (tag.trim()) {
      list.push({
        key: 'tag',
        label: `برچسب: #${tag}`,
        onRemove: () => setTag(''),
      });
    }

    if (author.trim()) {
      list.push({
        key: 'author',
        label: `ثبت‌کننده: ${author}`,
        onRemove: () => setAuthor(''),
      });
    }

    return list;
  }, [
    keyword,
    formatPreset,
    dateRange,
    selectedType,
    selectedFolder,
    selectedConfidentiality,
    tag,
    author,
    documentTypes,
    folders,
  ]);

  return (
    <div className="space-y-6 text-right pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>جستجوی پیشرفته و کاوش هوشمند اسناد</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          ترکیب شرایط چندگانه جستجو در متن کامل، فیلترهای سریع تاریخی، فرمت فایل و سطوح طبقه‌بندی
        </p>
      </div>

      {/* QUICK FILTERS CARD (بخش فیلترهای سریع) */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Section title & Quick presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
              فیلترهای سریع (Quick Filters)
            </h2>
            <span className="text-[11px] text-slate-400">
              · کلیک جهت پالایش آنی مدارک بایگانی
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] text-slate-400 font-medium">الگوهای متداول:</span>
            <button
              onClick={() => applyPreset('contracts')}
              className="px-2.5 py-1 text-[11px] bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              قراردادهای جاری
            </button>
            <button
              onClick={() => applyPreset('confidential')}
              className="px-2.5 py-1 text-[11px] bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              اسناد محرمانه
            </button>
            <button
              onClick={() => applyPreset('letters')}
              className="px-2.5 py-1 text-[11px] bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              مکاتبات اداری
            </button>
            <button
              onClick={() => applyPreset('recent')}
              className="px-2.5 py-1 text-[11px] bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              اسناد ماه جاری
            </button>
          </div>
        </div>

        {/* 1. Date Range Quick Filters (فیلتر سریع بازه زمانی) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
              <span>بازه تاریخی ثبت و صدور:</span>
            </span>
            {dateRange !== 'all' && (
              <button
                onClick={() => setDateRange('all')}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                حذف فیلتر تاریخ
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {dateOptions.map((opt) => {
              const isActive = dateRange === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setDateRange(opt.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Custom Date Range Inputs if "custom" selected */}
          {dateRange === 'custom' && (
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">از تاریخ:</span>
                <input
                  type="text"
                  placeholder="مثال: ۱۴۰۳/۰۴/۰۱"
                  value={customFromDate}
                  onChange={(e) => setCustomFromDate(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono w-28 text-center"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">تا تاریخ:</span>
                <input
                  type="text"
                  placeholder="مثال: ۱۴۰۳/۰۷/۳۰"
                  value={customToDate}
                  onChange={(e) => setCustomToDate(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono w-28 text-center"
                />
              </div>
              <span className="text-[11px] text-slate-400">
                (فرمت: سال/ماه/روز به عنوان مثال ۱۴۰۳/۰۶/۱۵)
              </span>
            </div>
          )}
        </div>

        {/* 2. File Format Quick Filters (فیلتر سریع فرمت فایل) */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileType className="w-3.5 h-3.5 text-indigo-500" />
              <span>فرمت و نوع فایل:</span>
            </span>
            {formatPreset !== 'all' && (
              <button
                onClick={() => setFormatPreset('all')}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                حذف فیلتر فرمت
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {formatOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = formatPreset === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFormatPreset(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Summary Strip */}
        {activeFilters.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-medium text-[11px]">فیلترهای فعال:</span>
              {activeFilters.map((af) => (
                <span
                  key={af.key}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-900"
                >
                  <span>{af.label}</span>
                  <button
                    onClick={af.onRemove}
                    className="p-0.5 text-indigo-400 hover:text-indigo-700 dark:hover:text-white"
                    title="حذف این فیلتر"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <button
              onClick={handleReset}
              className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 mr-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>پاکسازی همه فیلترها</span>
            </button>
          </div>
        )}
      </div>

      {/* FILTER PARAMETERS FORM CARD (تنظیم پارامترهای تفصیلی) */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>تنظیم پارامترهای جستجوی متنی و شاخص‌های متادیتا</span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی فرم</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Keyword in full text */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              کلمه کلیدی در متن، عنوان یا متادیتا
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="مثال: سرور، تجهیزات، بیمه، حسابرسی..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* Document Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              شماره اندیکاتور یا کد سند
            </label>
            <input
              type="text"
              placeholder="مثال: CNT-1403 یا ف-۸۸۲۹۱"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white font-mono"
            />
          </div>

          {/* Folder */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              پوشه و بخش مربوطه
            </label>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            >
              <option value="all">تمام پوشه‌ها و بایگانی‌ها</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              نوع و الگوی سند
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            >
              <option value="all">همه انواع (قرارداد، فاکتور، نامه و...)</option>
              {documentTypes.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.nameFa}
                </option>
              ))}
            </select>
          </div>

          {/* Confidentiality */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              سطح طبقه‌بندی امنیتی
            </label>
            <select
              value={selectedConfidentiality}
              onChange={(e) => setSelectedConfidentiality(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            >
              <option value="all">همه سطوح</option>
              <option value="normal">عادی و عمومی</option>
              <option value="confidential">محرمانه</option>
              <option value="secret">به‌کلی سری</option>
            </select>
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              کاربر ثبت‌کننده یا امضاکننده
            </label>
            <input
              type="text"
              placeholder="مثال: شریفی، بهرامی..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>

          {/* Tag */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              برچسب موضوعی (#Tag)
            </label>
            <input
              type="text"
              placeholder="مثال: سرور، مالیات..."
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              نتایج تطبیق یافته
            </h3>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold tabular-nums">
              {searchResults.length} سند
            </span>
          </div>
          <span className="text-xs text-slate-400">
            جستجو بر اساس الگوریتم دقیق اندیس‌های متنی و فیلترهای اعمال‌شده
          </span>
        </div>

        {searchResults.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
            <Search className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">نتیجه‌ای با شرایط درخواستی شما یافت نشد.</p>
            <p className="text-[11px] text-slate-400">
              توصیه می‌شود فیلتر بازه زمانی، فرمت یا کلمه کلیدی را تغییر دهید یا دکمه بازنشانی را بفشارید.
            </p>
            <button
              onClick={handleReset}
              className="mt-2 px-3 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              پاکسازی فیلترها و نمایش همه اسناد
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((doc) => (
              <div
                key={doc.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-700 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-indigo-600 flex items-center justify-center shrink-0">
                        {doc.extension.toUpperCase()}
                      </span>
                      <div>
                        <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold block">
                          {doc.documentNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 block">{doc.folderName}</span>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[11px] text-slate-500 font-medium font-mono tabular-nums block">
                        {doc.createdAt}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono tabular-nums block">
                        {doc.size}
                      </span>
                    </div>
                  </div>

                  <h4
                    onClick={() => setSelectedDocForPreview(doc)}
                    className="text-xs font-bold text-slate-900 dark:text-white mt-3 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2"
                  >
                    {doc.title}
                  </h4>

                  {doc.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {doc.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">ثبت: {doc.author}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDocForPreview(doc)}
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg font-medium transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>مشاهده سند</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
