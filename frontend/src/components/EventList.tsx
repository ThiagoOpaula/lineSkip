'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';

export default function EventList() {
  const router = useRouter();
  const { t } = useTranslation();
  const { events, fetchEvents, isLoading, user } = useStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleBuy = (eventId: number) => {
    if (!user) {
      router.push(`/auth?redirect=/events/${eventId}`);
      return;
    }
    router.push(`/events/${eventId}`);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {isLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('events.empty')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{event.name}</h3>
                  {event.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{event.description}</p>
                  )}
                </div>
              </div>

              <div className="mb-4 space-y-1.5">
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(event.date)}</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('events.price')}: <span className="font-bold text-gray-900 dark:text-gray-100">${event.price.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {event.total_tickets} {t('events.ticketsAvailable')}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  {t('events.backToEvents') !== 'Back to events' ? t('common.viewDetails') : t('common.viewDetails')}
                </button>
                <button
                  onClick={() => handleBuy(event.id)}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {user ? t('events.buyTicket') : t('events.loginToBuy')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
