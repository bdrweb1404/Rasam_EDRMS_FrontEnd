import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderTree,
  FolderPlus,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronLeft,
  Edit2,
  Trash2,
  Files,
  HardDrive,
  Eye,
  Shield,
  Clock,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { FolderItem, DocumentItem } from '../types';

interface FoldersPageProps {
  onOpenFolderModal: (folder?: FolderItem | null, parentId?: string | null) => void;
  onOpenMoveModal: (doc: DocumentItem) => void;
}

export const FoldersPage: React.FC<FoldersPageProps> = ({
  onOpenFolderModal,
  onOpenMoveModal,
}) => {
  const {
    folders,
    documents,
    deleteFolder,
    setSelectedDocForPreview,
    setIsUploadModalOpen,
  } = useApp();

  // Currently selected folder in tree
  const [selectedFolderId, setSelectedFolderId] = useState<string>(folders[0]?.id || 'f-1');

  // Expanded folders in tree
  const [expandedIds, setExpandedIds] = useState<string[]>(['f-1', 'f-2']);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedFolder = folders.find((f) => f.id === selectedFolderId) || folders[0];

  // Documents inside selected folder
  const folderDocuments = documents.filter(
    (d) => d.folderId === selectedFolder?.id && d.status === 'active'
  );

  // Tree representation (Root folders and their children)
  const rootFolders = folders.filter((f) => !f.parentId);
  const getSubFolders = (parentId: string) => folders.filter((f) => f.parentId === parentId);

  const handleDeleteFolder = (folderId: string) => {
    if (confirm('آیا از حذف این پوشه اطمینان دارید؟')) {
      const success = deleteFolder(folderId);
      if (success && selectedFolderId === folderId) {
        setSelectedFolderId(folders[0]?.id || '');
      }
    }
  };

  return (
    <div className="space-y-6 text-right pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>مدیریت پوشه‌ها و ساختار درختی بایگانی</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            سازماندهی سلسله‌مراتبی اسناد سازمانی و کنترل دسترسی بر اساس پوشه
          </p>
        </div>

        <button
          onClick={() => onOpenFolderModal(null, null)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          <span>ایجاد پوشه ریشه جدید</span>
        </button>
      </div>

      {/* Main Grid: Tree View Column (Right) & Selected Folder Details (Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree View Navigation (1 col) */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              درخت دایرکتوری‌های سازمانی
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {folders.length} پوشه
            </span>
          </div>

          <div className="space-y-1">
            {rootFolders.map((root) => {
              const children = getSubFolders(root.id);
              const isExpanded = expandedIds.includes(root.id);
              const isSelected = selectedFolderId === root.id;

              return (
                <div key={root.id} className="space-y-0.5">
                  <div
                    onClick={() => setSelectedFolderId(root.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800/80'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {children.length > 0 ? (
                        <button
                          onClick={(e) => toggleExpand(root.id, e)}
                          className="p-0.5 text-slate-400 hover:text-slate-600"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronLeft className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ) : (
                        <span className="w-4" />
                      )}

                      {isExpanded ? (
                        <FolderOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                      ) : (
                        <Folder className="w-4 h-4 text-indigo-500 shrink-0" />
                      )}
                      <span className="truncate">{root.name}</span>
                    </div>

                    <span className="text-[10px] font-mono tabular-nums text-slate-400">
                      {root.documentCount}
                    </span>
                  </div>

                  {/* Sub-folders */}
                  {isExpanded && children.length > 0 && (
                    <div className="pr-6 space-y-0.5 border-r border-slate-200 dark:border-slate-800 mr-3 mt-0.5">
                      {children.map((sub) => {
                        const isSubSelected = selectedFolderId === sub.id;
                        return (
                          <div
                            key={sub.id}
                            onClick={() => setSelectedFolderId(sub.id)}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                              isSubSelected
                                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{sub.name}</span>
                            </div>
                            <span className="text-[10px] font-mono tabular-nums text-slate-400">
                              {sub.documentCount}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Folder Details & Documents List (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Folder Information Card */}
          {selectedFolder && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedFolder.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedFolder.description || 'بدون توضیحات ثبت شده'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenFolderModal(null, selectedFolder.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-400" />
                    <span>زیرپوشه جدید</span>
                  </button>

                  <button
                    onClick={() => onOpenFolderModal(selectedFolder, selectedFolder.parentId)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="ویرایش پوشه"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteFolder(selectedFolder.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="حذف پوشه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Folder metadata summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">اسناد موجود</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                    {folderDocuments.length} پرونده
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">فضای اشغال شده</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                    {selectedFolder.totalSize}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">تاریخ ایجاد</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                    {selectedFolder.createdAt}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">سطح دسترسی مجاز</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedFolder.permissions.join('، ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Documents inside this folder */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                اسناد موجود در این پوشه ({folderDocuments.length})
              </h3>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>+ آپلود سند در این پوشه</span>
              </button>
            </div>

            {folderDocuments.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                این پوشه خالی است. می‌توانید سند جدیدی در آن بارگذاری کنید.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {folderDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-indigo-600 flex items-center justify-center shrink-0">
                        {doc.extension.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p
                          onClick={() => setSelectedDocForPreview(doc)}
                          className="text-xs font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-indigo-600"
                        >
                          {doc.title}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-mono">{doc.documentNumber}</span>
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
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="مشاهده سند"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenMoveModal(doc)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="انتقال به پوشه دیگر"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
