'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  PackagePlus,
  FileQuestion,
  Users,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

export default function AdminOverviewPage() {
  // Fetch platform order stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/orders/stats');
      return res.data || res || {};
    },
  });

  // Fetch recent platform orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/orders?limit=10');
      return res.data?.data || res.data || res || [];
    },
  });

  const stats = statsData || {};
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
      case 'CANCELLED':
        return <Badge variant="danger">CANCELLED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Platform Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Orders */}
        <Card className="relative overflow-hidden border-white/12 hover:border-[#FFA500]/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#F5F7FA]/60 uppercase">
                Total Orders
              </span>
              <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {statsLoading ? '...' : stats.total || orders.length || 0}
              </div>
              <p className="text-xs text-[#F5F7FA]/50 pt-1">All lifecycle projects</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFA500]/15 border border-[#FFA500]/30 flex items-center justify-center text-[#FFA500]">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Active In-Progress */}
        <Card className="relative overflow-hidden border-white/12 hover:border-blue-400/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#F5F7FA]/60 uppercase">
                Active Execution
              </span>
              <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {statsLoading ? '...' : stats.inProgress || 0}
              </div>
              <p className="text-xs text-[#F5F7FA]/50 pt-1">Assigned & in-progress</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Under Review */}
        <Card className="relative overflow-hidden border-white/12 hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#F5F7FA]/60 uppercase">
                Under Review
              </span>
              <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {statsLoading ? '...' : stats.review || 0}
              </div>
              <p className="text-xs text-[#F5F7FA]/50 pt-1">Awaiting client sign-off</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Completed */}
        <Card className="relative overflow-hidden border-white/12 hover:border-emerald-400/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#F5F7FA]/60 uppercase">
                Completed
              </span>
              <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {statsLoading ? '...' : stats.completed || 0}
              </div>
              <p className="text-xs text-[#F5F7FA]/50 pt-1">Delivered & verified</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Access Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/admin/services" className="group">
          <div className="p-4 rounded-2xl glass-level-2 border border-white/12 hover:border-[#FFA500]/50 transition-all flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FFA500]/15 text-[#FFA500] group-hover:bg-[#FFA500] group-hover:text-[#080402] transition-colors">
                <PackagePlus className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Manage Services</div>
                <div className="text-[11px] text-[#F5F7FA]/50">Add or edit offerings</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#FFA500] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link href="/admin/quotes" className="group">
          <div className="p-4 rounded-2xl glass-level-2 border border-white/12 hover:border-blue-400/50 transition-all flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <FileQuestion className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Quote Requests</div>
                <div className="text-[11px] text-[#F5F7FA]/50">Respond to client briefs</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link href="/admin/users" className="group">
          <div className="p-4 rounded-2xl glass-level-2 border border-white/12 hover:border-purple-400/50 transition-all flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Users & Roles</div>
                <div className="text-[11px] text-[#F5F7FA]/50">Team specialist accounts</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link href="/admin/chats" className="group">
          <div className="p-4 rounded-2xl glass-level-2 border border-white/12 hover:border-emerald-400/50 transition-all flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Supervise Chat</div>
                <div className="text-[11px] text-[#F5F7FA]/50">Order communications</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* Global Orders Management Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recent Platform Orders
            </h2>
            <p className="text-xs text-[#F5F7FA]/60">
              Live tracking of recent customer engagements across all categories
            </p>
          </div>
          <Link href="/admin/orders">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] rounded-full h-8 px-4"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#FFA500]" />
            </Button>
          </Link>
        </div>

        {ordersLoading ? (
          <div className="h-64 glass-level-2 border border-white/12 rounded-2xl animate-pulse" />
        ) : orders.length > 0 ? (
          <div className="border border-white/12 rounded-2xl overflow-hidden glass-level-2 shadow-xl bg-white/[0.02]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-[#F5F7FA]/60 border-b border-white/[0.08] font-mono uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Project</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-[#F5F7FA]/80">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="p-4 font-mono font-bold text-white">
                        {order.orderNumber}
                      </td>
                      <td className="p-4 font-medium text-white">
                        {order.title}
                      </td>
                      <td className="p-4 text-[#F5F7FA]/75">
                        <div className="font-medium text-white">{order.client?.name}</div>
                        <div className="text-[10px] text-[#F5F7FA]/40 font-mono">{order.client?.email}</div>
                      </td>
                      <td className="p-4 font-mono text-[#F5F7FA]/70">
                        {order.service?.name}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-4">
                        <div className="w-24 space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-[#F5F7FA]/60">
                            <span>{order.progress || 0}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] rounded-full transition-all"
                              style={{ width: `${Math.min(100, Math.max(0, order.progress || 0))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Link href="/admin/orders">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] hover:border-[#FFA500]/50 h-7 px-3 rounded-full"
                          >
                            Manage →
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
          <Card className="p-12 text-center border-white/12">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 text-[#FFA500] flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No Orders Placed Yet</h3>
            <p className="text-xs text-[#F5F7FA]/60 mt-1 max-w-sm mx-auto">
              Once clients accept custom quotes or place orders, they will appear in this real-time supervision feed.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
