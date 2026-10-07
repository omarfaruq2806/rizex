'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import {
  Users,
  UserCheck,
  Briefcase,
  ShieldCheck,
  Search,
  UserCog,
  Trash2,
  Calendar,
  Layers,
} from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'TEAM_MEMBER' | 'ADMIN';
  image?: string | null;
  createdAt: string;
  _count?: {
    clientOrders: number;
    assignedOrders: number;
    quoteRequests: number;
    reviews: number;
  };
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { user: currentAdmin } = useAuth();

  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CLIENT' | 'TEAM_MEMBER' | 'ADMIN'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Role Changer Modal State
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [newRole, setNewRole] = useState<'CLIENT' | 'TEAM_MEMBER' | 'ADMIN'>('CLIENT');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // 1. Fetch User Stats
  const { data: statsData } = useQuery({
    queryKey: ['admin-users-stats'],
    queryFn: async () => {
      const res: any = await apiClient.get('/users/stats');
      return res?.data || res || { total: 0, clients: 0, teamMembers: 0, admins: 0 };
    },
  });

  const stats = statsData || { total: 0, clients: 0, teamMembers: 0, admins: 0 };

  // 2. Fetch Users List
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users-list', roleFilter, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('limit', '50');
      if (roleFilter !== 'ALL') {
        params.append('role', roleFilter);
      }
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      const res: any = await apiClient.get(`/users?${params.toString()}`);
      const payload = res?.data !== undefined ? res.data : res;
      return payload?.users || (Array.isArray(payload) ? payload : []);
    },
  });

  const users: UserItem[] = Array.isArray(usersData) ? usersData : [];

  // Update Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUser) return;
      setModalError(null);
      return apiClient.patch(`/users/${selectedUser.id}/role`, {
        role: newRole,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users-stats'] });
      setIsRoleModalOpen(false);
      setSelectedUser(null);
    },
    onError: (err: any) => {
      const msg = Array.isArray(err.message)
        ? err.message.join(', ')
        : err.message || 'Failed to update user role.';
      setModalError(msg);
    },
  });

  // Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiClient.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users-stats'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete user.');
    },
  });

  const handleOpenRoleModal = (user: UserItem) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setModalError(null);
    setIsRoleModalOpen(true);
  };

  const handleDeleteUser = (user: UserItem) => {
    if (user.id === currentAdmin?.id) {
      alert('You cannot delete your own admin account.');
      return;
    }
    if (confirm(`Are you sure you want to permanently delete user account "${user.name}" (${user.email})?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'ADMIN') return <Badge variant="secondary">ADMIN</Badge>;
    if (role === 'TEAM_MEMBER') return <Badge variant="primary">SPECIALIST</Badge>;
    return <Badge variant="neutral">CLIENT</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Users & Team Directory</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage registered platform accounts, promote members to specialist roles, and monitor team workload
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/90 bg-white">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Total Accounts</span>
              <div className="text-2xl font-mono font-extrabold text-slate-900">{stats.total || 0}</div>
              <p className="text-xs text-slate-500">All registered users</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200/90 bg-white">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Clients</span>
              <div className="text-2xl font-mono font-extrabold text-slate-900">{stats.clients || 0}</div>
              <p className="text-xs text-slate-500">Buyers & project owners</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200/90 bg-white">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Specialists</span>
              <div className="text-2xl font-mono font-extrabold text-slate-900">{stats.teamMembers || 0}</div>
              <p className="text-xs text-slate-500">Assigned agency team</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200/90 bg-white">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Administrators</span>
              <div className="text-2xl font-mono font-extrabold text-slate-900">{stats.admins || 0}</div>
              <p className="text-xs text-slate-500">Full system oversight</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {(['ALL', 'CLIENT', 'TEAM_MEMBER', 'ADMIN'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                roleFilter === r
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="h-64 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
      ) : users.length === 0 ? (
        <Card className="p-12 text-center border-slate-200/90 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-slate-600 font-medium text-sm">No users found matching the filter criteria.</p>
        </Card>
      ) : (
        <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Workload / Engagements</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => {
                  const isSelf = u.id === currentAdmin?.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center font-mono text-xs border border-orange-200">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">{u.name}</span>
                            {isSelf && (
                              <span className="font-mono text-[10px] text-orange-600 font-bold">(Current Admin)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-slate-600">
                        {u.email}
                      </td>

                      <td className="p-4">
                        {getRoleBadge(u.role)}
                      </td>

                      <td className="p-4 text-slate-600">
                        {u.role === 'CLIENT' ? (
                          <span>
                            {u._count?.clientOrders ?? 0} Orders • {u._count?.quoteRequests ?? 0} Briefs
                          </span>
                        ) : u.role === 'TEAM_MEMBER' ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200/60">
                            <Briefcase className="w-3 h-3" />
                            {u._count?.assignedOrders ?? 0} Active Assigned Projects
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">Platform Admin</span>
                        )}
                      </td>

                      <td className="p-4 font-mono text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() => handleOpenRoleModal(u)}
                        >
                          <UserCog className="w-3.5 h-3.5 text-slate-500" />
                          <span>Change Role</span>
                        </Button>
                        {!isSelf && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            onClick={() => handleDeleteUser(u)}
                            disabled={deleteUserMutation.isPending}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CHANGE ROLE MODAL */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Modify User Role & Permissions"
        description="Update platform privileges for this account"
        maxWidth="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateRoleMutation.mutate();
          }}
          className="space-y-4 pt-2"
        >
          {modalError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {modalError}
            </div>
          )}

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-mono text-xs text-slate-400 font-semibold uppercase">Target Account:</span>
            <p className="font-bold text-slate-900 text-sm">{selectedUser?.name}</p>
            <p className="font-mono text-xs text-slate-500">{selectedUser?.email}</p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-slate-700 block">Select Role Privilege:</label>

            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  newRole === 'CLIENT'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="userRole"
                  value="CLIENT"
                  checked={newRole === 'CLIENT'}
                  onChange={() => setNewRole('CLIENT')}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div>
                  <span className="font-bold text-slate-900 text-sm block">CLIENT</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Can browse services, submit dynamic requirement briefs, accept custom quotes, and track ordered deliverables.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  newRole === 'TEAM_MEMBER'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="userRole"
                  value="TEAM_MEMBER"
                  checked={newRole === 'TEAM_MEMBER'}
                  onChange={() => setNewRole('TEAM_MEMBER')}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div>
                  <span className="font-bold text-slate-900 text-sm block">TEAM_MEMBER (Specialist)</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Can be assigned by Admin to execute client projects, access project workrooms, chat directly with clients, and submit milestone deliverables.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  newRole === 'ADMIN'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="userRole"
                  value="ADMIN"
                  checked={newRole === 'ADMIN'}
                  onChange={() => setNewRole('ADMIN')}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div>
                  <span className="font-bold text-slate-900 text-sm block">ADMIN (Platform Supervisor)</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete administrative oversight over catalog services, intake questionnaires, quote pricing, specialist assignments, chat supervision, and review moderation.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRoleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={updateRoleMutation.isPending}
            >
              Save Role Change
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
