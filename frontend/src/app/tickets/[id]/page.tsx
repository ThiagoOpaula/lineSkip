'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ticketsApi, TicketResponse } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';
import { Ticket, ArrowLeft, ShoppingCart, LogIn } from 'lucide-react';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated, createOrder } = useStore();
  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const ticketId = Number(params.id);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await ticketsApi.getById(ticketId);
      if (result.error) {
        setError(result.error);
      } else {
        setTicket(result.data);
      }
      setLoading(false);
    }
    load();
  }, [ticketId]);

  const handlePurchase = async () => {
    if (!user) return;
    setPurchasing(true);
    try {
      const order = await createOrder(ticketId);
      router.push(`/orders/${order.id}`);
    } catch {
      setError('Failed to purchase ticket');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center py-16 text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center py-16">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || t('common.error')}</p>
          <a href="/tickets" className="text-blue-600 dark:text-blue-400 hover:underline">{t('tickets.backToTickets')}</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <a
          href="/tickets"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('tickets.backToTickets')}
        </a>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
              <Ticket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{ticket.event_name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('tickets.ticketId')} #{ticket.id}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('tickets.price')}</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${ticket.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('tickets.created')}</span>
              <span className="text-gray-900 dark:text-gray-100">{new Date(ticket.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-8">
            {isAuthenticated ? (
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {purchasing ? t('common.processing') : `${t('tickets.purchase')} $${ticket.price.toFixed(2)}`}
              </button>
            ) : (
              <a
                href={`/auth?redirect=/tickets/${ticketId}`}
                className="block w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-center flex items-center justify-center gap-2 text-lg font-medium transition-colors"
              >
                <LogIn className="w-5 h-5" />
                {t('tickets.loginToPurchase')}
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
