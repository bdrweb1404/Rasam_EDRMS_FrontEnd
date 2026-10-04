import React from 'react';
import { AlertTriangle, Trash2, X, FileText, ShieldAlert } from 'lucide-react';
import { DocumentItem } from '../../types';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  document: DocumentItem | null;
  bulkCount?: number;
  onConfirm: () => void;
  onCancel: () => void;
  isBulk?: boolean;
  mode?: 'permanent' | 'trash';
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  document: doc,
  bulkCount = 0,
  onConfirm,
  onCancel,
  isBulk = false,
  mode = 'permanent',
}) => {
  if (!isOpen) return null;

  const isPermanent = mode === 'permanent';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in select-none"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-rose-200 dark:border-rose-950 p-6 text-right overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
      >
        {/* Subtle red/amber accent bar at top */}
        <div
          className={`absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-l ${
            isPermanent ? 'from-rose-500 to-rose-600' : 'from-amber-500 to-rose-500'
          }`}
        />

        {/* Header with warning icon */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isPermanent
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="confirm-delete-title"
                className="text-sm font-bold text-slate-900 dark:text-white"
              >
                {isPermanent
                  ? isBulk
                    ? `تأیید حذف نهایی ${bulkCount} سند`
                    : 'تأیید حذف نهایی و قطعی سند'
                  : isBulk
                  ? `تأیید انتقال ${bulkCount} سند به سطل زباله`
                  : 'تأیید حذف سند و انتقال به سطل زباله'}
              </h3>
              <p
                className={`text-[11px] font-medium mt-0.5 flex items-center gap-1 ${
                  isPermanent
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>
                  {isPermanent
                    ? 'این عملیات دائمی و غیرقابل بازگشت است'
                    : 'سند به سطل زباله منتقل شده و تا ۳۰ روز قابل بازیابی است'}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explanatory notice */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
          {isPermanent
            ? isBulk
              ? `آیا از حذف دائمی و قطعی این ${bulkCount} سند اطمینان دارید؟ با تایید این عملیات، فایل‌ها و تمام نسخه‌های تاریخی و رکوردهای متادیتای مرتبط از سرور پاکسازی خواهند شد.`
              : 'آیا از حذف دائمی و قطعی این سند از سرور و پایگاه داده اطمینان کامل دارید؟ پس از حذف، دسترسی به این فایل و سابقه نسخه‌های آن تحت هیچ شرایطی امکان‌پذیر نخواهد بود.'
            : isBulk
            ? `آیا از انتقال این ${bulkCount} سند به سطل زباله اطمینان دارید؟ اسناد منتقل‌شده در مخزن اسناد فعال نمایش داده نخواهند شد.`
            : 'آیا از حذف این سند و انتقال آن به سطل زباله اطمینان دارید؟ می‌توانید در صورت نیاز در آینده آن را از سطل زباله بازیابی نمایید.'}
        </p>

        {/* Document Details Card (if single doc) */}
        {!isBulk && doc && (
          <div className="mt-3.5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                {doc.extension.toUpperCase()}
              </span>
              <span className="font-bold text-slate-900 dark:text-white truncate">
                {doc.title}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                {doc.documentNumber}
              </span>
              <span className="font-mono tabular-nums">
                {doc.size} · نسخه {doc.version}
              </span>
              <span>پوشه: {doc.folderName}</span>
            </div>
          </div>
        )}

        {/* Actions buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            انصراف و بازگشت
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-colors ${
              isPermanent
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>
              {isPermanent
                ? 'بله، برای همیشه حذف شود'
                : isBulk
                ? `بله، انتقال ${bulkCount} سند به سطل زباله`
                : 'بله، انتقال به سطل زباله'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
