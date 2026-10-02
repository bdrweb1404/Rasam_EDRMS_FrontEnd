import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, FolderInput, Folder } from 'lucide-react';
import { DocumentItem } from '../../types';

interface MoveDocumentModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const MoveDocumentModal: React.FC<MoveDocumentModalProps> = ({ document: doc, onClose }) => {
  const { folders, moveDocument } = useApp();
  const [selectedFolderId, setSelectedFolderId] = useState(doc?.folderId || folders[0]?.id || '');

  if (!doc) return null;

  const handleConfirmMove = () => {
    if (selectedFolderId && selectedFolderId !== doc.folderId) {
      moveDocument(doc.id, selectedFolderId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-right">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FolderInput className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">انتقال سند به پوشه</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            سند انتخاب شده: <span className="font-bold text-slate-900 dark:text-white">{doc.title}</span>
          </p>
          <p className="text-xs text-slate-500">
            موقعیت فعلی: <span className="font-semibold">{doc.folderName}</span>
          </p>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              پوشه مقصد جدید را انتخاب نمایید:
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50/50 dark:bg-slate-800/30">
              {folders.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFolderId(f.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors ${
                    selectedFolderId === f.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className={`w-4 h-4 ${selectedFolderId === f.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{f.parentId ? '└─ ' : ''}{f.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                    {f.documentCount} سند
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            انصراف
          </button>
          <button
            onClick={handleConfirmMove}
            disabled={selectedFolderId === doc.folderId}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs"
          >
            تایید انتقال
          </button>
        </div>
      </div>
    </div>
  );
};
