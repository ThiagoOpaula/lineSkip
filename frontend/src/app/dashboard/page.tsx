'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';
import TicketList from '@/components/TicketList';
import OrderList from '@/components/OrderList';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useStore();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
            <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('nav.dashboard')}</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, {user.username}</p>
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
