'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  CheckCircle2,
  Send,
  Plus,
} from 'lucide-react';

export default function ClientQuotesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const [modalType, setModalType] = useState<'VIEW' | 'REQUEST_CHANGES' | null>(null);
  const [changeNotes, setChangeNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: quotesData, isLoading } = useQuery({
    queryKey: ['my-quotes-full'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/quote-requests/my?limit=50');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  const briefs: any[] = Array.isArray(quotesData) ? quotesData : [];

  const handleAcceptQuote = async (quoteId: string) => {
    if (!confirm('Are you sure you want to accept this commercial proposal and initiate project execution?')) return;

    setIsProcessing(true);
    try {
      const response = await apiClient.post<any>(`/quotes/${quoteId}/accept`);
      const order = response.data?.data?.order || response.data?.order;
      queryClient.invalidateQueries({ queryKey: ['my-quotes-full'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });

      alert('Quote accepted! Your project order room has been created.');
      if (order?.orderNumber) {
        router.push(`/dashboard/orders/${order.orderNumber}`);
      } else {
        router.push('/dashboard/orders');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to accept quote. Please try again.');
    } finally {
      setIsProcessing(false);
      setModalType(null);
    }
  };

  const handleRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    setIsProcessing(true);
    try {
      await apiClient.post(`/quotes/${selectedQuote.id}/request-changes`, {
        notes: changeNotes,
      });
      queryClient.invalidateQueries({ queryKey: ['my-quotes-full'] });
      alert('Modification notes sent to project managers.');
      setModalType(null);
      setChangeNotes('');
    } catch (err: any) {
      alert(err.message || 'Failed to send modification request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectQuote = async (quoteId: string) => {
    if (!confirm('Are you sure you want to reject this proposal?')) return;

    setIsProcessing(true);
    try {
      await apiClient.post(`/quotes/${quoteId}/reject`);
      queryClient.invalidateQueries({ queryKey: ['my-quotes-full'] });
      alert('Quote rejected.');
    } catch (err: any) {
      alert(err.message || 'Failed to reject quote.');
    } finally {
      setIsProcessing(false);
      setModalType(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Requirement Briefs & Commercial Proposals
        </h2>
        <p className="text-xs text-neutral-400">
          Track submitted requirement briefs, compare milestone terms, and approve custom agency quotes
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 glass-level-2 border border-white/10 rounded-2xl" />
          ))}
        </div>
      ) : briefs.length > 0 ? (
        <div className="space-y-4">
          {briefs.map((req) => {
            const quote = req.quote;
            return (
              <Card key={req.id} className="glass-level-2 border border-white/10 p-6 rounded-2xl shadow-xl hover:border-[#FFA500]/40 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral" className="text-[10px]">{req.service?.name || 'Service'}</Badge>
                      <Badge variant={quote ? 'primary' : 'outline'} className="text-[10px]">{req.status}</Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-white mt-1">
                      {req.projectName || 'Project Specification Brief'}
                    </CardTitle>
                    <span className="text-xs text-neutral-400 font-mono block">
                      Submitted on {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {quote ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {quote.status === 'SENT' || quote.status === 'CHANGES_REQUESTED' ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => handleAcceptQuote(quote.id)}
                            className="gap-1.5 text-xs shadow-lg shadow-[#FFA500]/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept & Start Project</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-white/15 hover:border-[#FFA500]/50"
                            onClick={() => {
                              setSelectedQuote(quote);
                              setModalType('REQUEST_CHANGES');
                            }}
                          >
                            Request Changes
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10"
                            onClick={() => handleRejectQuote(quote.id)}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge variant="success">QUOTE {quote.status}</Badge>
                      )}
                    </div>
                  ) : (
                    <Badge variant="warning">UNDER MANAGER EVALUATION</Badge>
                  )}
                </div>

                {/* Quote Breakdown if Available */}
                {quote ? (
                  <div className="mt-4 pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#FFA500]/10 p-4 border border-[#FFA500]/20 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono font-bold block">
                        Total Amount
                      </span>
                      <span className="text-base font-extrabold font-mono text-white">
                        ৳{Number(quote.amount || 0).toLocaleString()} {quote.currency || 'BDT'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono font-bold block">
                        Advance Required
                      </span>
                      <span className="text-sm font-bold font-mono text-neutral-200">
                        ৳{Number(quote.advanceAmount || 0).toLocaleString()} {quote.currency || 'BDT'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono font-bold block">
                        Est. Timeline
                      </span>
                      <span className="text-sm font-bold font-mono text-neutral-200">
                        {quote.estimatedDays || 7} Days
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono font-bold block">
                        Included Revisions
                      </span>
                      <span className="text-sm font-bold font-mono text-neutral-200">
                        {quote.revisions} Revisions
                      </span>
                    </div>

                    {quote.notes && (
                      <div className="col-span-2 sm:col-span-4 mt-2 pt-3 border-t border-[#FFA500]/20 text-xs text-neutral-300">
                        <strong className="text-white font-mono font-bold">Terms & Scope Notes:</strong> {quote.notes}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-neutral-400 italic bg-white/[0.03] p-3 rounded-xl border border-white/10">
                    Our technical lead is currently reviewing your dynamic requirements. You will receive a structured proposal here shortly.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="glass-level-2 border border-white/10 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-neutral-400 flex items-center justify-center mx-auto mb-2">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Requirement Briefs Submitted Yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Browse our catalog and submit a custom intake brief to receive an upfront structured quote.
          </p>
          <Button variant="primary" size="sm" onClick={() => router.push('/services')} className="gap-1.5 text-xs shadow-lg shadow-[#FFA500]/20">
            <Plus className="w-3.5 h-3.5" />
            <span>Explore Services & Submit Brief</span>
          </Button>
        </Card>
      )}

      {/* Request Changes Modal */}
      <Modal
        isOpen={modalType === 'REQUEST_CHANGES'}
        onClose={() => setModalType(null)}
        title="Request Proposal Modifications"
        description="Specify needed adjustments for timeline, budget, scope, or milestone deliverables"
        maxWidth="md"
      >
        <form onSubmit={handleRequestChanges} className="space-y-4 pt-2">
          <Textarea
            label="Modification Notes *"
            placeholder="Explain what adjustments or additions you need in this proposal..."
            value={changeNotes}
            onChange={(e) => setChangeNotes(e.target.value)}
            rows={4}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              className="border-white/15"
              onClick={() => setModalType(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isProcessing}
              className="gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Modification Request</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
