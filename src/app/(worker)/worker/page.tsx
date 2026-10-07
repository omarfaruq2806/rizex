'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  FolderKanban,
} from 'lucide-react';

export default function WorkerDashboardPage() {
  const { data: assignedOrders, isLoading } = useQuery({
    queryKey: ['worker-assigned-orders'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/orders/assigned?limit=50');
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  const orders: any[] = Array.isArray(assignedOrders) ? assignedOrders : [];

  const activeCount = orders.filter((o) => ['ASSIGNED', 'IN_PROGRESS', 'REVISION'].includes(o.status)).length;
  const reviewCount = orders.filter((o) => o.status === 'REVIEW').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">COMPLETED</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="primary">IN PROGRESS</Badge>;
      case 'REVIEW':
        return <Badge variant="warning">UNDER CLIENT REVIEW</Badge>;
      case 'ASSIGNED':
        return <Badge variant="outline">ASSIGNED</Badge>;
      case 'REVISION':
        return <Badge variant="danger">REVISION REQUESTED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-slate-200/90 bg-white hover:border-orange-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Active Workload
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900">{activeCount}</div>
              <p className="text-xs text-slate-500 pt-1">Projects currently assigned to you</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200/90 bg-white hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Under Review
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900">{reviewCount}</div>
              <p className="text-xs text-slate-500 pt-1">Deliverables submitted to clients</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200/90 bg-white hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Delivered & Approved
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900">{completedCount}</div>
              <p className="text-xs text-slate-500 pt-1">Completed client projects</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Assigned Projects Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Your Assigned Projects
          </h2>
          <p className="text-xs text-slate-500">Access project rooms to collaborate with clients and submit deliverable artifacts</p>
        </div>

        {isLoading ? (
          <div className="h-48 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
        ) : orders.length > 0 ? (
          <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-mono uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Project Title</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4 text-right">Workspace</th>
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
                      <td className="p-4 text-slate-600">
                        <span className="font-medium text-slate-800 block">{order.client?.name || 'Client'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{order.client?.email}</span>
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
                      <td className="p-4 text-right">
                        <Link href={`/worker/orders/${order.orderNumber || order.id}`}>
                          <Button variant="primary" size="sm" className="text-xs gap-1.5 shadow-xs">
                            <span>Open Workspace</span>
                            <ArrowRight className="w-3.5 h-3.5" />
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
          <Card className="border-slate-200/90 bg-white p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No Active Project Assignments</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You do not have any active project assignments currently. New projects assigned by the Admin will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
