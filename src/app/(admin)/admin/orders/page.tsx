'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  PlusCircle,
  CreditCard,
  PackageCheck,
  DollarSign,
  User,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // 1. Assign Specialist Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // 2. Status Modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // 3. Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MANUAL');
  const [transactionId, setTransactionId] = useState('');
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  // 4. Delivery Modal
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [deliveryUrl, setDeliveryUrl] = useState('');
  const [isUpdatingDelivery, setIsUpdatingDelivery] = useState(false);

  // 5. Create Order Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clientMode, setClientMode] = useState<'existing' | 'new'>('new');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [createTitle, setCreateTitle] = useState('');
  const [createTotalAmount, setCreateTotalAmount] = useState('20000');
  const [createPaidAmount, setCreatePaidAmount] = useState('0');
  const [createDeliveryDate, setCreateDeliveryDate] = useState('');
  const [createStatus, setCreateStatus] = useState('CONFIRMED');
  const [createNotes, setCreateNotes] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Fetch Orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-all-orders'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/orders?limit=50');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  // Fetch Team Members
  const { data: membersData } = useQuery({
    queryKey: ['admin-team-members'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/team-members');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  // Fetch Services for creation dropdown
  const { data: servicesData } = useQuery({
    queryKey: ['admin-services-list'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/services?limit=100');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  // Fetch Users / Clients for creation dropdown
  const { data: usersData } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/users?limit=100');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  const orders: any[] = Array.isArray(ordersData) ? ordersData : [];
  const teamMembers: any[] = Array.isArray(membersData) ? membersData : [];
  const services: any[] = Array.isArray(servicesData) ? servicesData : [];
  const allUsers: any[] = Array.isArray(usersData) ? usersData : [];

  // ASSIGN SPECIALIST
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
      alert('Team specialist assigned!');
      setIsAssignModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to assign team member.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignWorker = async (orderId: string) => {
    if (!confirm('Are you sure you want to unassign worker from this order?')) return;
    try {
      await apiClient.post(`/orders/${orderId}/unassign`);
      queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] });
      alert('Worker unassigned.');
      setIsAssignModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to unassign worker.');
    }
  };

  // UPDATE STATUS
  const handleOpenStatusModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusModalOpen(true);
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

  // UPDATE PAYMENT
  const handleOpenPaymentModal = (order: any) => {
    setSelectedOrder(order);
    setPaymentAmount(String(order.paidAmount || '0'));
    setPaymentMethod('MANUAL');
    setTransactionId('');
    setIsPaymentModalOpen(true);
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdatingPayment(true);
    try {
      await apiClient.patch(`/orders/${selectedOrder.id}/payment`, {
        paidAmount: Number(paymentAmount),
        method: paymentMethod,
        transactionId: transactionId.trim() || undefined,
      });

      queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] });
      alert('Order payment updated!');
      setIsPaymentModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update payment.');
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  // UPDATE DELIVERY
  const handleOpenDeliveryModal = (order: any) => {
    setSelectedOrder(order);
    setDeliveryUrl(order.deliveryUrl || '');
    setIsDeliveryModalOpen(true);
  };

  const handleUpdateDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdatingDelivery(true);
    try {
      // Patch order deliveryUrl and set status to COMPLETED if checked
      await apiClient.patch(`/orders/${selectedOrder.id}/status`, {
        status: 'COMPLETED',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] });
      alert('Order marked as Completed with delivery recorded!');
      setIsDeliveryModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update delivery.');
    } finally {
      setIsUpdatingDelivery(false);
    }
  };

  // CREATE DIRECT ORDER
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) {
      alert('Please select a service');
      return;
    }

    if (clientMode === 'existing' && !selectedClientId) {
      alert('Please select an existing client');
      return;
    }

    if (clientMode === 'new' && (!newClientEmail.trim() || !newClientName.trim())) {
      alert('Please provide client name and email');
      return;
    }

    setIsCreatingOrder(true);
    try {
      const payload: any = {
        serviceId: selectedServiceId,
        title: createTitle.trim() || 'Custom Project Order',
        totalAmount: Number(createTotalAmount),
        paidAmount: Number(createPaidAmount || 0),
        status: createStatus,
        expectedDelivery: createDeliveryDate ? new Date(createDeliveryDate).toISOString() : undefined,
        notes: createNotes.trim() || undefined,
      };

      if (clientMode === 'existing') {
        payload.clientId = selectedClientId;
      } else {
        payload.clientName = newClientName.trim();
        payload.clientEmail = newClientEmail.trim();
        payload.clientPhone = newClientPhone.trim() || undefined;
      }

      await apiClient.post('/orders', payload);

      queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] });
      alert('New Official Order successfully created!');
      setIsCreateModalOpen(false);

      // Reset form
      setNewClientName('');
      setNewClientEmail('');
      setNewClientPhone('');
      setSelectedClientId('');
      setCreateTitle('');
      setCreateNotes('');
      setCreatePaidAmount('0');
    } catch (err: any) {
      alert(err.message || 'Failed to create order.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="neutral">DRAFT</Badge>;
      case 'CONFIRMED':
        return <Badge variant="primary">CONFIRMED</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="primary">IN PROGRESS</Badge>;
      case 'REVIEW':
      case 'IN_REVIEW':
        return <Badge variant="warning">IN REVIEW</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">COMPLETED</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">CANCELLED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            PAID
          </span>
        );
      case 'PARTIALLY_PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            PARTIAL
          </span>
        );
      case 'UNPAID':
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            UNPAID
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Order & Milestone Management
          </h2>
          <p className="text-xs text-[#F5F7FA]/60 mt-1">
            Supervise production pipelines, track manual client payments, assign team specialists, and release deliveries.
          </p>
        </div>

        {/* Action Button: Create Order */}
        <Button
          size="sm"
          className="gap-1.5 text-xs bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold uppercase rounded-full h-9 px-4 shadow-sm border-none"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircle className="w-4 h-4 text-[#080402]" />
          <span>Create New Order</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="h-64 glass-level-2 border border-white/12 rounded-2xl animate-pulse" />
      ) : orders.length > 0 ? (
        <div className="border border-white/12 rounded-2xl overflow-hidden glass-level-2 shadow-xl bg-white/[0.02]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] text-[#F5F7FA]/60 border-b border-white/[0.08] font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Payment Tracking</th>
                  <th className="p-4">Work Status</th>
                  <th className="p-4">Specialist</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#F5F7FA]/80">
                {orders.map((order) => {
                  const activeAssignment = order.assignments?.find((a: any) => !a.unassignedAt);
                  const total = Number(order.totalAmount || order.quote?.amount || 0);
                  const paid = Number(order.paidAmount || 0);

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="p-4 font-mono font-bold text-white">
                        {order.orderNumber}
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-white block">{order.title}</span>
                        <span className="text-[11px] text-[#F5F7FA]/50 font-mono block">
                          {order.service?.name}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-white block">{order.client?.name}</span>
                        <span className="text-[10px] text-[#F5F7FA]/40 font-mono">{order.client?.email}</span>
                      </td>

                      {/* Payment Status Column */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                          <span className="text-[11px] font-mono font-bold text-white block">
                            ৳{paid.toLocaleString()} / ৳{total.toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Work Status Column */}
                      <td className="p-4">
                        <div className="space-y-1">
                          {getStatusBadge(order.status)}
                          {order.deliveryUrl && (
                            <a
                              href={order.deliveryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#FFA500] hover:underline flex items-center gap-1 font-mono mt-0.5"
                            >
                              <ExternalLink className="w-2.5 h-2.5" /> Delivery Link
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Assigned Specialist Column */}
                      <td className="p-4">
                        {activeAssignment ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-white block">
                              {activeAssignment.member?.name}
                            </span>
                            <span className="text-[10px] text-[#F5F7FA]/40 font-mono">
                              {activeAssignment.member?.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#F5F7FA]/40 text-[11px] italic font-mono">Unassigned</span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Payment Update */}
                          <button
                            onClick={() => handleOpenPaymentModal(order)}
                            className="p-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-white transition-colors cursor-pointer"
                            title="Update Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-[#FFA500]" />
                          </button>

                          {/* Status Change */}
                          <button
                            onClick={() => handleOpenStatusModal(order)}
                            className="p-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-white transition-colors cursor-pointer"
                            title="Change Status"
                          >
                            <Sliders className="w-3.5 h-3.5 text-[#FFA500]" />
                          </button>

                          {/* Assign Specialist */}
                          <button
                            onClick={() => handleOpenAssignModal(order)}
                            className="p-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-white transition-colors cursor-pointer"
                            title="Assign Specialist"
                          >
                            <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                          </button>

                          {/* Complete / Delivery */}
                          <button
                            onClick={() => handleOpenDeliveryModal(order)}
                            className="p-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-emerald-400 transition-colors cursor-pointer"
                            title="Finalize & Deliver"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center border-white/12">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 text-[#FFA500] flex items-center justify-center mx-auto mb-3">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Orders in Pipeline Yet</h3>
          <p className="text-xs text-[#F5F7FA]/60 mt-1 max-w-sm mx-auto">
            Click &ldquo;Create New Order&rdquo; above or convert an incoming lead from the Inquiries page.
          </p>
        </Card>
      )}

      {/* CREATE ORDER MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Official Order"
        description="Add a new client order directly into the pipeline with custom pricing and delivery date."
        maxWidth="xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 pt-2">
          {/* Client Selection Mode */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Client Assignment</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setClientMode('new')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  clientMode === 'new'
                    ? 'bg-[#FFA500]/20 text-[#FFA500] border-[#FFA500]/40'
                    : 'glass-level-1 text-white/70 border-white/10 hover:bg-white/[0.06]'
                }`}
              >
                + New Client Details
              </button>
              <button
                type="button"
                onClick={() => setClientMode('existing')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  clientMode === 'existing'
                    ? 'bg-[#FFA500]/20 text-[#FFA500] border-[#FFA500]/40'
                    : 'glass-level-1 text-white/70 border-white/10 hover:bg-white/[0.06]'
                }`}
              >
                Select Existing Client ({allUsers.length})
              </button>
            </div>
          </div>

          {clientMode === 'new' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
              <Input
                label="Client Name *"
                placeholder="e.g. Tanvir Ahmed"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                required={clientMode === 'new'}
              />
              <Input
                label="Client Email *"
                type="email"
                placeholder="e.g. tanvir@client.com"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
                required={clientMode === 'new'}
              />
              <Input
                label="Client Phone / WhatsApp"
                placeholder="017XXXXXXXX"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-white/90 block mb-1 font-mono">
                Choose Existing Client *
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs bg-[#140A03] text-white focus:outline-none focus:border-[#FFA500]"
                required={clientMode === 'existing'}
              >
                <option value="">-- Select Client --</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Service & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-white/90 block mb-1 font-mono">Service *</label>
              <select
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  const found = services.find((s) => s.id === e.target.value);
                  if (found) {
                    if (found.startingPrice) setCreateTotalAmount(String(found.startingPrice));
                    if (!createTitle) setCreateTitle(`${found.name} Order`);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs bg-[#140A03] text-white focus:outline-none focus:border-[#FFA500]"
                required
              >
                <option value="">-- Select Service --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (৳{Number(s.startingPrice || 0).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Order Title *"
              placeholder="e.g. Fintech Mobile App MVP"
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              required
            />
          </div>

          {/* Financials & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Total Agreed Price (৳) *"
              type="number"
              placeholder="e.g. 40000"
              value={createTotalAmount}
              onChange={(e) => setCreateTotalAmount(e.target.value)}
              required
            />

            <Input
              label="Initial Paid / Advance (৳)"
              type="number"
              placeholder="e.g. 15000 (0 if unpaid)"
              value={createPaidAmount}
              onChange={(e) => setCreatePaidAmount(e.target.value)}
            />

            <Input
              label="Expected Delivery Date"
              type="date"
              value={createDeliveryDate}
              onChange={(e) => setCreateDeliveryDate(e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-white/90 block mb-1 font-mono">Initial Status</label>
            <select
              value={createStatus}
              onChange={(e) => setCreateStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-white/15 text-xs bg-[#140A03] text-white focus:outline-none focus:border-[#FFA500]"
            >
              <option value="DRAFT">DRAFT (Proposal / Pending Confirmation)</option>
              <option value="CONFIRMED">CONFIRMED (Client Agreed)</option>
              <option value="IN_PROGRESS">IN_PROGRESS (Work Starting)</option>
            </select>
          </div>

          <Textarea
            label="Order Notes / Deliverables Checklist"
            placeholder="Key milestones, tech stack, or special terms..."
            value={createNotes}
            onChange={(e) => setCreateNotes(e.target.value)}
            rows={2}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="outline"
              className="glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] rounded-full h-10 px-5 text-xs font-semibold"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreatingOrder}
              className="gap-1.5 bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider rounded-full h-10 px-6 shadow-sm border-none"
            >
              <CheckCircle2 className="w-4 h-4 text-[#080402]" />
              <span>{isCreatingOrder ? 'Creating...' : 'Create Order'}</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* UPDATE PAYMENT MODAL */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Update Order Payment"
        description={`Record received payment for "${selectedOrder?.title}"`}
        maxWidth="md"
      >
        <form onSubmit={handleUpdatePayment} className="space-y-4 pt-2">
          <div className="p-3 bg-white/[0.04] border border-white/10 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#F5F7FA]/60">Total Agreed Price:</span>
              <span className="font-bold text-white font-mono">
                ৳{Number(selectedOrder?.totalAmount || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#F5F7FA]/60">Currently Recorded Paid:</span>
              <span className="font-bold text-emerald-400 font-mono">
                ৳{Number(selectedOrder?.paidAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <Input
            label="Total Paid Amount to Date (৳ BDT) *"
            type="number"
            placeholder="e.g. 20000"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            helperText="If paid amount equals total price, status changes to PAID automatically"
            required
          />

          <div>
            <label className="text-xs font-semibold text-white/90 block mb-1 font-mono">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs bg-[#140A03] text-white focus:outline-none focus:border-[#FFA500]"
            >
              <option value="MANUAL">Manual Cash / Other</option>
              <option value="BKASH">bKash</option>
              <option value="NAGAD">Nagad</option>
              <option value="BANK_TRANSFER">Bank Wire / Deposit</option>
              <option value="CARD">Debit / Credit Card</option>
            </select>
          </div>

          <Input
            label="Transaction ID / Reference (Optional)"
            placeholder="e.g. TRX98273612"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="outline"
              className="glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] rounded-full h-10 px-5 text-xs font-semibold"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdatingPayment}
              className="gap-1.5 bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider rounded-full h-10 px-6 shadow-sm border-none"
            >
              <CheckCircle2 className="w-4 h-4 text-[#080402]" />
              <span>{isUpdatingPayment ? 'Saving...' : 'Update Payment'}</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* UPDATE STATUS MODAL */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Order Workflow Status"
        description={`Set status for "${selectedOrder?.title}"`}
        maxWidth="md"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
          <div className="space-y-2">
            {[
              { value: 'DRAFT', label: 'DRAFT', desc: 'Order drafted, waiting for confirmation' },
              { value: 'CONFIRMED', label: 'CONFIRMED', desc: 'Client agreed, order confirmed' },
              { value: 'IN_PROGRESS', label: 'IN_PROGRESS', desc: 'Active execution underway' },
              { value: 'IN_REVIEW', label: 'IN_REVIEW', desc: 'Work in client review' },
              { value: 'COMPLETED', label: 'COMPLETED', desc: 'Completed & delivered' },
              { value: 'CANCELLED', label: 'CANCELLED', desc: 'Order cancelled' },
            ].map((s) => (
              <label
                key={s.value}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  newStatus === s.value
                    ? 'border-[#FFA500] bg-[#FFA500]/15'
                    : 'border-white/10 hover:bg-white/[0.04]'
                }`}
              >
                <input
                  type="radio"
                  name="orderStatus"
                  value={s.value}
                  checked={newStatus === s.value}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-0.5 accent-[#FFA500]"
                />
                <div>
                  <span className="text-xs font-bold text-white block">{s.label}</span>
                  <span className="text-[11px] text-[#F5F7FA]/60">{s.desc}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="outline"
              className="glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] rounded-full h-10 px-5 text-xs font-semibold"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdatingStatus}
              className="gap-1.5 bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider rounded-full h-10 px-6 shadow-sm border-none"
            >
              <span>{isUpdatingStatus ? 'Updating...' : 'Save Status'}</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* FINALIZE & DELIVERY MODAL */}
      <Modal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        title="Complete & Deliver Order"
        description={`Record final delivery assets for "${selectedOrder?.title}"`}
        maxWidth="md"
      >
        <form onSubmit={handleUpdateDelivery} className="space-y-4 pt-2">
          <Input
            label="Final Delivery URL (Google Drive, Vercel, GitHub, etc.)"
            placeholder="https://drive.google.com/... or https://myapp.com"
            value={deliveryUrl}
            onChange={(e) => setDeliveryUrl(e.target.value)}
          />

          <p className="text-xs text-[#F5F7FA]/60">
            Clicking Confirm will mark the order status as <span className="font-bold text-emerald-400">COMPLETED</span> and attach the final delivery link.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="outline"
              className="glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] rounded-full h-10 px-5 text-xs font-semibold"
              onClick={() => setIsDeliveryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdatingDelivery}
              className="gap-1.5 bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider rounded-full h-10 px-6 shadow-sm border-none"
            >
              <PackageCheck className="w-4 h-4 text-[#080402]" />
              <span>{isUpdatingDelivery ? 'Completing...' : 'Confirm Delivery & Complete'}</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* ASSIGN WORKER MODAL */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Specialist to Order"
        description={`For ${selectedOrder?.title} (${selectedOrder?.orderNumber})`}
        maxWidth="md"
      >
        <form onSubmit={handleAssignWorker} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-white/90 block mb-1 font-mono">
              Select Team Specialist
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 text-xs bg-[#140A03] text-white focus:outline-none focus:border-[#FFA500]"
              required
            >
              <option value="">-- Choose specialist --</option>
              {teamMembers.map((member: any) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/[0.08]">
            {selectedOrder?.assignments?.some((a: any) => !a.unassignedAt) ? (
              <Button
                type="button"
                variant="danger"
                size="sm"
                className="rounded-full px-4 text-xs font-semibold"
                onClick={() => handleUnassignWorker(selectedOrder.id)}
              >
                Unassign Current Worker
              </Button>
            ) : <div />}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] rounded-full h-9 px-4 text-xs font-semibold"
                onClick={() => setIsAssignModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isAssigning}
                className="bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider rounded-full h-9 px-5 shadow-sm border-none"
              >
                {isAssigning ? 'Assigning...' : 'Assign Specialist'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
