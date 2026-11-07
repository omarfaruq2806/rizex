'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
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
        <Card className="glass-level-2 border border-white/10 bg-white/[0.02] p-5 rounded-2xl hover:border-[#FFA500]/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-neutral-400 uppercase">
                Active Workload
              </span>
              <div className="text-3xl font-extrabold font-mono text-white">{activeCount}</div>
              <p className="text-xs text-neutral-500 pt-1">Projects currently assigned to you</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFA500]/10 border border-[#FFA500]/20 text-[#FFA500] flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="glass-level-2 border border-white/10 bg-white/[0.02] p-5 rounded-2xl hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-neutral-400 uppercase">
                Under Review
              </span>
              <div className="text-3xl font-extrabold font-mono text-white">{reviewCount}</div>
              <p className="text-xs text-neutral-500 pt-1">Deliverables submitted to clients</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="glass-level-2 border border-white/10 bg-white/[0.02] p-5 rounded-2xl hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-neutral-400 uppercase">
                Delivered & Approved
              </span>
              <div className="text-3xl font-extrabold font-mono text-white">{completedCount}</div>
              <p className="text-xs text-neutral-500 pt-1">Completed client projects</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Assigned Projects Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Your Assigned Projects
          </h2>
          <p className="text-xs text-neutral-400">Access project rooms to collaborate with clients and submit deliverable artifacts</p>
        </div>

        {isLoading ? (
          <div className="h-48 glass-level-2 border border-white/10 rounded-2xl animate-pulse" />
        ) : orders.length > 0 ? (
          <div className="border border-white/10 rounded-2xl overflow-hidden glass-level-2 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-neutral-400 border-b border-white/10 font-mono uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Project Title</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4 text-right">Workspace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-4 font-mono font-bold text-white">
                        {order.orderNumber}
                      </td>
                      <td className="p-4 text-white font-semibold">
                        {order.title}
                      </td>
                      <td className="p-4 text-neutral-300">
                        <span className="font-medium text-white block">{order.client?.name || 'Client'}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">{order.client?.email}</span>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-4">
                        <div className="w-24 space-y-1">
                          <span className="font-mono text-neutral-400 font-bold text-[10px]">{order.progress || 0}%</span>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#FFA500] to-[#FF4500] h-full rounded-full"
                              style={{ width: `${order.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/worker/orders/${order.orderNumber || order.id}`}>
                          <Button variant="primary" size="sm" className="text-xs gap-1.5 shadow-lg shadow-[#FFA500]/20">
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
          <Card className="glass-level-2 border border-white/10 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-neutral-400 flex items-center justify-center mx-auto mb-2">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No Active Project Assignments</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              You do not have any active project assignments currently. New projects assigned by the Admin will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
