export type DocumentType = 'contract' | 'invoice' | 'letter' | 'personnel' | 'technical' | 'legal' | 'report';

export type ConfidentialityLevel = 'normal' | 'confidential' | 'secret';

export type DocumentStatus = 'active' | 'archived' | 'trash';

export interface DocumentVersion {
  version: string;
  updatedAt: string;
  updatedBy: string;
  changeSummary: string;
  size: string;
  downloadUrl?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  documentNumber: string;
  folderId: string;
  folderName: string;
  type: DocumentType;
  status: DocumentStatus;
  confidentiality: ConfidentialityLevel;
  size: string;
  extension: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  authorAvatar?: string;
  department: string;
  tags: string[];
  version: string;
  versions: DocumentVersion[];
  metadata: Record<string, string>;
  contentSnippet?: string;
  description?: string;
  previewUrl?: string;
  downloadCount: number;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  documentCount: number;
  totalSize: string;
  createdAt: string;
  description?: string;
  color?: string;
  permissions: ('admin' | 'archivist' | 'operator' | 'viewer')[];
}

export type UserRole = 'admin' | 'archivist' | 'operator' | 'viewer';

export interface UserItem {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  roleTitleFa: string;
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
  phone: string;
}

export interface RoleDefinition {
  id: UserRole;
  titleFa: string;
  description: string;
  permissions: string[];
}

export interface AuditLogItem {
  id: string;
  userName: string;
  userRole: string;
  action: 'view' | 'download' | 'create' | 'update' | 'delete' | 'restore' | 'permission_change' | 'login';
  actionFa: string;
  documentId?: string;
  documentTitle?: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

export interface MetadataField {
  id: string;
  nameFa: string;
  key: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  options?: string[];
}

export interface DocumentTypeConfig {
  type: DocumentType;
  nameFa: string;
  description: string;
  icon: string;
  retentionYears: number;
  colorClass: string;
  fields: MetadataField[];
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

export type PageRoute = 
  | 'dashboard'
  | 'documents'
  | 'trash'
  | 'folders'
  | 'users'
  | 'search'
  | 'reports'
  | 'settings'
  | 'login'
  | 'change-password'
  | 'forgot-password';
