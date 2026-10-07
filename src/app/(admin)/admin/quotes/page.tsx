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
} from 'lucide-react';

export default function AdminQuotesPage() {
  const queryClient = useQueryClient();

  const [selectedBrief, setSelectedBrief] = useState<any | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Quote Form State
  const [amount, setAmount] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('7');
  const [revisions, setRevisions] = useState('2');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all quote requests
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
      setAmount('');
      setAdvanceAmount('');
      setEstimatedDays('7');
      setRevisions('2');
      setNotes('');
    }
    setIsQuoteModalOpen(true);
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
      alert('Custom quote generated and sent to client!');
      setIsQuoteModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create quote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBriefStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">AWAITING QUOTE</Badge>;
      case 'QUOTED':
        return <Badge variant="primary">QUOTED</Badge>;
      case 'ACCEPTED':
        return <Badge variant="success">ACCEPTED / ORDERED</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">REJECTED</Badge>;
      case 'CHANGES_REQUESTED':
        return <Badge variant="warning">CHANGES REQUESTED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Client Requirement Briefs & Quote Generation
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Inspect client responses to service questionnaires and generate customized commercial proposals
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
                  <th className="p-4">Client</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Commercial Quote</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {briefs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 block">{b.client?.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{b.client?.email}</span>
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-800">
                      {b.service?.name}
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {b.projectName || 'Custom Project Brief'}
                    </td>
                    <td className="p-4">
                      {getBriefStatusBadge(b.status)}
                    </td>
                    <td className="p-4 font-mono">
                      {b.quote ? (
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">
                            ৳{Number(b.quote.amount || 0).toLocaleString()} {b.quote.currency}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Advance: ৳{Number(b.quote.advanceAmount || 0).toLocaleString()} • {b.quote.estimatedDays} days
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No Quote Sent</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant={b.quote ? 'outline' : 'primary'}
                        size="sm"
                        className="text-xs gap-1.5"
                        onClick={() => handleOpenQuoteModal(b)}
                      >
                        <Send className="w-3 h-3" />
                        <span>{b.quote ? 'Update Quote' : 'Create Quote →'}</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center border-slate-200/90 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No Requirement Briefs Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When clients fill out dynamic service questionnaires, their briefs will appear here for pricing and review.
          </p>
        </Card>
      )}

      {/* CREATE QUOTE MODAL */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        title="Generate Commercial Proposal & Quote"
        description={`For ${selectedBrief?.client?.name} (${selectedBrief?.service?.name})`}
        maxWidth="xl"
      >
        <form onSubmit={handleGenerateQuote} className="space-y-4 pt-2">
          {/* Submitted Client Questionnaire Responses */}
          {selectedBrief?.requirementValues && selectedBrief.requirementValues.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 max-h-56 overflow-y-auto">
              <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block">
                📋 Client Submitted Answers & Specifications:
              </span>
              <div className="space-y-2">
                {selectedBrief.requirementValues.map((rv: any) => (
                  <div key={rv.id} className="text-xs p-2.5 bg-white border border-slate-100 rounded-xl space-y-0.5">
                    <span className="text-slate-500 font-medium block">{rv.field?.label || 'Question'}:</span>
                    <span className="text-slate-900 font-semibold block">
                      {typeof rv.value === 'object' ? JSON.stringify(rv.value) : String(rv.value || 'N/A')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              isLoading={isSubmitting}
              className="gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Send Commercial Quote →</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
