'use client';

import EventList from '@/components/EventList';

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h1>
        <EventList />
      </div>
    </main>
  );
}
