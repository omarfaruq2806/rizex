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

  const getRoleBadgeVariant = (role: string): 'primary' | 'outline' | 'secondary' => {
    if (role === 'ADMIN') return 'primary';
    if (role === 'TEAM_MEMBER') return 'outline';
    return 'secondary';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">Users & Team Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage registered clients, assign specialist roles & supervise platform permissions
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Total Accounts</span>
            <CardTitle className="text-2xl font-mono text-white">{stats.total || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">All platform members</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Clients</span>
            <CardTitle className="text-2xl font-mono text-white">{stats.clients || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Can submit briefs & order services</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Team Specialists</span>
            <CardTitle className="text-2xl font-mono text-white">{stats.teamMembers || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Can be assigned to execute projects</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Administrators</span>
            <CardTitle className="text-2xl font-mono text-white">{stats.admins || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Full system oversight & control</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'CLIENT', 'TEAM_MEMBER', 'ADMIN'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                roleFilter === r
                  ? 'bg-white text-black font-semibold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-zinc-900 border border-zinc-800 rounded animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-950 p-12 text-center">
          <p className="text-zinc-400 font-mono text-sm">No users found matching the filter criteria.</p>
        </Card>
      ) : (
        <Card className="border-zinc-800 bg-zinc-950 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 font-mono text-xs text-zinc-500 bg-zinc-900/50">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Activity & Workload</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-xs text-zinc-300">
                {users.map((u) => {
                  const isSelf = u.id === currentAdmin?.id;
                  return (
                    <tr key={u.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-white text-xs">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{u.name}</span>
                            {isSelf && (
                              <span className="font-mono text-[10px] text-zinc-500">(You)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-zinc-400">
                        {u.email}
                      </td>

                      <td className="p-4">
                        <Badge variant={getRoleBadgeVariant(u.role)} className="font-mono text-[10px]">
                          {u.role}
                        </Badge>
                      </td>

                      <td className="p-4 font-mono text-zinc-400">
                        {u.role === 'CLIENT' ? (
                          <span>
                            {u._count?.clientOrders ?? 0} Orders • {u._count?.quoteRequests ?? 0} Briefs
                          </span>
                        ) : u.role === 'TEAM_MEMBER' ? (
                          <span className="text-zinc-200">
                            {u._count?.assignedOrders ?? 0} Active Assigned Projects
                          </span>
                        ) : (
                          <span className="text-zinc-500">Platform Admin</span>
                        )}
                      </td>

                      <td className="p-4 font-mono text-zinc-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleOpenRoleModal(u)}
                        >
                          Change Role
                        </Button>
                        {!isSelf && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-zinc-500 hover:text-red-400"
                            onClick={() => handleDeleteUser(u)}
                            disabled={deleteUserMutation.isPending}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ======================================================== */}
      {/* CHANGE ROLE MODAL */}
      {/* ======================================================== */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Modify User Platform Role"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateRoleMutation.mutate();
          }}
          className="space-y-4"
        >
          {modalError && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded">
              {modalError}
            </div>
          )}

          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded space-y-1">
            <span className="font-mono text-xs text-zinc-400">Target User:</span>
            <p className="font-semibold text-white text-sm">{selectedUser?.name}</p>
            <p className="font-mono text-xs text-zinc-400">{selectedUser?.email}</p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-mono text-zinc-400 block">Select New Role:</label>

            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  newRole === 'CLIENT'
                    ? 'border-white bg-zinc-900/60'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="userRole"
                  value="CLIENT"
                  checked={newRole === 'CLIENT'}
                  onChange={() => setNewRole('CLIENT')}
                  className="mt-1"
                />
                <div>
                  <span className="font-semibold text-white text-sm block">CLIENT</span>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Can browse services, submit project requirement briefs, receive custom quotes, and track project orders.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  newRole === 'TEAM_MEMBER'
                    ? 'border-white bg-zinc-900/60'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="userRole"
                  value="TEAM_MEMBER"
                  checked={newRole === 'TEAM_MEMBER'}
                  onChange={() => setNewRole('TEAM_MEMBER')}
                  className="mt-1"
                />
                <div>
                  <span className="font-semibold text-white text-sm block">TEAM_MEMBER (Specialist)</span>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Can be assigned by Admin to execute client orders, chat with clients in assigned order rooms, update progress, and submit deliverables.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  newRole === 'ADMIN'
                    ? 'border-white bg-zinc-900/60'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="userRole"
                  value="ADMIN"
                  checked={newRole === 'ADMIN'}
                  onChange={() => setNewRole('ADMIN')}
                  className="mt-1"
                />
                <div>
                  <span className="font-semibold text-white text-sm block">ADMIN (Platform Supervisor)</span>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Full supervisory control over services, categories, quotes, orders, specialist assignments, chat moderation, reviews, and user roles.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
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
