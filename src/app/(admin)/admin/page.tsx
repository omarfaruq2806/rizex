'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
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
        <Card className="relative overflow-hidden border-slate-200/90 bg-white hover:border-orange-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Total Orders
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {statsLoading ? '...' : stats.total || orders.length || 0}
              </div>
              <p className="text-xs text-slate-500 pt-1">All lifecycle projects</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Active In-Progress */}
        <Card className="relative overflow-hidden border-slate-200/90 bg-white hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Active Execution
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {statsLoading ? '...' : stats.inProgress || 0}
              </div>
              <p className="text-xs text-slate-500 pt-1">Assigned & in-progress</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Under Review */}
        <Card className="relative overflow-hidden border-slate-200/90 bg-white hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Under Review
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {statsLoading ? '...' : stats.review || 0}
              </div>
              <p className="text-xs text-slate-500 pt-1">Awaiting client sign-off</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Completed */}
        <Card className="relative overflow-hidden border-slate-200/90 bg-white hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Completed
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {statsLoading ? '...' : stats.completed || 0}
              </div>
              <p className="text-xs text-slate-500 pt-1">Delivered & verified</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Access Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/admin/services" className="group">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <PackagePlus className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Manage Services</div>
                <div className="text-[11px] text-slate-500">Add or edit offerings</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link href="/admin/quotes" className="group">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileQuestion className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Quote Requests</div>
                <div className="text-[11px] text-slate-500">Respond to client briefs</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link href="/admin/users" className="group">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Users & Roles</div>
                <div className="text-[11px] text-slate-500">Team specialist accounts</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link href="/admin/chats" className="group">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Supervise Chat</div>
                <div className="text-[11px] text-slate-500">Order communications</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* Global Orders Management Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Recent Platform Orders
            </h2>
            <p className="text-xs text-slate-500">
              Live tracking of recent customer engagements across all categories
            </p>
          </div>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {ordersLoading ? (
          <div className="h-64 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
        ) : orders.length > 0 ? (
          <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-mono uppercase tracking-wider text-[11px]">
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
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                      </td>
                      <td className="p-4 font-medium text-slate-800">
                        {order.title}
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="font-medium text-slate-800">{order.client?.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{order.client?.email}</div>
                      </td>
                      <td className="p-4 font-mono text-slate-600">
                        {order.service?.name}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-4">
                        <div className="w-24 space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-500">
                            <span>{order.progress || 0}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full transition-all"
                              style={{ width: `${Math.min(100, Math.max(0, order.progress || 0))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Link href="/admin/orders">
                          <Button variant="outline" size="sm" className="text-xs">
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
          <Card className="p-12 text-center border-slate-200/90 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Once clients accept custom quotes or place orders, they will appear in this real-time supervision feed.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
