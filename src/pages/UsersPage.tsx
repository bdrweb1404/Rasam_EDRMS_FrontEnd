import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users2,
  UserPlus,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Key,
  Lock,
  Check,
  Building,
  Phone,
  Mail,
} from 'lucide-react';
import { UserItem, UserRole } from '../types';
import { initialRoles } from '../data/mockData';

interface UsersPageProps {
  onOpenUserModal: (user?: UserItem | null) => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({ onOpenUserModal }) => {
  const { users, toggleUserStatus } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const filteredUsers = users.filter((u) => {
    if (selectedRole !== 'all' && u.role !== selectedRole) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const roleBadgeColors: Record<UserRole, string> = {
    admin: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900',
    archivist: 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900',
    operator: 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200 dark:border-sky-900',
    viewer: 'text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
  };

  return (
    <div className="space-y-6 text-right pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>مدیریت کاربران و نقش‌های سازمانی (RBAC)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تعریف پرسنل، تخصیص سطوح دسترسی، کنترل احراز هویت و نظارت بر نشست‌های فعال
          </p>
        </div>

        <button
          onClick={() => onOpenUserModal(null)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>تعریف کاربر جدید</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>فهرست پرسنل و کاربران ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>ماتریس نقش‌ها و سطوح دسترسی (RBAC)</span>
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="جستجو بر اساس نام، نام کاربری یا دپارتمان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">فیلتر نقش:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
              >
                <option value="all">همه نقش‌ها</option>
                <option value="admin">مدیر کل سیستم</option>
                <option value="archivist">مدیر ارشد بایگانی</option>
                <option value="operator">کارشناس بایگانی</option>
                <option value="viewer">مشاهده‌گر</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">کاربر</th>
                    <th className="py-3.5 px-4">اطلاعات تماس</th>
                    <th className="py-3.5 px-4">واحد سازمانی</th>
                    <th className="py-3.5 px-4">نقش دسترسی</th>
                    <th className="py-3.5 px-4">وضعیت حساب</th>
                    <th className="py-3.5 px-4">آخرین ورود</th>
                    <th className="py-3.5 px-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 shrink-0">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              user.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                        <p>{user.email}</p>
                        <p className="text-slate-400 mt-0.5">{user.phone}</p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {user.department}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${roleBadgeColors[user.role]}`}>
                          {user.roleTitleFa}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                            user.status === 'active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          <span>{user.status === 'active' ? 'فعال' : 'غیرفعال'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 tabular-nums">
                        {user.lastLogin}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenUserModal(user)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="ویرایش کاربر"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* RBAC Roles Matrix Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialRoles.map((role) => (
            <div
              key={role.id}
              className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {role.titleFa}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${roleBadgeColors[role.id]}`}>
                    {role.id.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {role.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    مجوزهای اعطا شده:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {role.permissions.map((perm, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>تعداد کاربران با این نقش: {users.filter((u) => u.role === role.id).length} نفر</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">نقش سیستمی ثابت</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
