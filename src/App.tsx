import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { DocumentPreviewModal } from './components/modals/DocumentPreviewModal';
import { UploadModal } from './components/modals/UploadModal';
import { FolderModal } from './components/modals/FolderModal';
import { MoveDocumentModal } from './components/modals/MoveDocumentModal';
import { UserModal } from './components/modals/UserModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { FoldersPage } from './pages/FoldersPage';
import { UsersPage } from './pages/UsersPage';
import { AdvancedSearchPage } from './pages/AdvancedSearchPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

import { DocumentItem, FolderItem, UserItem } from './types';

const MainAppContent: React.FC = () => {
  const { currentPage, isFolderModalOpen, setIsFolderModalOpen, setFolderModalParentId, theme } = useApp();

  // Mobile sidebar drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal target references
  const [movingDoc, setMovingDoc] = useState<DocumentItem | null>(null);
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Folder modal opener helper
  const handleOpenFolderModal = (folder?: FolderItem | null, parentId?: string | null) => {
    setEditingFolder(folder || null);
    setFolderModalParentId(parentId || null);
    setIsFolderModalOpen(true);
  };

  const handleCloseFolderModal = () => {
    setIsFolderModalOpen(false);
    setEditingFolder(null);
    setFolderModalParentId(null);
  };

  // User modal opener helper
  const handleOpenUserModal = (user?: UserItem | null) => {
    setEditingUser(user || null);
    setIsUserModalOpen(true);
  };

  // Move document modal opener helper
  const handleOpenMoveModal = (doc: DocumentItem) => {
    setMovingDoc(doc);
  };

  // Standalone auth pages
  if (currentPage === 'login') {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <LoginPage />
      </div>
    );
  }

  if (currentPage === 'forgot-password') {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <ForgotPasswordPage />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar (Desktop sticky & Mobile drawer) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && <DashboardPage />}

          {currentPage === 'documents' && (
            <DocumentsPage
              onOpenMoveModal={handleOpenMoveModal}
              isTrashView={false}
            />
          )}

          {currentPage === 'trash' && (
            <DocumentsPage
              onOpenMoveModal={handleOpenMoveModal}
              isTrashView={true}
            />
          )}

          {currentPage === 'folders' && (
            <FoldersPage
              onOpenFolderModal={handleOpenFolderModal}
              onOpenMoveModal={handleOpenMoveModal}
            />
          )}

          {currentPage === 'users' && (
            <UsersPage onOpenUserModal={handleOpenUserModal} />
          )}

          {currentPage === 'search' && <AdvancedSearchPage />}

          {currentPage === 'reports' && <ReportsPage />}

          {currentPage === 'settings' && <SettingsPage />}

          {currentPage === 'change-password' && <ChangePasswordPage />}
        </main>
      </div>

      {/* Modals & Drawers */}
      <DocumentPreviewModal onOpenMoveModal={handleOpenMoveModal} />
      <UploadModal />
      <FolderModal
        editingFolder={editingFolder}
        onClose={handleCloseFolderModal}
      />
      <MoveDocumentModal
        document={movingDoc}
        onClose={() => setMovingDoc(null)}
      />
      {isUserModalOpen && (
        <UserModal
          editingUser={editingUser}
          onClose={() => {
            setIsUserModalOpen(false);
            setEditingUser(null);
          }}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
