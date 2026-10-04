import React, { useState, useEffect } from 'react';
import { Tag, X, Plus, Check, Sparkles, AlertCircle } from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentTagsModalProps {
  isOpen: boolean;
  document: DocumentItem | null;
  bulkDocuments?: DocumentItem[];
  isBulk?: boolean;
  onSave: (tags: string[]) => void;
  onClose: () => void;
}

// Preset recommended organizational tags with visual color schemes
export const PRESET_TAGS = [
  {
    name: 'محرمانه',
    en: 'Confidential',
    colorClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900',
    dotClass: 'bg-rose-500',
  },
  {
    name: 'فوری',
    en: 'Urgent',
    colorClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900',
    dotClass: 'bg-amber-500',
  },
  {
    name: 'پیش‌نویس',
    en: 'Draft',
    colorClass: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    dotClass: 'bg-slate-400',
  },
  {
    name: 'تایید شده',
    en: 'Approved',
    colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900',
    dotClass: 'bg-emerald-500',
  },
  {
    name: 'مهم',
    en: 'Important',
    colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900',
    dotClass: 'bg-indigo-500',
  },
  {
    name: 'اقدام لازم',
    en: 'Action Required',
    colorClass: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-900',
    dotClass: 'bg-orange-500',
  },
];

// Helper to determine style of any tag
export const getTagStyle = (tagName: string) => {
  const match = PRESET_TAGS.find(
    (p) => p.name === tagName || p.en.toLowerCase() === tagName.toLowerCase()
  );
  if (match) return match;
  return {
    name: tagName,
    en: tagName,
    colorClass:
      'bg-indigo-50/70 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/60',
    dotClass: 'bg-indigo-500',
  };
};

export const DocumentTagsModal: React.FC<DocumentTagsModalProps> = ({
  isOpen,
  document: doc,
  bulkDocuments = [],
  isBulk = false,
  onSave,
  onClose,
}) => {
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  useEffect(() => {
    if (doc) {
      setCurrentTags([...doc.tags]);
    } else if (isBulk) {
      // Find common tags across selected docs or start clean
      setCurrentTags([]);
    }
  }, [doc, isBulk]);

  if (!isOpen) return null;

  const handleTogglePreset = (tagName: string) => {
    if (currentTags.includes(tagName)) {
      setCurrentTags(currentTags.filter((t) => t !== tagName));
    } else {
      setCurrentTags([...currentTags, tagName]);
    }
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newTagInput.trim().replace(/^#/, '');
    if (clean && !currentTags.includes(clean)) {
      setCurrentTags([...currentTags, clean]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter((t) => t !== tagToRemove));
  };

  const handleSave = () => {
    onSave(currentTags);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in select-none text-right"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden transition-all space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBulk
                  ? `برچسب‌گذاری گروهی (${bulkDocuments.length} سند)`
                  : 'مدیریت برچسب‌ها و طبقه‌بندی سند'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isBulk
                  ? 'برچسب‌های انتخابی به تمامی اسناد انتخاب‌شده افزوده خواهند شد.'
                  : doc?.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recommended Preset Labels (برچسب‌های پیشنهادی و سازمانی) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>برچسب‌های سازمانی پرکاربرد (یک‌کلیک جهت افزودن/حذف):</span>
          </label>

          <div className="flex flex-wrap gap-2">
            {PRESET_TAGS.map((preset) => {
              const isSelected = currentTags.includes(preset.name);
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleTogglePreset(preset.name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? `${preset.colorClass} shadow-xs font-bold ring-2 ring-indigo-500/20`
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${preset.dotClass}`} />
                  <span>{preset.name}</span>
                  <span className="text-[10px] opacity-60 font-mono">({preset.en})</span>
                  {isSelected && <Check className="w-3 h-3 mr-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active Tags */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              برچسب‌های اختصاص‌یافته فعلی ({currentTags.length}):
            </label>
            {currentTags.length > 0 && (
              <button
                type="button"
                onClick={() => setCurrentTags([])}
                className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline"
              >
                پاکسازی همه
              </button>
            )}
          </div>

          <div className="min-h-[46px] p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center gap-1.5">
            {currentTags.length === 0 ? (
              <span className="text-xs text-slate-400">
                هنوز برچسبی اختصاص نیافته است. از برچسب‌های آماده بالا انتخاب کنید یا در کادر زیر تایپ نمایید.
              </span>
            ) : (
              currentTags.map((tag) => {
                const style = getTagStyle(tag);
                return (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${style.colorClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dotClass}`} />
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="p-0.5 hover:opacity-80 transition-opacity"
                      title="حذف"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })
            )}
          </div>
        </div>

        {/* Custom Tag Input */}
        <form onSubmit={handleAddCustomTag} className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            افزودن برچسب سفارشی دلخواه
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="مثال: قرارداد_فناوری، متمم، بازرسی..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            />
            <button
              type="submit"
              disabled={!newTagInput.trim()}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن</span>
            </button>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 transition-colors"
          >
            ذخیره و اعمال برچسب‌ها
          </button>
        </div>
      </div>
    </div>
  );
};
