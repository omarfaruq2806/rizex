'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FolderKanban,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';

export default function ClientOrdersPage() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['my-all-orders'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/orders/my?limit=50');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  const orders: any[] = Array.isArray(ordersData) ? ordersData : [];

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Projects & Active Orders
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track execution progress, chat directly with assigned specialists, and download milestone deliverables
          </p>
        </div>

        <Link href="/services">
          <Button variant="primary" size="sm" className="gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Start New Project</span>
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="h-64 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
      ) : orders.length > 0 ? (
        <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4">Started</th>
                  <th className="p-4 text-right">Project Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="p-4 text-slate-900 font-semibold">
                      {order.title}
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      {order.service?.name || 'Service'}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-4">
                      <div className="w-24 space-y-1">
                        <span className="font-mono text-slate-600 font-bold text-[10px]">{order.progress || 0}%</span>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-orange-500 h-full rounded-full"
                            style={{ width: `${order.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/orders/${order.orderNumber || order.id}`}>
                        <Button variant="primary" size="sm" className="text-xs gap-1.5">
                          <span>Enter Room</span>
                          <ArrowRight className="w-3 h-3" />
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
        <Card className="border-slate-200/90 bg-white p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No Project Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Submit your dynamic requirement brief to receive a customized quote and start your first project.
          </p>
          <Link href="/services">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Explore Services & Submit a Requirement</span>
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
