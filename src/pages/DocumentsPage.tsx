import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Download,
  Trash2,
  FolderInput,
  Eye,
  SlidersHorizontal,
  LayoutGrid,
  List,
  UploadCloud,
  FileText,
  FileCheck,
  Shield,
  Tag,
  ArrowUpDown,
  RotateCcw,
  CheckSquare,
  Square,
  Folder,
} from 'lucide-react';
import { DocumentItem, DocumentType, ConfidentialityLevel } from '../types';

interface DocumentsPageProps {
  onOpenMoveModal: (doc: DocumentItem) => void;
  isTrashView?: boolean;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  onOpenMoveModal,
  isTrashView = false,
}) => {
  const {
    documents,
    folders,
    documentTypes,
    setSelectedDocForPreview,
    setIsUploadModalOpen,
    trashDocument,
    restoreDocument,
    deletePermanently,
    batchTrashDocuments,
    addToast,
    navigateTo,
  } = useApp();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedConfidentiality, setSelectedConfidentiality] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'size' | 'downloadCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Selected document IDs for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filtered and sorted documents
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        if (isTrashView) {
          if (doc.status !== 'trash') return false;
        } else {
          if (doc.status !== 'active') return false;
        }

        // Search text in title, doc number, tags, author, content
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = doc.title.toLowerCase().includes(q);
          const matchNum = doc.documentNumber.toLowerCase().includes(q);
          const matchTags = doc.tags.some((t) => t.toLowerCase().includes(q));
          const matchAuthor = doc.author.toLowerCase().includes(q);
          const matchDept = doc.department.toLowerCase().includes(q);
          if (!matchTitle && !matchNum && !matchTags && !matchAuthor && !matchDept) {
            return false;
          }
        }

        // Folder filter
        if (selectedFolder !== 'all' && doc.folderId !== selectedFolder) {
          return false;
        }

        // Type filter
        if (selectedType !== 'all' && doc.type !== selectedType) {
          return false;
        }

        // Confidentiality filter
        if (selectedConfidentiality !== 'all' && doc.confidentiality !== selectedConfidentiality) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy];
        let valB: any = b[sortBy];

        if (sortBy === 'createdAt') {
          return sortOrder === 'desc'
            ? b.createdAt.localeCompare(a.createdAt)
            : a.createdAt.localeCompare(b.createdAt);
        }

        if (sortBy === 'title') {
          return sortOrder === 'desc'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        }

        if (sortBy === 'downloadCount') {
          return sortOrder === 'desc' ? b.downloadCount - a.downloadCount : a.downloadCount - b.downloadCount;
        }

        return 0;
      });
  }, [
    documents,
    isTrashView,
    searchTerm,
    selectedFolder,
    selectedType,
    selectedConfidentiality,
    sortBy,
    sortOrder,
  ]);

  // Paginated items
  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / pageSize));
  const paginatedDocs = filteredDocuments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedDocs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedDocs.map((d) => d.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkTrash = () => {
    if (selectedIds.length === 0) return;
    batchTrashDocuments(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkDownload = () => {
    if (selectedIds.length === 0) return;
    addToast('دانلود دسته‌جمعی', `دانلود بسته فشرده ${selectedIds.length} سند آغاز شد.`, 'info');
    setSelectedIds([]);
  };

  const confidentialityLabels: Record<ConfidentialityLevel, { label: string; badgeClass: string }> = {
    normal: { label: 'عادی', badgeClass: 'text-slate-600 dark:text-slate-400' },
    confidential: { label: 'محرمانه', badgeClass: 'text-amber-600 dark:text-amber-400 font-semibold' },
    secret: { label: 'به‌کلی سری', badgeClass: 'text-rose-600 dark:text-rose-400 font-bold' },
  };

  return (
    <div className="space-y-5 text-right pb-12">
      {/* Top Header & Breadcrumbs / View switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {isTrashView ? 'سطل زباله و اسناد منسوخ' : 'مخزن و مدیریت اسناد بایگانی'}
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 tabular-nums">
              {filteredDocuments.length} سند
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isTrashView
              ? 'اسناد موجود در این بخش تا ۳۰ روز قابل بازیابی هستند و پس از آن امحا می‌گردند.'
              : 'فهرست کلیه اسناد رسمی با قابلیت فیلتر ترکیبی، مرتب‌سازی و کنترل نسخه‌ها'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isTrashView ? (
            <button
              onClick={() => navigateTo('documents')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <span>بازگشت به اسناد فعال</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigateTo('trash')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span>سطل زباله</span>
              </button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                <span>بارگذاری سند</span>
              </button>
            </>
          )}

          {/* Grid vs Table view toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="نمایش جدولی"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="نمایش کارتی"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو در عنوان، شماره سند، برچسب..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>

          {/* Folder filter */}
          <div>
            <select
              value={selectedFolder}
              onChange={(e) => {
                setSelectedFolder(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            >
              <option value="all">همه پوشه‌ها</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.parentId ? '└─ ' : ''}{f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            >
              <option value="all">همه انواع سند</option>
              {documentTypes.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.nameFa}
                </option>
              ))}
            </select>
          </div>

          {/* Confidentiality filter */}
          <div>
            <select
              value={selectedConfidentiality}
              onChange={(e) => {
                setSelectedConfidentiality(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
            >
              <option value="all">همه سطوح محرمانگی</option>
              <option value="normal">عادی / عمومی</option>
              <option value="confidential">محرمانه</option>
              <option value="secret">به‌کلی سری</option>
            </select>
          </div>
        </div>

        {/* Sort & Bulk Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Bulk actions bar if items are selected */}
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {selectedIds.length} سند انتخاب شده:
              </span>
              {!isTrashView && (
                <button
                  onClick={handleBulkTrash}
                  className="px-2.5 py-1 text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>انتقال به سطل زباله</span>
                </button>
              )}
              <button
                onClick={handleBulkDownload}
                className="px-2.5 py-1 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود بسته فشرده</span>
              </button>
            </div>
          ) : (
            <div className="text-slate-400">
              با استفاده از چک‌باکس‌ها می‌توانید عملیات گروهی روی اسناد انجام دهید.
            </div>
          )}

          {/* Sort order selector */}
          <div className="flex items-center gap-2 mr-auto">
            <span className="text-slate-400">مرتب‌سازی:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
            >
              <option value="createdAt">تاریخ ثبت</option>
              <option value="title">عنوان سند</option>
              <option value="downloadCount">تعداد دانلود</option>
            </select>
            <button
              onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              title={sortOrder === 'desc' ? 'نزولی' : 'صعودی'}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 w-10 text-center">
                    <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-600">
                      {selectedIds.length === paginatedDocs.length && paginatedDocs.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">عنوان و مشخصات سند</th>
                  <th className="py-3.5 px-4">شماره سند</th>
                  <th className="py-3.5 px-4">پوشه</th>
                  <th className="py-3.5 px-4">نوع سند</th>
                  <th className="py-3.5 px-4">سطح محرمانگی</th>
                  <th className="py-3.5 px-4">حجم / نسخه</th>
                  <th className="py-3.5 px-4">تاریخ ثبت</th>
                  <th className="py-3.5 px-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedDocs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      سندی مطابق با فیلترهای جستجو یافت نشد.
                    </td>
                  </tr>
                ) : (
                  paginatedDocs.map((doc) => {
                    const isSelected = selectedIds.includes(doc.id);
                    return (
                      <tr
                        key={doc.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                          isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleSelectOne(doc.id)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Title & tags */}
                        <td className="py-3 px-4 min-w-[240px]">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              {doc.extension.toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p
                                onClick={() => setSelectedDocForPreview(doc)}
                                className="font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-indigo-600 transition-colors"
                              >
                                {doc.title}
                              </p>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                                <span>ثبت: {doc.author}</span>
                                {doc.tags.slice(0, 2).map((t) => (
                                  <span key={t} className="text-slate-500">
                                    · #{t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Doc Number */}
                        <td className="py-3 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                          {doc.documentNumber}
                        </td>

                        {/* Folder */}
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 truncate max-w-[140px]">
                          {doc.folderName}
                        </td>

                        {/* Type */}
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {documentTypes.find((t) => t.type === doc.type)?.nameFa || doc.type}
                        </td>

                        {/* Confidentiality */}
                        <td className="py-3 px-4">
                          <span className={confidentialityLabels[doc.confidentiality].badgeClass}>
                            {confidentialityLabels[doc.confidentiality].label}
                          </span>
                        </td>

                        {/* Size & Version */}
                        <td className="py-3 px-4 font-mono text-[11px] tabular-nums text-slate-500">
                          <span>{doc.size}</span>
                          <span className="text-slate-400 mr-1.5">v{doc.version}</span>
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 text-slate-500 tabular-nums">
                          {doc.createdAt}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedDocForPreview(doc)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="مشاهده آنلاین سند"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {!isTrashView ? (
                              <>
                                <button
                                  onClick={() => onOpenMoveModal(doc)}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="انتقال به پوشه دیگر"
                                >
                                  <FolderInput className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => trashDocument(doc.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                  title="انتقال به سطل زباله"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => restoreDocument(doc.id)}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                                  title="بازیابی سند"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deletePermanently(doc.id)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                                  title="حذف قطعی"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-700 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    {doc.extension.toUpperCase()}
                  </div>
                  <span className={`text-[11px] ${confidentialityLabels[doc.confidentiality].badgeClass}`}>
                    {confidentialityLabels[doc.confidentiality].label}
                  </span>
                </div>

                <h3
                  onClick={() => setSelectedDocForPreview(doc)}
                  className="font-bold text-xs text-slate-900 dark:text-white mt-3 line-clamp-2 cursor-pointer hover:text-indigo-600"
                >
                  {doc.title}
                </h3>

                <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                  <p className="font-mono text-indigo-600 dark:text-indigo-400">{doc.documentNumber}</p>
                  <p className="truncate">پوشه: {doc.folderName}</p>
                  <p>ثبت: {doc.author}</p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono tabular-nums text-slate-400 text-[11px]">
                  {doc.size} · v{doc.version}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedDocForPreview(doc)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      addToast('دانلود فایل', `فایل «${doc.title}» دریافت شد.`, 'info');
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
        <span>
          نمایش صفحه {currentPage} از {totalPages} (مجموع {filteredDocuments.length} سند)
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
          >
            صفحه قبل
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
          >
            صفحه بعد
          </button>
        </div>
      </div>
    </div>
  );
};
