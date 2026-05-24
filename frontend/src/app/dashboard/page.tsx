'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import TicketList from '@/components/TicketList';
import OrderList from '@/components/OrderList';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="text-center py-16">Redirecting...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <LayoutDashboard className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user.username}</p>
          </div>
        </div>

        <div className="mb-12">
          <TicketList />
        </div>

        <div>
          <OrderList />
        </div>
      </div>
    </main>
  );
}
