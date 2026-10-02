import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  UploadCloud,
  FileCheck,
  Folder,
  Shield,
  FileText,
  Tag,
  AlertCircle,
  Check,
} from 'lucide-react';
import { ConfidentialityLevel, DocumentType } from '../../types';

export const UploadModal: React.FC = () => {
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    folders,
    documentTypes,
    addDocument,
    addToast,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    extension: string;
  } | null>(null);

  const [title, setTitle] = useState('');
  const [folderId, setFolderId] = useState(folders[0]?.id || 'f-1');
  const [docType, setDocType] = useState<DocumentType>('contract');
  const [confidentiality, setConfidentiality] = useState<ConfidentialityLevel>('normal');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [metadataFields, setMetadataFields] = useState<Record<string, string>>({});

  // Uploading animation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isUploadModalOpen) return null;

  const activeTypeConfig = documentTypes.find((dt) => dt.type === docType) || documentTypes[0];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop() || 'pdf';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFile({
        name: file.name,
        size: `${sizeMb} MB`,
        extension: ext.toLowerCase(),
      });
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop() || 'pdf';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFile({
        name: file.name,
        size: `${sizeMb} MB`,
        extension: ext.toLowerCase(),
      });
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      // If no file was picked, provide a simulated standard file
      setSelectedFile({
        name: `${title || 'سند جدید'}.pdf`,
        size: '2.4 MB',
        extension: 'pdf',
      });
    }

    if (!title.trim()) {
      addToast('خطا در ثبت', 'لطفاً عنوان سند را وارد کنید.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            // Finalize upload
            const tags = tagsInput
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);

            addDocument({
              title,
              folderId,
              type: docType,
              confidentiality,
              size: selectedFile ? selectedFile.size : '2.1 MB',
              extension: selectedFile ? selectedFile.extension : 'pdf',
              tags: tags.length > 0 ? tags : ['اسناد جدید'],
              description,
              metadata: metadataFields,
            });

            setIsUploading(false);
            setIsUploadModalOpen(false);
            // Reset
            setSelectedFile(null);
            setTitle('');
            setDescription('');
            setTagsInput('');
            setMetadataFields({});
            setUploadProgress(0);
          }, 350);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              بارگذاری سند جدید در بایگانی
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              فایل مورد نظر را کشیده و رها کنید یا مشخصات آن را تکمیل نمایید.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              selectedFile
                ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20'
                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                    حجم: {selectedFile.size} · فرمت: {selectedFile.extension.toUpperCase()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <UploadCloud className="w-8 h-8 mx-auto text-indigo-500" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  فایل سند را اینجا بکشید یا برای انتخاب کلیک کنید
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  فرمت‌های مجاز: PDF, DOCX, XLSX, JPG, TIFF (حداکثر ۵۰ مگابایت)
                </p>
              </div>
            )}
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              عنوان سند <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: قرارداد تأمین تجهیزات سرورهای پردازشی"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>

          {/* Category & Folder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                پوشه مقصد در بایگانی
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                نوع سند و الگو
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
              >
                {documentTypes.map((dt) => (
                  <option key={dt.type} value={dt.type}>
                    {dt.nameFa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Confidentiality & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                سطح محرمانگی سند
              </label>
              <select
                value={confidentiality}
                onChange={(e) => setConfidentiality(e.target.value as ConfidentialityLevel)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
              >
                <option value="normal">عادی و عمومی</option>
                <option value="confidential">محرمانه (فقط کاربران مجاز)</option>
                <option value="secret">به‌کلی سری (فقط مدیران ارشد)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                برچسب‌ها (با کاما جدا کنید)
              </label>
              <input
                type="text"
                placeholder="مثال: قرارداد، سرور، مالیات"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
              />
            </div>
          </div>

          {/* Dynamic Metadata based on Selected Type */}
          {activeTypeConfig.fields.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                فیلدهای شاخص متادیتا ({activeTypeConfig.nameFa})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTypeConfig.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                      {field.nameFa} {field.required && <span className="text-rose-500">*</span>}
                    </label>
                    {field.type === 'select' && field.options ? (
                      <select
                        value={metadataFields[field.key] || field.options[0]}
                        onChange={(e) =>
                          setMetadataFields({ ...metadataFields, [field.key]: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === 'date' ? 'text' : field.type === 'number' ? 'number' : 'text'}
                        placeholder={field.type === 'date' ? '۱۴۰۳/۰۷/۲۰' : ''}
                        value={metadataFields[field.key] || ''}
                        onChange={(e) =>
                          setMetadataFields({ ...metadataFields, [field.key]: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              خلاصه یا توضیحات تکمیلی
            </label>
            <textarea
              rows={2}
              placeholder="توضیحات کوتاه در مورد موضوع سند..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>

          {/* Progress Bar during uploading */}
          {isUploading && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <span>در حال بارگذاری و پردازش متادیتا...</span>
                <span className="font-mono tabular-nums">{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              {isUploading ? 'در حال ثبت...' : 'بارگذاری و ذخیره در بایگانی'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
