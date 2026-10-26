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
  Sparkles,
  DollarSign,
  Clock,
  RotateCcw,
  CheckCircle2,
  FileQuestion,
  Layers,
  ArrowRight,
  MessageSquare,
  User,
  Phone,
  Mail,
  PlusCircle,
  ExternalLink,
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

  const handleOpenQuoteModal = (brief: any) => {
    setSelectedBrief(brief);
    if (brief.quote) {
      setAmount(String(brief.quote.amount || ''));
      setAdvanceAmount(String(brief.quote.advanceAmount || ''));
      setEstimatedDays(String(brief.quote.estimatedDays || '7'));
      setRevisions(String(brief.quote.revisions || '2'));
      setNotes(brief.quote.notes || '');
    } else {
      setAmount(brief.budget ? String(brief.budget).replace(/[^0-9]/g, '') : '');
      setAdvanceAmount('');
      setEstimatedDays('7');
      setRevisions('2');
      setNotes(brief.description || '');
    }
    setIsQuoteModalOpen(true);
  };

  const handleOpenConvertModal = (brief: any) => {
    setSelectedBrief(brief);
    setOrderTitle(brief.projectName || `${brief.service?.name} Order`);
    setOrderAmount(brief.budget ? String(brief.budget).replace(/[^0-9]/g, '') : '20000');
    setOrderPaidAmount('0');
    setOrderDeliveryDate('');
    setOrderNotes(brief.description || '');
    setIsConvertModalOpen(true);
  };

  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrief) return;

    setIsSubmitting(true);
    try {
      await apiClient.post('/quotes', {
        requestId: selectedBrief.id,
        amount: Number(amount),
        advanceAmount: Number(advanceAmount || 0),
        currency: 'BDT',
        estimatedDays: Number(estimatedDays),
        revisions: Number(revisions),
        notes: notes.trim() || undefined,
        sendImmediately: true,
      });

      queryClient.invalidateQueries({ queryKey: ['admin-quote-requests'] });
      alert('Custom quote generated and recorded!');
      setIsQuoteModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create quote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvertToOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrief) return;

    setIsConverting(true);
    try {
      const clientEmail = selectedBrief.client?.email || selectedBrief.guestEmail;
      const clientName = selectedBrief.client?.name || selectedBrief.guestName || 'Client';
      const clientPhone = selectedBrief.guestPhone;

      await apiClient.post('/orders', {
        serviceId: selectedBrief.serviceId,
        inquiryId: selectedBrief.id,
        clientId: selectedBrief.clientId || undefined,
        clientEmail: !selectedBrief.clientId ? clientEmail : undefined,
        clientName: !selectedBrief.clientId ? clientName : undefined,
        clientPhone: !selectedBrief.clientId ? clientPhone : undefined,
        title: orderTitle.trim(),
        totalAmount: Number(orderAmount),
        paidAmount: Number(orderPaidAmount || 0),
        expectedDelivery: orderDeliveryDate ? new Date(orderDeliveryDate).toISOString() : undefined,
        notes: orderNotes.trim() || undefined,
        status: 'CONFIRMED',
      });

      queryClient.invalidateQueries({ queryKey: ['admin-quote-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] });
      alert(`Official Order successfully created! Inquiry status updated to avoid duplicate orders.`);
      setIsConvertModalOpen(false);
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ORDER CREATED
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
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Website Inquiries & Lead Management
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review incoming client inquiries submitted with or without login. Direct WhatsApp chat and convert to official orders.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
      ) : briefs.length > 0 ? (
        <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Client Contact</th>
                  <th className="p-4">Service & Budget</th>
                  <th className="p-4">Project Brief</th>
                  <th className="p-4">Lead Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
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
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-slate-900 block text-xs">{clientName}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{clientEmail}</span>
                        </div>
                        {clientPhone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{clientPhone}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-slate-900 block">{b.service?.name}</span>
                        <span className="text-[11px] font-mono text-orange-700 font-semibold mt-0.5 block">
                          Budget: {b.budget || 'Open / Discussion'}
                        </span>
                      </td>

                      <td className="p-4 max-w-xs">
                        <span className="font-medium text-slate-900 block truncate">
                          {b.projectName || 'Project Inquiry'}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {b.description || 'No description provided.'}
                        </p>
                      </td>

                      <td className="p-4">
                        {isGuest ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            WITHOUT LOGIN (GUEST)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
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
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition-colors"
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
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200 cursor-not-allowed opacity-75"
                              title="Order already created for this inquiry"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Order Created</span>
                            </button>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-xs gap-1"
                              onClick={() => handleOpenConvertModal(b)}
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
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
        <Card className="p-12 text-center border-slate-200/90 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No Inquiries Received Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
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
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <span className="font-mono font-bold text-slate-700 block">Lead Details:</span>
            <div className="text-slate-600">
              <span className="font-semibold text-slate-900">{selectedBrief?.client?.name || selectedBrief?.guestName}</span>
              {' • '}{selectedBrief?.client?.email || selectedBrief?.guestEmail}
              {selectedBrief?.guestPhone ? ` • ${selectedBrief.guestPhone}` : ''}
            </div>
            {selectedBrief?.description && (
              <p className="text-slate-500 italic mt-1">&ldquo;{selectedBrief.description}&rdquo;</p>
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConvertModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isConverting}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsQuoteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : 'Record Quote'}</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
