import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DocumentItem,
  FolderItem,
  UserItem,
  AuditLogItem,
  DocumentTypeConfig,
  ToastMessage,
  PageRoute,
  DocumentType,
  ConfidentialityLevel,
  UserRole,
} from '../types';
import {
  initialDocuments,
  initialFolders,
  initialUsers,
  initialAuditLogs,
  initialDocumentTypes,
} from '../data/mockData';

interface SystemSettings {
  systemTitle: string;
  orgName: string;
  maxUploadSizeMb: number;
  allowedExtensions: string[];
  retentionPolicyEnabled: boolean;
  autoArchiveAfterYears: number;
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  auditLogRetentionDays: number;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentPage: PageRoute;
  navigateTo: (page: PageRoute) => void;
  currentUser: UserItem | null;
  login: (username: string, role?: UserRole) => boolean;
  logout: () => void;
  
  // Documents
  documents: DocumentItem[];
  addDocument: (docData: {
    title: string;
    folderId: string;
    type: DocumentType;
    confidentiality: ConfidentialityLevel;
    size: string;
    extension: string;
    tags: string[];
    description: string;
    metadata: Record<string, string>;
  }) => void;
  updateDocumentMetadata: (id: string, metadata: Record<string, string>, tags: string[], title?: string) => void;
  trashDocument: (id: string) => void;
  restoreDocument: (id: string) => void;
  deletePermanently: (id: string) => void;
  moveDocument: (docId: string, targetFolderId: string) => void;
  batchTrashDocuments: (ids: string[]) => void;
  addDocumentVersion: (docId: string, summary: string, newSize: string) => void;

  // Folders
  folders: FolderItem[];
  addFolder: (name: string, parentId: string | null, description: string) => void;
  updateFolder: (id: string, name: string, description: string) => void;
  deleteFolder: (id: string) => boolean;

  // Users
  users: UserItem[];
  addUser: (userData: Omit<UserItem, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateUser: (id: string, userData: Partial<UserItem>) => void;
  toggleUserStatus: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLogItem[];
  addLog: (
    action: AuditLogItem['action'],
    actionFa: string,
    documentId?: string,
    documentTitle?: string,
    details?: string,
    status?: 'success' | 'warning' | 'error'
  ) => void;

  // Document Types & Schema
  documentTypes: DocumentTypeConfig[];
  updateDocumentTypeRetention: (type: DocumentType, years: number) => void;

  // Modals & Drawers
  selectedDocForPreview: DocumentItem | null;
  setSelectedDocForPreview: (doc: DocumentItem | null) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isFolderModalOpen: boolean;
  setIsFolderModalOpen: (open: boolean) => void;
  folderModalParentId: string | null;
  setFolderModalParentId: (id: string | null) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // System Settings
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
}

const THEME_STORAGE_KEY = 'theme';
const BACKUP_THEME_STORAGE_KEY = 'edms-theme';

const getInitialTheme = (): 'light' | 'dark' => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(BACKUP_THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch (err) {
    console.warn('Unable to read theme from localStorage:', err);
  }

  try {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (err) {
    // ignore
  }

  return 'light';
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state initialized from localStorage with system preference fallback
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  // Persist theme to localStorage and apply classes to root DOM elements
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem(BACKUP_THEME_STORAGE_KEY, theme);
    } catch (err) {
      console.warn('Unable to persist theme to localStorage:', err);
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Synchronize theme across browser tabs and sessions in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY || e.key === BACKUP_THEME_STORAGE_KEY) {
        if (e.newValue === 'dark' || e.newValue === 'light') {
          setTheme(e.newValue);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      addToast(
        next === 'dark' ? 'حالت شب فعال شد' : 'حالت روز فعال شد',
        next === 'dark' ? 'تم سامانه به حالت تیره تغییر یافت.' : 'تم سامانه به حالت روشن تغییر یافت.',
        'info'
      );
      return next;
    });
  };

  // Routing
  const [currentPage, setCurrentPage] = useState<PageRoute>('dashboard');

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth User
  const [currentUser, setCurrentUser] = useState<UserItem | null>(() => initialUsers[0]);

  const login = (username: string, role: UserRole = 'admin') => {
    const found = initialUsers.find((u) => u.username.toLowerCase() === username.toLowerCase()) || {
      ...initialUsers[0],
      username,
      role,
      roleTitleFa: role === 'admin' ? 'مدیر ارشد سیستم' : role === 'archivist' ? 'مدیر بایگانی' : 'کارشناس بایگانی',
    };
    setCurrentUser(found);
    addLog('login', 'ورود به سامانه', undefined, undefined, `ورود موفق با شناسه کاربری ${username}`);
    addToast('ورود موفقیت‌آمیز', `خوش آمدید، ${found.name}`, 'success');
    navigateTo('dashboard');
    return true;
  };

  const logout = () => {
    addLog('login', 'خروج از سامانه', undefined, undefined, `خروج کاربر ${currentUser?.name}`);
    setCurrentUser(null);
    navigateTo('login');
    addToast('خروج از حساب', 'شما با موفقیت از سیستم خارج شدید.', 'info');
  };

  // Documents
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);

  // Folders
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders);

  // Users
  const [users, setUsers] = useState<UserItem[]>(initialUsers);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);

  // Document Types
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeConfig[]>(initialDocumentTypes);

  // System Settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    systemTitle: 'سامانه جامع بایگانی اسناد الکترونیکی',
    orgName: 'سازمان مرکزی اسناد و فناوری',
    maxUploadSizeMb: 50,
    allowedExtensions: ['pdf', 'docx', 'xlsx', 'jpg', 'png', 'zip', 'tiff'],
    retentionPolicyEnabled: true,
    autoArchiveAfterYears: 5,
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 60,
    auditLogRetentionDays: 365,
  });

  const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('تنظیمات ذخیره شد', 'پیکربندی سیستم با موفقیت به‌روزرسانی شد.', 'success');
  };

  // Modals & Drawer State
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderModalParentId, setFolderModalParentId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type, timestamp: Date.now() }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auto-dismiss toasts
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4500);
    return () => clearTimeout(timer);
  }, [toasts]);

  // Add Log helper
  const addLog = (
    action: AuditLogItem['action'],
    actionFa: string,
    documentId?: string,
    documentTitle?: string,
    details?: string,
    status: 'success' | 'warning' | 'error' = 'success'
  ) => {
    const now = new Date();
    const jalaliTime = `۱۴۰۳/۰۷/۲۰ - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newEntry: AuditLogItem = {
      id: `log-${Date.now()}`,
      userName: currentUser ? currentUser.name : 'کاربر مهمان',
      userRole: currentUser ? currentUser.roleTitleFa : 'مهمان',
      action,
      actionFa,
      documentId,
      documentTitle,
      ip: '192.168.1.104',
      timestamp: jalaliTime,
      status,
      details: details || `عملیات ${actionFa} انجام شد.`,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Document Operations
  const addDocument = (docData: {
    title: string;
    folderId: string;
    type: DocumentType;
    confidentiality: ConfidentialityLevel;
    size: string;
    extension: string;
    tags: string[];
    description: string;
    metadata: Record<string, string>;
  }) => {
    const folder = folders.find((f) => f.id === docData.folderId);
    const docNumber = `${docData.type.toUpperCase().substring(0, 3)}-1403-${Math.floor(100 + Math.random() * 900)}`;
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: docData.title,
      documentNumber: docNumber,
      folderId: docData.folderId,
      folderName: folder ? folder.name : 'ریشه اسناد',
      type: docData.type,
      status: 'active',
      confidentiality: docData.confidentiality,
      size: docData.size,
      extension: docData.extension,
      mimeType: docData.extension === 'pdf' ? 'application/pdf' : 'application/octet-stream',
      createdAt: '۱۴۰۳/۰۷/۲۰',
      updatedAt: '۱۴۰۳/۰۷/۲۰',
      author: currentUser ? currentUser.name : 'کاربر جاری',
      department: currentUser ? currentUser.department : 'بایگانی عمومی',
      tags: docData.tags,
      version: '1.0',
      versions: [
        {
          version: '1.0',
          updatedAt: '۱۴۰۳/۰۷/۲۰',
          updatedBy: currentUser ? currentUser.name : 'کاربر جاری',
          changeSummary: 'بارگذاری نسخه اولیه سند و اختصاص متادیتا',
          size: docData.size,
        },
      ],
      metadata: docData.metadata,
      description: docData.description,
      downloadCount: 0,
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Update folder doc count
    setFolders((prev) =>
      prev.map((f) => (f.id === docData.folderId ? { ...f, documentCount: f.documentCount + 1 } : f))
    );

    addLog('create', 'بارگذاری سند جدید', newDoc.id, newDoc.title, `سند با شماره ${docNumber} با موفقیت بارگذاری شد.`);
    addToast('بارگذاری موفق', `سند «${docData.title}» به بایگانی افزوده شد.`, 'success');
  };

  const updateDocumentMetadata = (
    id: string,
    metadata: Record<string, string>,
    tags: string[],
    title?: string
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          const updated = {
            ...doc,
            metadata,
            tags,
            title: title || doc.title,
            updatedAt: '۱۴۰۳/۰۷/۲۰',
          };
          if (selectedDocForPreview?.id === id) {
            setSelectedDocForPreview(updated);
          }
          return updated;
        }
        return doc;
      })
    );

    const doc = documents.find((d) => d.id === id);
    addLog('update', 'ویرایش متادیتا', id, doc?.title, 'فیلدهای توصیفی و برچسب‌های سند بروزرسانی گردید.');
    addToast('ویرایش موفق', 'متادیتا و مشخصات سند با موفقیت ذخیره شد.', 'success');
  };

  const trashDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'trash', updatedAt: '۱۴۰۳/۰۷/۲۰' } : d))
    );

    if (selectedDocForPreview?.id === id) {
      setSelectedDocForPreview((prev) => (prev ? { ...prev, status: 'trash' } : null));
    }

    addLog('delete', 'انتقال به سطل زباله (حذف نرم)', id, doc.title, 'سند به سطل زباله منتقل گردید.', 'warning');
    addToast('انتقال به سطل زباله', `سند «${doc.title}» به سطل زباله منتقل شد.`, 'warning');
  };

  const restoreDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'active', updatedAt: '۱۴۰۳/۰۷/۲۰' } : d))
    );

    if (selectedDocForPreview?.id === id) {
      setSelectedDocForPreview((prev) => (prev ? { ...prev, status: 'active' } : null));
    }

    addLog('restore', 'بازیابی از سطل زباله', id, doc.title, 'سند مجدداً به بایگانی فعال بازگردانده شد.');
    addToast('بازیابی شد', `سند «${doc.title}» به وضعیت فعال بازگشت.`, 'success');
  };

  const deletePermanently = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (selectedDocForPreview?.id === id) {
      setSelectedDocForPreview(null);
    }

    addLog('delete', 'حذف قطعی سند', id, doc.title, 'فایل و تمام رکوردهای متادیتا به طور کامل و غیرقابل بازگشت پاک شدند.', 'error');
    addToast('حذف قطعی', `سند «${doc.title}» برای همیشه حذف شد.`, 'info');
  };

  const moveDocument = (docId: string, targetFolderId: string) => {
    const targetFolder = folders.find((f) => f.id === targetFolderId);
    if (!targetFolder) return;

    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          const updated = {
            ...d,
            folderId: targetFolderId,
            folderName: targetFolder.name,
            updatedAt: '۱۴۰۳/۰۷/۲۰',
          };
          if (selectedDocForPreview?.id === docId) {
            setSelectedDocForPreview(updated);
          }
          return updated;
        }
        return d;
      })
    );

    const doc = documents.find((d) => d.id === docId);
    addLog('update', 'جابجایی سند بین پوشه‌ها', docId, doc?.title, `سند به پوشه «${targetFolder.name}» منتقل گردید.`);
    addToast('جابجایی سند', `سند با موفقیت به پوشه «${targetFolder.name}» منتقل شد.`, 'success');
  };

  const batchTrashDocuments = (ids: string[]) => {
    setDocuments((prev) =>
      prev.map((d) => (ids.includes(d.id) ? { ...d, status: 'trash', updatedAt: '۱۴۰۳/۰۷/۲۰' } : d))
    );
    addLog('delete', 'حذف دسته‌جمعی', undefined, undefined, `${ids.length} سند به سطل زباله منتقل شدند.`, 'warning');
    addToast('حذف دسته‌جمعی', `${ids.length} سند به سطل زباله منتقل شدند.`, 'warning');
  };

  const addDocumentVersion = (docId: string, summary: string, newSize: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    const currentMajor = parseInt(doc.version.split('.')[0] || '1', 10);
    const currentMinor = parseInt(doc.version.split('.')[1] || '0', 10);
    const nextVer = `${currentMajor}.${currentMinor + 1}`;

    const newVersionObj = {
      version: nextVer,
      updatedAt: '۱۴۰۳/۰۷/۲۰',
      updatedBy: currentUser ? currentUser.name : 'کاربر جاری',
      changeSummary: summary,
      size: newSize || doc.size,
    };

    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          const updated = {
            ...d,
            version: nextVer,
            size: newSize || d.size,
            updatedAt: '۱۴۰۳/۰۷/۲۰',
            versions: [newVersionObj, ...d.versions],
          };
          if (selectedDocForPreview?.id === docId) {
            setSelectedDocForPreview(updated);
          }
          return updated;
        }
        return d;
      })
    );

    addLog('update', 'ثبت نسخه جدید سند', docId, doc.title, `نسخه ${nextVer} با توضیح: ${summary}`);
    addToast('ثبت نسخه جدید', `نسخه ${nextVer} برای سند با موفقیت ذخیره شد.`, 'success');
  };

  // Folder Operations
  const addFolder = (name: string, parentId: string | null, description: string) => {
    const newFolder: FolderItem = {
      id: `f-${Date.now()}`,
      name,
      parentId,
      documentCount: 0,
      totalSize: '0 MB',
      createdAt: '۱۴۰۳/۰۷/۲۰',
      description,
      permissions: ['admin', 'archivist', 'operator'],
    };

    setFolders((prev) => [...prev, newFolder]);
    addLog('create', 'ایجاد پوشه جدید', undefined, name, `پوشه جدید با نام «${name}» ایجاد شد.`);
    addToast('پوشه ایجاد شد', `پوشه «${name}» با موفقیت ساخته شد.`, 'success');
  };

  const updateFolder = (id: string, name: string, description: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name, description } : f))
    );
    addLog('update', 'ویرایش اطلاعات پوشه', undefined, name, `اطلاعات پوشه ویرایش شد.`);
    addToast('پوشه ویرایش شد', `اطلاعات پوشه بروزرسانی گردید.`, 'success');
  };

  const deleteFolder = (id: string): boolean => {
    const folder = folders.find((f) => f.id === id);
    const childDocs = documents.filter((d) => d.folderId === id && d.status === 'active');
    if (childDocs.length > 0) {
      addToast('عدم امکان حذف', `پوشه دارای ${childDocs.length} سند فعال است. ابتدا اسناد را انتقال دهید.`, 'error');
      return false;
    }

    setFolders((prev) => prev.filter((f) => f.id !== id));
    addLog('delete', 'حذف پوشه', undefined, folder?.name, `پوشه «${folder?.name}» حذف شد.`, 'warning');
    addToast('پوشه حذف شد', `پوشه «${folder?.name}» با موفقیت حذف گردید.`, 'info');
    return true;
  };

  // User Operations
  const addUser = (userData: Omit<UserItem, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: UserItem = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: '۱۴۰۳/۰۷/۲۰',
      lastLogin: 'هنوز وارد نشده',
    };
    setUsers((prev) => [...prev, newUser]);
    addLog('create', 'تعریف کاربر جدید', undefined, undefined, `کاربر جدید با نام ${userData.name} ایجاد شد.`);
    addToast('کاربر اضافه شد', `حساب کاربری برای «${userData.name}» فعال گردید.`, 'success');
  };

  const updateUser = (id: string, userData: Partial<UserItem>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...userData } : u))
    );
    addToast('کاربر بروز شد', 'مشخصات کاربر ذخیره شد.', 'success');
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'inactive' : 'active';
          addToast('تغییر وضعیت کاربر', `کاربر ${u.name} هم‌اکنون ${nextStatus === 'active' ? 'فعال' : 'غیرفعال'} است.`, 'info');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const updateDocumentTypeRetention = (type: DocumentType, years: number) => {
    setDocumentTypes((prev) =>
      prev.map((dt) => (dt.type === type ? { ...dt, retentionYears: years } : dt))
    );
    addToast('دوره نگهداری بروزرسانی شد', `دوره نگهداری برای این نوع سند به ${years} سال تنظیم شد.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentPage,
        navigateTo,
        currentUser,
        login,
        logout,
        documents,
        addDocument,
        updateDocumentMetadata,
        trashDocument,
        restoreDocument,
        deletePermanently,
        moveDocument,
        batchTrashDocuments,
        addDocumentVersion,
        folders,
        addFolder,
        updateFolder,
        deleteFolder,
        users,
        addUser,
        updateUser,
        toggleUserStatus,
        auditLogs,
        addLog,
        documentTypes,
        updateDocumentTypeRetention,
        selectedDocForPreview,
        setSelectedDocForPreview,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isFolderModalOpen,
        setIsFolderModalOpen,
        folderModalParentId,
        setFolderModalParentId,
        toasts,
        addToast,
        removeToast,
        systemSettings,
        updateSystemSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
