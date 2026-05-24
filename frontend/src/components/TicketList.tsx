'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';
import { Ticket } from 'lucide-react';

export default function TicketList() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tickets, fetchTickets, isLoading, user } = useStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handlePurchase = (ticketId: number) => {
    if (!user) {
      router.push(`/auth?redirect=/tickets/${ticketId}`);
      return;
    }
    router.push(`/tickets/${ticketId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t('tickets.available')}</h2>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('tickets.empty')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Ticket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{ticket.event_name}</h3>
              </div>

              <div className="mb-4 space-y-1.5">
                <p className="text-gray-600 dark:text-gray-300">
                  {t('tickets.price')}: <span className="font-bold text-gray-900 dark:text-gray-100">${ticket.price.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('tickets.created')}: {new Date(ticket.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/tickets/${ticket.id}`)}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  {t('tickets.viewDetails')}
                </button>
                <button
                  onClick={() => handlePurchase(ticket.id)}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {user ? t('tickets.purchase') : t('tickets.loginToBuy')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
