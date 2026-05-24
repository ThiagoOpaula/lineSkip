'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { eventsApi, EventResponse } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { Calendar, ArrowLeft, ShoppingCart, LogIn } from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, createOrderForEvent } = useStore();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const eventId = Number(params.id);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await eventsApi.getById(eventId);
      if (result.error) {
        setError(result.error);
      } else {
        setEvent(result.data);
      }
      setLoading(false);
    }
    load();
  }, [eventId]);

  const handlePurchase = async () => {
    if (!user) return;
    setPurchasing(true);
    try {
      const order = await createOrderForEvent(eventId);
      router.push(`/orders/${order.id}`);
    } catch {
      setError('Failed to purchase ticket');
    } finally {
      setPurchasing(false);
    }
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center py-16">Loading event...</div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center py-16">
          <p className="text-red-600 mb-4">{error || 'Event not found'}</p>
          <a href="/events" className="text-blue-600 hover:underline">&larr; Back to events</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <a
          href="/events"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to events
        </a>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
              <p className="text-gray-500 text-sm">Event #{event.id}</p>
            </div>
          </div>

          {event.description && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{event.description}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Date & Time</span>
              <span className="text-gray-900 font-medium">{formatDate(event.date)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Price</span>
              <span className="text-2xl font-bold text-blue-600">${event.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Available Tickets</span>
              <span className="text-gray-900">{event.total_tickets}</span>
            </div>
          </div>

          <div className="mt-8">
            {isAuthenticated ? (
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                {purchasing ? 'Processing...' : `Purchase for $${event.price.toFixed(2)}`}
              </button>
            ) : (
              <a
                href={`/auth?redirect=/events/${eventId}`}
                className="block w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-center flex items-center justify-center gap-2 text-lg font-medium"
              >
                <LogIn className="w-5 h-5" />
                Login to Purchase
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
