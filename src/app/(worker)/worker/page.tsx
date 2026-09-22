'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function WorkerDashboardPage() {
  const { data: assignedOrders, isLoading } = useQuery({
    queryKey: ['worker-assigned-orders'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/orders/assigned?limit=50');
      return res.data?.data || res.data || res || [];
    },
  });

  const orders: any[] = Array.isArray(assignedOrders) ? assignedOrders : [];

  const activeCount = orders.filter((o) => ['ASSIGNED', 'IN_PROGRESS', 'REVISION'].includes(o.status)).length;
  const reviewCount = orders.filter((o) => o.status === 'REVIEW').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Active Workload</span>
            <CardTitle className="text-3xl font-mono">{activeCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Projects currently assigned to you</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Under Review</span>
            <CardTitle className="text-3xl font-mono">{reviewCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Deliverables submitted to clients</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="pb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Delivered & Approved</span>
            <CardTitle className="text-3xl font-mono">{completedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-400">Completed client projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Projects Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-mono tracking-tight text-white">
          Your Assigned Projects
        </h2>

        {isLoading ? (
          <div className="h-48 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse" />
        ) : orders.length > 0 ? (
          <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800 font-mono uppercase">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Project Title</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3 text-right">Action</th>
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
                    <td className="p-3 text-zinc-400 font-mono">
                      {order.client?.name || order.client?.email || 'Client'}
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
                      <Link href={`/worker/orders/${order.orderNumber || order.id}`}>
                        <Button variant="primary" size="sm">
                          Work Workspace →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="border-zinc-800 bg-zinc-950 p-12 text-center">
            <p className="text-xs text-zinc-400">You do not have any active project assignments currently.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
