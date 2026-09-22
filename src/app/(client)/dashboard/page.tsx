'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ClientDashboardPage() {
  // Fetch client orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/orders/my?limit=5');
      return res.data?.data || res.data || res || [];
    },
  });

  // Fetch client quote requests
  const { data: quotesData, isLoading: quotesLoading } = useQuery({
    queryKey: ['my-quotes'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/quote-requests/my?limit=5');
      return res.data?.data || res.data || res || [];
    },
  });

  const orders: any[] = Array.isArray(ordersData) ? ordersData : [];
  const quotes: any[] = Array.isArray(quotesData) ? quotesData : [];

  const activeOrdersCount = orders.filter(
    (o) => !['COMPLETED', 'CANCELLED'].includes(o.status),
  ).length;

  const completedOrdersCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const pendingQuotesCount = quotes.filter((q) => q.status !== 'CANCELLED').length;

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              Active Projects
            </span>
            <CardTitle className="text-3xl font-mono">{activeOrdersCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">In-progress or under client review</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              Requirement Briefs
            </span>
            <CardTitle className="text-3xl font-mono">{pendingQuotesCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Briefs submitted for custom quotes</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              Completed Orders
            </span>
            <CardTitle className="text-3xl font-mono">{completedOrdersCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Successfully finalized & delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-mono tracking-tight text-white">
            Recent Projects & Orders
          </h2>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="font-mono text-xs">
              View All Orders →
            </Button>
          </Link>
        </div>

        {ordersLoading ? (
          <div className="h-32 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse" />
        ) : orders.length > 0 ? (
          <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800 font-mono uppercase">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-3 font-mono font-semibold text-white">
                      {order.orderNumber}
                    </td>
                    <td className="p-3 text-zinc-300">
                      {order.service?.name || order.title}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{order.status}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-white h-full"
                            style={{ width: `${order.progress || 0}%` }}
                          />
                        </div>
                        <span className="font-mono text-zinc-400">{order.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <Link href={`/dashboard/orders/${order.orderNumber || order.id}`}>
                        <Button variant="outline" size="sm">
                          Open Room →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="border-zinc-800 bg-zinc-950 p-6 text-center">
            <p className="text-xs text-zinc-400 mb-3">You have no active orders yet.</p>
            <Link href="/services">
              <Button variant="primary" size="sm">
                Explore Services & Request a Quote
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Recent Quotes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-mono tracking-tight text-white">
            Requirement Briefs & Quotes
          </h2>
          <Link href="/dashboard/quotes">
            <Button variant="ghost" size="sm" className="font-mono text-xs">
              View All Quotes →
            </Button>
          </Link>
        </div>

        {quotesLoading ? (
          <div className="h-32 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse" />
        ) : quotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quotes.map((req) => (
              <Card key={req.id} className="border-zinc-800 bg-zinc-950 p-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="neutral">{req.service?.name || 'Service'}</Badge>
                    <Badge variant="outline">{req.status}</Badge>
                  </div>
                  <h3 className="font-semibold text-sm text-white">
                    {req.projectName || 'Custom Project Brief'}
                  </h3>
                  {req.quote ? (
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded space-y-1">
                      <span className="text-[11px] text-zinc-400 block font-mono">
                        Quote Received:
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold font-mono text-white">
                          {req.quote.amount} {req.quote.currency || 'BDT'}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">
                          {req.quote.estimatedDays || 7} Days Timeline
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">
                      Under review by project managers. Custom quote pending.
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-2 border-t border-zinc-900 flex justify-end">
                  <Link href="/dashboard/quotes">
                    <Button variant="outline" size="sm">
                      {req.quote ? 'Review Quote →' : 'View Brief Details'}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-zinc-800 bg-zinc-950 p-6 text-center">
            <p className="text-xs text-zinc-400">No requirement briefs submitted yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
