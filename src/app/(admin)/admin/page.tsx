'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="space-y-8">
      {/* Platform Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Total Orders</span>
            <CardTitle className="text-3xl font-mono">{stats.total || orders.length || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">All lifecycle projects</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Active In-Progress</span>
            <CardTitle className="text-3xl font-mono">{stats.inProgress || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Under active specialist execution</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Under Review</span>
            <CardTitle className="text-3xl font-mono">{stats.review || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Deliverables awaiting client approval</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Completed</span>
            <CardTitle className="text-3xl font-mono">{stats.completed || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Finalized and closed projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Global Orders Management Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-mono tracking-tight text-white">
            Recent Global Platform Orders
          </h2>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              Manage Orders & Assignments →
            </Button>
          </Link>
        </div>

        {ordersLoading ? (
          <div className="h-48 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse" />
        ) : orders.length > 0 ? (
          <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800 font-mono uppercase">
                <tr>
                  <th className="p-3">Order Number</th>
                  <th className="p-3">Project Title</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3 text-right">Supervise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-white">
                      {order.orderNumber}
                    </td>
                    <td className="p-3 text-zinc-200 font-medium">
                      {order.title}
                    </td>
                    <td className="p-3 text-zinc-400">
                      {order.client?.name} ({order.client?.email})
                    </td>
                    <td className="p-3 text-zinc-400 font-mono">
                      {order.service?.name}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{order.status}</Badge>
                    </td>
                    <td className="p-3 font-mono">
                      {order.progress || 0}%
                    </td>
                    <td className="p-3 text-right">
                      <Link href="/admin/orders">
                        <Button variant="outline" size="sm">
                          Control →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="border-zinc-800 bg-zinc-950 p-8 text-center">
            <p className="text-xs text-zinc-400">No orders placed on the platform yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
