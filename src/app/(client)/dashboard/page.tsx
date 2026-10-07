'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FolderKanban,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  ShoppingBag,
} from 'lucide-react';

export default function ClientDashboardPage() {
  // Fetch client orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/orders/my?limit=5');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  // Fetch client quote requests
  const { data: quotesData, isLoading: quotesLoading } = useQuery({
    queryKey: ['my-quotes'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/quote-requests/my?limit=5');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  const orders: any[] = Array.isArray(ordersData) ? ordersData : [];
  const quotes: any[] = Array.isArray(quotesData) ? quotesData : [];

  const activeOrdersCount = orders.filter(
    (o) => !['COMPLETED', 'CANCELLED'].includes(o.status),
  ).length;

  const completedOrdersCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const pendingQuotesCount = quotes.filter((q) => q.status !== 'CANCELLED').length;

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
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-slate-200/90 bg-white hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Active Projects
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                {activeOrdersCount}
              </div>
              <p className="text-xs text-slate-500 pt-1">In progress or awaiting review</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200/90 bg-white hover:border-orange-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Requirement Briefs
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                {pendingQuotesCount}
              </div>
              <p className="text-xs text-slate-500 pt-1">Briefs submitted for custom quotes</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200/90 bg-white hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Completed Orders
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                {completedOrdersCount}
              </div>
              <p className="text-xs text-slate-500 pt-1">Finalized & delivered deliverables</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Active Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Recent Projects & Orders
            </h2>
            <p className="text-xs text-slate-500">Live timeline and delivery status of your ongoing contracts</p>
          </div>
          <Link href="/dashboard/orders">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {ordersLoading ? (
          <div className="h-32 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
        ) : orders.length > 0 ? (
          <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-mono uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                      </td>
                      <td className="p-4 text-slate-800 font-medium">
                        {order.service?.name || order.title}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-orange-500 h-full rounded-full"
                              style={{ width: `${order.progress || 0}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-500 text-[10px]">{order.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/dashboard/orders/${order.orderNumber || order.id}`}>
                          <Button variant="primary" size="sm" className="text-xs">
                            Open Room →
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Card className="border-slate-200/90 bg-white p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No Active Orders Yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto">
              Submit your project requirement brief to receive a customized quote and get started.
            </p>
            <Link href="/services">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Explore Services & Request a Quote</span>
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Recent Quotes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Requirement Briefs & Quotes
            </h2>
            <p className="text-xs text-slate-500">Commercial proposals and project briefs waiting for your review</p>
          </div>
          <Link href="/dashboard/quotes">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              <span>View All Quotes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {quotesLoading ? (
          <div className="h-32 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
        ) : quotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quotes.map((req) => (
              <Card key={req.id} className="border-slate-200/90 bg-white p-5 flex flex-col justify-between hover:border-orange-300 hover:shadow-xs transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="neutral" className="text-[10px]">{req.service?.name || 'Service'}</Badge>
                    <Badge variant={req.quote ? 'primary' : 'outline'} className="text-[10px]">{req.status}</Badge>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">
                    {req.projectName || 'Custom Project Brief'}
                  </h3>

                  {req.quote ? (
                    <div className="p-3.5 bg-orange-50/60 border border-orange-100 rounded-xl space-y-1">
                      <span className="text-[10px] text-orange-700 font-mono font-bold uppercase block">
                        Commercial Proposal Received:
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-extrabold font-mono text-slate-900">
                          ৳{Number(req.quote.amount || 0).toLocaleString()} {req.quote.currency || 'BDT'}
                        </span>
                        <span className="text-xs text-slate-600 font-mono">
                          {req.quote.estimatedDays || 7} Days Timeline
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      Under evaluation by project managers. Custom quote will arrive shortly.
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex justify-end">
                  <Link href="/dashboard/quotes">
                    <Button variant={req.quote ? 'primary' : 'outline'} size="sm" className="text-xs">
                      {req.quote ? 'Review Proposal →' : 'View Brief Details'}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-slate-200/90 bg-white p-8 text-center">
            <p className="text-xs text-slate-500">No requirement briefs submitted yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
