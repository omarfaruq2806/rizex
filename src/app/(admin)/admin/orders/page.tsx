'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

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
      return res.data?.data || res.data || res || [];
    },
  });

  // 2. Fetch Team Members
  const { data: membersData } = useQuery({
    queryKey: ['admin-team-members'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/team-members');
      return res.data || res || [];
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-white">
            Global Project Orders & Specialist Assignments
          </h2>
          <p className="text-xs text-zinc-400">
            Supervise project pipeline, reassign team members, and override lifecycle statuses.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse" />
      ) : orders.length > 0 ? (
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800 font-mono uppercase">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Project Title</th>
                <th className="p-3">Client</th>
                <th className="p-3">Assigned Specialist</th>
                <th className="p-3">Status</th>
                <th className="p-3">Progress</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {orders.map((order) => {
                const activeAssignment = order.assignments?.find((a: any) => !a.unassignedAt);
                return (
                  <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-white">
                      {order.orderNumber}
                    </td>
                    <td className="p-3 text-zinc-200 font-medium">
                      {order.title}
                    </td>
                    <td className="p-3 text-zinc-400">
                      {order.client?.name}
                    </td>
                    <td className="p-3">
                      {activeAssignment ? (
                        <div className="space-y-0.5">
                          <span className="font-semibold text-white block">
                            {activeAssignment.member?.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {activeAssignment.member?.email}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="warning">UNASSIGNED</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setIsStatusModalOpen(true);
                        }}
                        className="cursor-pointer hover:opacity-80"
                      >
                        <Badge variant="outline">{order.status} ✎</Badge>
                      </button>
                    </td>
                    <td className="p-3 font-mono">
                      {order.progress || 0}%
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAssignModal(order)}
                      >
                        {activeAssignment ? 'Reassign' : 'Assign Worker'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-950 p-12 text-center">
          <p className="text-xs text-zinc-400">No project orders in the platform yet.</p>
        </Card>
      )}

      {/* ASSIGN WORKER MODAL */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Specialist to Project"
        description={`Order ${selectedOrder?.orderNumber}: ${selectedOrder?.title}`}
      >
        <form onSubmit={handleAssignWorker} className="space-y-4 pt-2">
          <div className="w-full">
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Select Specialist (Workload shown) *
            </label>
            <select
              className="w-full bg-zinc-950 text-white border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
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

          <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
            {selectedOrder?.assignments?.some((a: any) => !a.unassignedAt) ? (
              <Button
                type="button"
                variant="ghost"
                className="text-red-400 hover:text-red-300 text-xs"
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
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
          <div className="w-full">
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Pipeline Status *
            </label>
            <select
              className="w-full bg-zinc-950 text-white border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
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

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
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
