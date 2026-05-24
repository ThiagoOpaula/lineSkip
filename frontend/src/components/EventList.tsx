'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Calendar } from 'lucide-react';

export default function EventList() {
  const router = useRouter();
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
    return new Date(dateStr).toLocaleDateString('en-US', {
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
        <div className="text-center py-8">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No upcoming events</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start mb-4">
                <Calendar className="w-6 h-6 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  {event.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                  )}
                </div>
              </div>

              <div className="mb-4 space-y-1">
                <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                <p className="text-gray-600">
                  Price: <span className="font-bold">${event.price.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {event.total_tickets} tickets available
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleBuy(event.id)}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {user ? 'Buy Ticket' : 'Login to Buy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
