'use client';

import { useTranslation } from 'react-i18next';
import EventList from '@/components/EventList';

export default function EventsPage() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('events.title')}</h1>
        <EventList />
      </div>
    </main>
  );
}
