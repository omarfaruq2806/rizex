'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';

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
      return res.data?.data || res.data || res || [];
    },
  });

  const briefs: any[] = Array.isArray(quotesData) ? quotesData : [];

  const handleAcceptQuote = async (quoteId: string) => {
    if (!confirm('Are you sure you want to accept this quote and start the order?')) return;

    setIsProcessing(true);
    try {
      const response = await apiClient.post<any>(`/quotes/${quoteId}/accept`);
      const order = response.data?.data?.order || response.data?.order;
      queryClient.invalidateQueries({ queryKey: ['my-quotes-full'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });

      alert('Quote accepted! Your project order has been created.');
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
    if (!confirm('Are you sure you want to reject this quote?')) return;

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
        <h2 className="text-xl font-bold font-mono tracking-tight text-white">
          Requirement Briefs & Proposals
        </h2>
        <p className="text-xs text-zinc-400">
          Track submitted briefs and review customized agency quotes.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-zinc-950 border border-zinc-800 rounded-lg" />
          ))}
        </div>
      ) : briefs.length > 0 ? (
        <div className="space-y-4">
          {briefs.map((req) => {
            const quote = req.quote;
            return (
              <Card key={req.id} className="border-zinc-800 bg-zinc-950 p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral">{req.service?.name || 'Service'}</Badge>
                      <Badge variant="outline">{req.status}</Badge>
                    </div>
                    <CardTitle className="text-base font-mono mt-1">
                      {req.projectName || 'Project Specification Brief'}
                    </CardTitle>
                    <span className="text-xs text-zinc-500 font-mono">
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
                          >
                            Accept & Start Order
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
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
                            className="text-red-400 hover:text-red-300"
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
                    <Badge variant="neutral">QUOTE PENDING</Badge>
                  )}
                </div>

                {/* Quote Breakdown if Available */}
                {quote ? (
                  <div className="mt-4 pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-900/50 p-4 border border-zinc-800 rounded">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                        Total Amount
                      </span>
                      <span className="text-sm font-bold font-mono text-white">
                        {quote.amount} {quote.currency || 'BDT'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                        Advance Required
                      </span>
                      <span className="text-sm font-bold font-mono text-zinc-300">
                        {quote.advanceAmount} {quote.currency || 'BDT'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                        Est. Timeline
                      </span>
                      <span className="text-sm font-bold font-mono text-zinc-300">
                        {quote.estimatedDays || 7} Days
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                        Revisions Included
                      </span>
                      <span className="text-sm font-bold font-mono text-zinc-300">
                        {quote.revisions} Revisions
                      </span>
                    </div>

                    {quote.notes && (
                      <div className="col-span-2 sm:col-span-4 mt-2 pt-2 border-t border-zinc-800 text-xs text-zinc-400">
                        <strong className="text-zinc-300 font-mono">Manager Notes:</strong> {quote.notes}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-zinc-500">
                    Our technical lead is currently reviewing your dynamic requirements. You will receive a structured proposal here shortly.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-950 p-12 text-center space-y-4">
          <p className="text-sm text-zinc-400">You haven&apos;t submitted any requirement briefs yet.</p>
          <Button variant="primary" onClick={() => router.push('/services')}>
            Explore Services & Submit a Brief
          </Button>
        </Card>
      )}

      {/* Request Changes Modal */}
      <Modal
        isOpen={modalType === 'REQUEST_CHANGES'}
        onClose={() => setModalType(null)}
        title="Request Quote Modifications"
        description="Specify adjustments needed for timeline, budget, scope, or milestones."
      >
        <form onSubmit={handleRequestChanges} className="space-y-4 pt-2">
          <Textarea
            label="Modification Notes *"
            placeholder="Explain what changes you would like to see in this quote..."
            value={changeNotes}
            onChange={(e) => setChangeNotes(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalType(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isProcessing}
            >
              Send Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
