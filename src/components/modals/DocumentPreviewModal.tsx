import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Download,
  Trash2,
  RotateCcw,
  FolderInput,
  History,
  FileText,
  Sliders,
  ShieldAlert,
  Calendar,
  User,
  HardDrive,
  Eye,
  Check,
  Plus,
  ArrowRight,
  Printer,
  Copy,
} from 'lucide-react';
import { ConfidentialityLevel, DocumentItem } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface DocumentPreviewModalProps {
  onOpenMoveModal?: (doc: DocumentItem) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ onOpenMoveModal }) => {
  const {
    selectedDocForPreview,
    setSelectedDocForPreview,
    updateDocumentMetadata,
    trashDocument,
    restoreDocument,
    deletePermanently,
    addDocumentVersion,
    auditLogs,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'preview' | 'metadata' | 'versions' | 'audit'>('preview');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Metadata edit state
  const [editedTitle, setEditedTitle] = useState('');
  const [editedMetadata, setEditedMetadata] = useState<Record<string, string>>({});
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // New version state
  const [isAddingVersion, setIsAddingVersion] = useState(false);
  const [versionSummary, setVersionSummary] = useState('');
  const [versionSize, setVersionSize] = useState('4.5 MB');

  // Zoom level for preview
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!selectedDocForPreview) return null;

  const doc = selectedDocForPreview;

  // Initialize edit fields when doc changes
  const handleOpenMetadataTab = () => {
    setActiveTab('metadata');
    setEditedTitle(doc.title);
    setEditedMetadata({ ...doc.metadata });
    setEditedTags([...doc.tags]);
  };

  const handleSaveMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    updateDocumentMetadata(doc.id, editedMetadata, editedTags, editedTitle);
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !editedTags.includes(newTagInput.trim())) {
      setEditedTags([...editedTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter((t) => t !== tagToRemove));
  };

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionSummary.trim()) {
      addToast('خطا در ثبت نسخه', 'لطفاً شرح تغییرات نسخه جدید را وارد نمایید.', 'error');
      return;
    }
    addDocumentVersion(doc.id, versionSummary, versionSize);
    setVersionSummary('');
    setIsAddingVersion(false);
  };

  const docLogs = auditLogs.filter((l) => l.documentId === doc.id);

  const confidentialityLabels: Record<ConfidentialityLevel, { label: string; color: string }> = {
    normal: { label: 'عادی / عمومی', color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
    confidential: { label: 'محرمانه', color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' },
    secret: { label: 'به‌کلی سری', color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40' },
  };

  const copyDocNumber = () => {
    navigator.clipboard?.writeText(doc.documentNumber);
    addToast('کپی شد', 'شماره سند در حافظه کپی گردید.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-right">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline flex items-center gap-1" onClick={copyDocNumber}>
                <Copy className="w-3.5 h-3.5" />
                {doc.documentNumber}
              </span>
              <span>·</span>
              <span>{doc.folderName}</span>
              <span>·</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${confidentialityLabels[doc.confidentiality].color}`}>
                {confidentialityLabels[doc.confidentiality].label}
              </span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white truncate">
              {doc.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            {onOpenMoveModal && doc.status === 'active' && (
              <button
                onClick={() => onOpenMoveModal(doc)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                title="انتقال به پوشه دیگر"
              >
                <FolderInput className="w-3.5 h-3.5 text-slate-400" />
                <span>انتقال</span>
              </button>
            )}

            <button
              onClick={() => {
                addToast('دریافت فایل', `دانلود سند «${doc.title}» آغاز شد.`, 'success');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود فایل</span>
            </button>

            {doc.status === 'active' ? (
              <button
                onClick={() => trashDocument(doc.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="انتقال به سطل زباله"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => restoreDocument(doc.id)}
                  className="px-2.5 py-1 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>بازیابی</span>
                </button>
                <button
                  onClick={() => setIsConfirmDeleteOpen(true)}
                  className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="حذف دائمی"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedDocForPreview(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-medium shrink-0">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>پیش‌نمایش آنلاین</span>
          </button>

          <button
            onClick={handleOpenMetadataTab}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'metadata'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>متادیتا و مشخصات</span>
          </button>

          <button
            onClick={() => setActiveTab('versions')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'versions'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>تاریخچه نسخه‌ها ({doc.versions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>لاگ بازرسی سند ({docLogs.length})</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/60 dark:bg-slate-950/50">
          {/* TAB 1: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="flex flex-col items-center h-full">
              {/* Zoom & View Controls */}
              <div className="w-full max-w-3xl flex items-center justify-between pb-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>اندازه نمایش:</span>
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 gap-2">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                      className="px-1.5 font-bold hover:text-indigo-600"
                    >
                      -
                    </button>
                    <span className="font-mono tabular-nums">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                      className="px-1.5 font-bold hover:text-indigo-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>فرمت: {doc.extension.toUpperCase()}</span>
                  </span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">{doc.size}</span>
                </div>
              </div>

              {/* Realistic Document Paper Sheet Simulation */}
              <div
                className="w-full max-w-3xl min-h-[640px] bg-white text-slate-900 rounded-xl shadow-md border border-slate-200 p-8 md:p-12 relative flex flex-col justify-between transition-all"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                {/* Official Letterhead / Header */}
                <div className="border-b-2 border-slate-800 pb-4 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        جمهوری اسلامی ایران
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 font-semibold">
                        سامانه جامع مدیریت و بایگانی اسناد الکترونیکی
                      </p>
                      <p className="text-[11px] text-slate-500">واحد سازمانی: {doc.department}</p>
                    </div>
                    <div className="text-left font-mono text-xs text-slate-700 space-y-1">
                      <p>شماره سند: {doc.documentNumber}</p>
                      <p>تاریخ ثبت: {doc.createdAt}</p>
                      <p>نسخه فعال: {doc.version}</p>
                    </div>
                  </div>
                </div>

                {/* Document Body */}
                <div className="flex-1 space-y-4 text-sm leading-relaxed text-slate-800">
                  <h4 className="text-base font-bold text-center text-slate-900 border-b border-dashed border-slate-300 pb-2">
                    {doc.title}
                  </h4>

                  {doc.description && (
                    <p className="text-justify text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs leading-6">
                      {doc.description}
                    </p>
                  )}

                  {doc.contentSnippet && (
                    <div className="text-xs text-slate-600 leading-6 text-justify">
                      <p>{doc.contentSnippet}</p>
                    </div>
                  )}

                  {/* Metadata Summary Grid in Paper */}
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-700 mb-2">اطلاعات ثبتی و فیلدهای شاخص:</p>
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                      {Object.entries(doc.metadata).map(([key, val]) => (
                        <div key={key} className="flex justify-between border-b border-slate-200/50 pb-1">
                          <span className="text-slate-500">{key.replace(/_/g, ' ')}:</span>
                          <span className="font-semibold text-slate-800">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Stamp / Signatures */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
                  <div>
                    <p>ثبت‌کننده: {doc.author}</p>
                    <p className="text-[10px] text-slate-400">شناسه بایگانی: {doc.id}</p>
                  </div>
                  <div className="text-center p-3 border-2 border-dashed border-emerald-600 rounded-lg text-emerald-800 bg-emerald-50/50">
                    <p className="font-bold text-xs">تأییدیه الکترونیکی معتبر</p>
                    <p className="text-[10px]">ممهور به امضای دیجیتال سامانه</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: METADATA & EDIT */}
          {activeTab === 'metadata' && (
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                مشخصات عمومی و فیلدهای سفارشی
              </h3>

              <form onSubmit={handleSaveMetadata} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    عنوان کامل سند
                  </label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      پوشه نگهداری
                    </label>
                    <input
                      type="text"
                      disabled
                      value={doc.folderName}
                      className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      نوع سند
                    </label>
                    <input
                      type="text"
                      disabled
                      value={doc.type}
                      className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                {/* Custom Metadata Fields */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    فیلدهای اختصاصی متادیتا
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(editedMetadata).map(([key, val]) => (
                      <div key={key}>
                        <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                          {key.replace(/_/g, ' ')}
                        </label>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) =>
                            setEditedMetadata({ ...editedMetadata, [key]: e.target.value })
                          }
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags management */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    برچسب‌ها و تگ‌های جستجو
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {editedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-md border border-indigo-100 dark:border-indigo-900/40"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-indigo-400 hover:text-indigo-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="برچسب جدید و اینتر..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1.5 text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-800 dark:text-slate-100"
                    >
                      افزودن
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                  >
                    ذخیره تغییرات متادیتا
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: VERSIONS */}
          {activeTab === 'versions' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    کنترل نسخه‌ها و سابقه تغییرات
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    هرگونه تغییر در محتوای سند به صورت یک نسخه جدید ثبت و غیرقابل بازنویسی می‌شود.
                  </p>
                </div>

                {!isAddingVersion && (
                  <button
                    onClick={() => setIsAddingVersion(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>بارگذاری نسخه جدید</span>
                  </button>
                )}
              </div>

              {/* Add New Version Form */}
              {isAddingVersion && (
                <form
                  onSubmit={handleCreateVersion}
                  className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-900/60 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      ثبت نسخه بعدی
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingVersion(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      شرح تغییرات و علت بروزرسانی
                    </label>
                    <textarea
                      value={versionSummary}
                      onChange={(e) => setVersionSummary(e.target.value)}
                      placeholder="مثال: اعمال نظرات واحد حقوقی در بند نحوه پرداخت..."
                      rows={2}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>حجم فایل جدید:</span>
                      <input
                        type="text"
                        value={versionSize}
                        onChange={(e) => setVersionSize(e.target.value)}
                        className="w-20 px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                    >
                      ثبت و ذخیره نسخه
                    </button>
                  </div>
                </form>
              )}

              {/* Versions Timeline List */}
              <div className="space-y-3">
                {doc.versions.map((ver, idx) => (
                  <div
                    key={ver.version}
                    className={`p-4 bg-white dark:bg-slate-900 rounded-xl border transition-colors ${
                      idx === 0
                        ? 'border-indigo-300 dark:border-indigo-900/80 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">
                            نسخه {ver.version}
                          </span>
                          {idx === 0 && (
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-semibold">
                              نسخه جاری
                            </span>
                          )}
                          <span className="text-slate-400">·</span>
                          <span className="text-xs text-slate-500 tabular-nums">{ver.updatedAt}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-xs text-slate-500">{ver.updatedBy}</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                          {ver.changeSummary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono text-slate-400 tabular-nums">{ver.size}</span>
                        <button
                          onClick={() => {
                            addToast('دانلود نسخه', `دانلود نسخه ${ver.version} سند آغاز شد.`, 'info');
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="دانلود این نسخه"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="max-w-3xl mx-auto space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                ردپای فعالیت‌ها و تغییرات اختصاصی این سند
              </h3>

              {docLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  هنوز رویدادی برای این سند ثبت نشده است.
                </div>
              ) : (
                <div className="space-y-2">
                  {docLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {log.actionFa}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{log.userName}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-400 font-mono">{log.ip}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {log.details}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal before permanent deletion */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        document={doc}
        onConfirm={() => {
          setIsConfirmDeleteOpen(false);
          deletePermanently(doc.id);
        }}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </div>
  );
};
