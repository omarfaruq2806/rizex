'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ClientOrdersPage() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['my-all-orders'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/orders/my?limit=50');
      return res.data?.data || res.data || res || [];
    },
  });

  const orders: any[] = Array.isArray(ordersData) ? ordersData : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-white">
            Projects & Active Orders
          </h2>
          <p className="text-xs text-zinc-400">
            Track execution progress, chat with assigned team members, and download deliverables.
          </p>
        </div>

        <Link href="/services">
          <Button variant="outline" size="sm">
            + Start New Project
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="h-64 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse" />
      ) : orders.length > 0 ? (
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800 font-mono uppercase">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Project Title</th>
                <th className="p-3">Service</th>
                <th className="p-3">Status</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Started</th>
                <th className="p-3 text-right">Control</th>
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
                    {order.service?.name || 'Service'}
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
                  <td className="p-3 text-zinc-500 font-mono">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/dashboard/orders/${order.orderNumber || order.id}`}>
                      <Button variant="primary" size="sm">
                        Project Room →
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-950 p-12 text-center space-y-4">
          <p className="text-sm text-zinc-400">No project orders found.</p>
          <Link href="/services">
            <Button variant="primary">
              Explore Services & Submit a Requirement
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
