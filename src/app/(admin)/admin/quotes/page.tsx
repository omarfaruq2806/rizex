'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import {
  FileText,
  Send,
  CheckCircle2,
  FileQuestion,
  MessageSquare,
  Phone,
  Mail,
  PlusCircle,
} from 'lucide-react';

export default function AdminQuotesPage() {
  const queryClient = useQueryClient();

  const [selectedBrief, setSelectedBrief] = useState<any | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Convert to Order Modal State
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [orderTitle, setOrderTitle] = useState('');
  const [orderAmount, setOrderAmount] = useState('');
  const [orderPaidAmount, setOrderPaidAmount] = useState('0');
  const [orderDeliveryDate, setOrderDeliveryDate] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  // Quote Form State
  const [amount, setAmount] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('7');
  const [revisions, setRevisions] = useState('2');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all quote requests / inquiries
  const { data: briefsData, isLoading } = useQuery({
    queryKey: ['admin-quote-requests'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/quote-requests?limit=50');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  const briefs: any[] = Array.isArray(briefsData) ? briefsData : [];

  const handleOpenConvertModal = (brief: any) => {
    setSelectedBrief(brief);
    setOrderTitle(brief.projectName || `${brief.service?.name || 'Project'} Engagement`);
    setOrderAmount(brief.budget ? String(brief.budget).replace(/[^0-9]/g, '') : '25000');
    setOrderPaidAmount('0');
    setOrderNotes(brief.description || '');

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 10);
    setOrderDeliveryDate(nextWeek.toISOString().split('T')[0]);

    setIsConvertModalOpen(true);
  };

  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrief) return;

    setIsSubmitting(true);
    try {
      await apiClient.post(`/quotes/request/${selectedBrief.id}`, {
        amount: Number(amount),
        advanceAmount: Number(advanceAmount),
        estimatedDays: Number(estimatedDays),
        revisions: Number(revisions),
        notes,
      });

      queryClient.invalidateQueries({ queryKey: ['admin-quote-requests'] });
      setIsQuoteModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to record quote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvertToOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrief) return;

    setIsConverting(true);
    try {
      const payload = {
        quoteRequestId: selectedBrief.id,
        title: orderTitle,
        totalAmount: Number(orderAmount),
        paidAmount: Number(orderPaidAmount),
        expectedDelivery: orderDeliveryDate ? new Date(orderDeliveryDate).toISOString() : undefined,
        notes: orderNotes,
      };

      await apiClient.post('/orders/convert-lead', payload);

      queryClient.invalidateQueries({ queryKey: ['admin-quote-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-recent-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setIsConvertModalOpen(false);
      alert('Official order generated successfully! Client can track and work has begun.');
    } catch (err: any) {
      alert(err.message || 'Failed to create official order.');
    } finally {
      setIsConverting(false);
    }
  };

  const getBriefStatusBadge = (status: string) => {
    switch (status) {
      case 'ORDER_CREATED':
      case 'CONVERTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ORDER CREATED
          </span>
        );
      case 'SUBMITTED':
      case 'PENDING':
        return <Badge variant="warning">NEW INQUIRY</Badge>;
      case 'QUOTE_SENT':
      case 'QUOTED':
        return <Badge variant="primary">CONVERTED / QUOTED</Badge>;
      case 'ACCEPTED':
        return <Badge variant="success">ORDERED</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">CANCELLED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Website Inquiries & Lead Management
        </h2>
        <p className="text-xs text-[#F5F7FA]/60 mt-1">
          Review incoming client inquiries submitted with or without login. Direct WhatsApp chat and convert to official orders.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 glass-level-2 border border-white/12 rounded-2xl animate-pulse" />
      ) : briefs.length > 0 ? (
        <div className="border border-white/12 rounded-2xl overflow-hidden glass-level-2 shadow-xl bg-white/[0.02]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] text-[#F5F7FA]/60 border-b border-white/[0.08] font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Client Contact</th>
                  <th className="p-4">Service & Budget</th>
                  <th className="p-4">Project Brief</th>
                  <th className="p-4">Lead Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#F5F7FA]/80">
                {briefs.map((b) => {
                  const isGuest = b.isGuest || !b.clientId;
                  const clientName = b.client?.name || b.guestName || 'Website Lead';
                  const clientEmail = b.client?.email || b.guestEmail || 'No Email';
                  const clientPhone = b.guestPhone || b.client?.phone || '';

                  // Clean phone for WhatsApp (remove spaces, dashes)
                  const cleanPhone = clientPhone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('88') ? cleanPhone : cleanPhone.startsWith('01') ? `88${cleanPhone}` : cleanPhone;
                  const waMessage = encodeURIComponent(
                    `Hello ${clientName}, thank you for reaching out to RizeX regarding "${b.service?.name}". We reviewed your project brief and would love to discuss the milestones with you!`
                  );
                  const whatsappUrl = cleanPhone ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

                  return (
                    <tr key={b.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-white block text-xs">{clientName}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#F5F7FA]/50 font-mono mt-0.5">
                          <Mail className="w-3 h-3 text-[#FFA500]" />
                          <span>{clientEmail}</span>
                        </div>
                        {clientPhone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#F5F7FA]/75 font-mono mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{clientPhone}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-white block">{b.service?.name}</span>
                        <span className="text-[11px] font-mono text-[#FFA500] font-semibold mt-0.5 block">
                          Budget: {b.budget || 'Open / Discussion'}
                        </span>
                      </td>

                      <td className="p-4 max-w-xs">
                        <span className="font-medium text-white block truncate">
                          {b.projectName || 'Project Inquiry'}
                        </span>
                        <p className="text-[11px] text-[#F5F7FA]/60 line-clamp-2 mt-0.5">
                          {b.description || 'No description provided.'}
                        </p>
                      </td>

                      <td className="p-4">
                        {isGuest ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30 font-mono">
                            WITHOUT LOGIN (GUEST)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                            REGISTERED CLIENT
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {getBriefStatusBadge(b.status)}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* WhatsApp Chat Button */}
                          {whatsappUrl ? (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </a>
                          ) : null}

                          {/* Convert to Official Order Button */}
                          {b.status === 'ORDER_CREATED' || b.status === 'CONVERTED' ? (
                            <button
                              disabled
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.04] text-white/40 font-semibold text-xs border border-white/10 cursor-not-allowed opacity-60"
                              title="Order already created for this inquiry"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Order Created</span>
                            </button>
                          ) : (
                            <Button
                              size="sm"
                              className="text-xs gap-1.5 bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold uppercase rounded-full h-8 px-3.5 shadow-sm border-none"
                              onClick={() => handleOpenConvertModal(b)}
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-[#080402]" />
                              <span>Create Order</span>
                            </Button>
                          )}
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
            <FileQuestion className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Inquiries Received Yet</h3>
          <p className="text-xs text-[#F5F7FA]/60 mt-1 max-w-sm mx-auto">
            When visitors submit quote requests from service cards without login, their lead information will appear here immediately.
          </p>
        </Card>
      )}

      {/* CONVERT TO OFFICIAL ORDER MODAL */}
      <Modal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        title="Convert Inquiry to Official Order"
        description={`Creating official order for ${selectedBrief?.client?.name || selectedBrief?.guestName} (${selectedBrief?.service?.name})`}
        maxWidth="lg"
      >
        <form onSubmit={handleConvertToOrder} className="space-y-4 pt-2">
          <div className="p-3.5 bg-white/[0.04] border border-white/10 rounded-xl space-y-1 text-xs">
            <span className="font-mono font-bold text-[#FFA500] block">Lead Details:</span>
            <div className="text-white/80">
              <span className="font-semibold text-white">{selectedBrief?.client?.name || selectedBrief?.guestName}</span>
              {' • '}{selectedBrief?.client?.email || selectedBrief?.guestEmail}
              {selectedBrief?.guestPhone ? ` • ${selectedBrief.guestPhone}` : ''}
            </div>
            {selectedBrief?.description && (
              <p className="text-[#F5F7FA]/60 italic mt-1">&ldquo;{selectedBrief.description}&rdquo;</p>
            )}
          </div>

          <Input
            label="Order / Project Title *"
            placeholder="e.g. Full-Stack E-commerce Web Application"
            value={orderTitle}
            onChange={(e) => setOrderTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Agreed Total Budget (৳ BDT) *"
              type="number"
              placeholder="e.g. 40000"
              value={orderAmount}
              onChange={(e) => setOrderAmount(e.target.value)}
              required
            />

            <Input
              label="Initial Paid / Advance Amount (৳ BDT)"
              type="number"
              placeholder="e.g. 20000 (0 if unpaid)"
              value={orderPaidAmount}
              onChange={(e) => setOrderPaidAmount(e.target.value)}
            />
          </div>

          <Input
            label="Expected Delivery Deadline"
            type="date"
            value={orderDeliveryDate}
            onChange={(e) => setOrderDeliveryDate(e.target.value)}
          />

          <Textarea
            label="Internal Order Notes / Milestones"
            placeholder="Agreed scope details, milestones, client preferences..."
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="outline"
              className="glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] rounded-full h-10 px-5 text-xs font-semibold"
              onClick={() => setIsConvertModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isConverting}
              className="gap-1.5 bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider rounded-full h-10 px-6 shadow-sm border-none"
            >
              <CheckCircle2 className="w-4 h-4 text-[#080402]" />
              <span>{isConverting ? 'Creating Order...' : 'Confirm & Create Order'}</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* CREATE QUOTE MODAL (Legacy/Formal Quotes) */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        title="Generate Commercial Proposal & Quote"
        description={`For ${selectedBrief?.client?.name || selectedBrief?.guestName} (${selectedBrief?.service?.name})`}
        maxWidth="xl"
      >
        <form onSubmit={handleGenerateQuote} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Quote Amount (BDT) *"
              type="number"
              placeholder="e.g. 35000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              label="Advance Amount (BDT) *"
              type="number"
              placeholder="e.g. 15000"
              value={advanceAmount}
              onChange={(e) => setAdvanceAmount(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimated Timeline (Days) *"
              type="number"
              placeholder="7"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
              required
            />
            <Input
              label="Included Revisions *"
              type="number"
              placeholder="2"
              value={revisions}
              onChange={(e) => setRevisions(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Commercial Scope Terms & Notes"
            placeholder="Specify milestones, deliverable formats, technology stack, or payment terms..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="outline"
              className="glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] rounded-full h-10 px-5 text-xs font-semibold"
              onClick={() => setIsQuoteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-1.5 bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider rounded-full h-10 px-6 shadow-sm border-none"
            >
              <Send className="w-4 h-4 text-[#080402]" />
              <span>{isSubmitting ? 'Recording...' : 'Record Quote'}</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
