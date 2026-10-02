import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, FolderPlus } from 'lucide-react';
import { FolderItem } from '../../types';

interface FolderModalProps {
  editingFolder?: FolderItem | null;
  onClose: () => void;
}

export const FolderModal: React.FC<FolderModalProps> = ({ editingFolder, onClose }) => {
  const { isFolderModalOpen, folders, addFolder, updateFolder, folderModalParentId } = useApp();

  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingFolder) {
      setName(editingFolder.name);
      setParentId(editingFolder.parentId);
      setDescription(editingFolder.description || '');
    } else {
      setName('');
      setParentId(folderModalParentId);
      setDescription('');
    }
  }, [editingFolder, folderModalParentId]);

  if (!isFolderModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingFolder) {
      updateFolder(editingFolder.id, name.trim(), description.trim());
    } else {
      addFolder(name.trim(), parentId, description.trim());
    }
    onClose();
  };

  const rootFolders = folders.filter((f) => f.id !== editingFolder?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-right">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingFolder ? 'ویرایش پوشه' : 'ایجاد پوشه جدید'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              نام پوشه <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="مثال: قراردادهای فناوری اطلاعات"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              پوشه والد (سطح ریشه یا زیرمجموعه)
            </label>
            <select
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value ? e.target.value : null)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
            >
              <option value="">(سطح ریشه / بدون والد)</option>
              {rootFolders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.parentId ? '└─ ' : ''}{f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              توضیحات و کاربرد پوشه
            </label>
            <textarea
              rows={2}
              placeholder="شرح کوتاه درباره مدارک و اسنادی که در این پوشه قرار می‌گیرند..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              {editingFolder ? 'بروزرسانی پوشه' : 'ایجاد پوشه'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
