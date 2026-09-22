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
      return res.data?.data || res.data || res || [];
    },
  });

  const briefs: any[] = Array.isArray(briefsData) ? briefsData : [];

  const handleOpenQuoteModal = (brief: any) => {
    setSelectedBrief(brief);
    setAmount('');
    setAdvanceAmount('');
    setEstimatedDays('7');
    setRevisions('2');
    setNotes('');
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-tight text-white">
          Client Requirement Briefs & Quote Generation
        </h2>
        <p className="text-xs text-zinc-400">
          Inspect client dynamic requirements and send customized commercial quotes.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse" />
      ) : briefs.length > 0 ? (
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800 font-mono uppercase">
              <tr>
                <th className="p-3">Client</th>
                <th className="p-3">Service</th>
                <th className="p-3">Project Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Quote Details</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {briefs.map((b) => (
                <tr key={b.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="p-3">
                    <span className="font-semibold text-white block">{b.client?.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{b.client?.email}</span>
                  </td>
                  <td className="p-3 font-mono text-zinc-300">
                    {b.service?.name}
                  </td>
                  <td className="p-3 text-zinc-200">
                    {b.projectName || 'Specification Brief'}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline">{b.status}</Badge>
                  </td>
                  <td className="p-3 font-mono">
                    {b.quote ? (
                      <span className="text-zinc-200 font-bold">
                        {b.quote.amount} {b.quote.currency} ({b.quote.status})
                      </span>
                    ) : (
                      <span className="text-zinc-500 italic">No Quote Sent</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant={b.quote ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleOpenQuoteModal(b)}
                    >
                      {b.quote ? 'Update Quote' : 'Create Quote →'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-950 p-12 text-center">
          <p className="text-xs text-zinc-400">No client requirement briefs submitted yet.</p>
        </Card>
      )}

      {/* CREATE QUOTE MODAL */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        title="Generate Custom Commercial Quote"
        description={`For ${selectedBrief?.client?.name} (${selectedBrief?.service?.name})`}
      >
        <form onSubmit={handleGenerateQuote} className="space-y-4 pt-2">
          {selectedBrief?.requirementValues && selectedBrief.requirementValues.length > 0 && (
            <div className="p-3 bg-black border border-zinc-900 rounded space-y-2 max-h-40 overflow-y-auto">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block">
                Client Submitted Brief:
              </span>
              {selectedBrief.requirementValues.map((rv: any) => (
                <div key={rv.id} className="text-xs">
                  <strong className="text-zinc-400">{rv.field?.label || 'Field'}:</strong>{' '}
                  <span className="text-zinc-200">{JSON.stringify(rv.value)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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
            label="Commercial & Scope Terms / Notes"
            placeholder="Specify milestone deliverables, payment terms, or technology stack..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
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
            >
              Send Quote to Client →
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
