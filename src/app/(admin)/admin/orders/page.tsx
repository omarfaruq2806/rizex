'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import {
  FolderKanban,
  UserPlus,
  Sliders,
  ExternalLink,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Edit3,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Status modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // 1. Fetch Orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-all-orders'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/orders?limit=50');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  // 2. Fetch Team Members
  const { data: membersData } = useQuery({
    queryKey: ['admin-team-members'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/team-members');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  const orders: any[] = Array.isArray(ordersData) ? ordersData : [];
  const teamMembers: any[] = Array.isArray(membersData) ? membersData : [];

  const handleOpenAssignModal = (order: any) => {
    setSelectedOrder(order);
    setSelectedMemberId('');
    setIsAssignModalOpen(true);
  };

  const handleAssignWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !selectedMemberId) return;

    setIsAssigning(true);
    try {
      await apiClient.post(`/orders/${selectedOrder.id}/assign`, {
        memberId: selectedMemberId,
      });

      queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      alert('Team specialist successfully assigned to project!');
      setIsAssignModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to assign team member.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignWorker = async (orderId: string) => {
    if (!confirm('Are you sure you want to unassign the current worker from this order?')) return;

    try {
      await apiClient.post(`/orders/${orderId}/unassign`);
      queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      alert('Worker unassigned.');
      setIsAssignModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to unassign worker.');
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newStatus) return;

    setIsUpdatingStatus(true);
    try {
      await apiClient.patch(`/orders/${selectedOrder.id}/status`, {
        status: newStatus,
      });
      queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] });
      alert('Order status updated!');
      setIsStatusModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">COMPLETED</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="primary">IN PROGRESS</Badge>;
      case 'REVIEW':
        return <Badge variant="warning">UNDER REVIEW</Badge>;
      case 'ASSIGNED':
        return <Badge variant="outline">ASSIGNED</Badge>;
      case 'AWAITING_PAYMENT':
        return <Badge variant="warning">AWAITING PAYMENT</Badge>;
      case 'REVISION':
        return <Badge variant="danger">REVISION</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">CANCELLED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Orders & Specialist Assignments
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Supervise active project pipelines, allocate team members, and override lifecycle milestone states
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
      ) : orders.length > 0 ? (
        <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Assigned Specialist</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((order) => {
                  const activeAssignment = order.assignments?.find((a: any) => !a.unassignedAt);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                      </td>
                      <td className="p-4 font-medium text-slate-900">
                        {order.title}
                      </td>
                      <td className="p-4 text-slate-600">
                        <span className="font-medium text-slate-900 block">{order.client?.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{order.client?.email}</span>
                      </td>
                      <td className="p-4">
                        {activeAssignment ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-900 block">
                              {activeAssignment.member?.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {activeAssignment.member?.email}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="warning">UNASSIGNED</Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status);
                            setIsStatusModalOpen(true);
                          }}
                          className="cursor-pointer hover:opacity-80 inline-flex items-center gap-1 group"
                          title="Click to override status"
                        >
                          {getStatusBadge(order.status)}
                          <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
                        </button>
                      </td>
                      <td className="p-4 font-mono">
                        <div className="w-20 space-y-1">
                          <span className="text-[10px] text-slate-600 font-semibold">{order.progress || 0}%</span>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${Math.min(100, Math.max(0, order.progress || 0))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() => handleOpenAssignModal(order)}
                        >
                          <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                          <span>{activeAssignment ? 'Reassign' : 'Assign'}</span>
                        </Button>
                        <Link href={`/dashboard/orders/${order.orderNumber}`}>
                          <Button variant="secondary" size="sm" className="text-xs gap-1">
                            <span>Room</span>
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center border-slate-200/90 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No Orders in Platform</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When clients accept custom proposals, active project orders will appear here for specialist allocation.
          </p>
        </Card>
      )}

      {/* ASSIGN WORKER MODAL */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Specialist to Project"
        description={`Order ${selectedOrder?.orderNumber}: ${selectedOrder?.title}`}
        maxWidth="lg"
      >
        <form onSubmit={handleAssignWorker} className="space-y-4 pt-2">
          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Select Specialist (Workload Shown) *
            </label>
            <select
              className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium cursor-pointer"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              required
            >
              <option value="">Choose team specialist...</option>
              {teamMembers.map((tm) => (
                <option key={tm.id} value={tm.id}>
                  {tm.name} ({tm.email}) — {tm.activeProjectsCount || 0} active projects
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            {selectedOrder?.assignments?.some((a: any) => !a.unassignedAt) ? (
              <Button
                type="button"
                variant="ghost"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs"
                onClick={() => handleUnassignWorker(selectedOrder.id)}
              >
                Unassign Current Worker
              </Button>
            ) : <div />}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssignModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isAssigning}
              >
                Assign Specialist
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* UPDATE STATUS MODAL */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Override Order Pipeline Status"
        description={`Order ${selectedOrder?.orderNumber}`}
        maxWidth="md"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Pipeline Status *
            </label>
            <select
              className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium cursor-pointer"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
            >
              <option value="AWAITING_PAYMENT">AWAITING_PAYMENT</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="REVIEW">REVIEW</option>
              <option value="REVISION">REVISION</option>
              <option value="FINAL_DELIVERY">FINAL_DELIVERY</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isUpdatingStatus}
            >
              Update Status
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
