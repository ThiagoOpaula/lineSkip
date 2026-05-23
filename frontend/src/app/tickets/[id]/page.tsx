'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ticketsApi, TicketResponse } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { Ticket, ArrowLeft, ShoppingCart, LogIn } from 'lucide-react';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
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
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center py-16">Loading ticket...</div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center py-16">
          <p className="text-red-600 mb-4">{error || 'Ticket not found'}</p>
          <a href="/tickets" className="text-blue-600 hover:underline">&larr; Back to tickets</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <a
          href="/tickets"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to tickets
        </a>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ticket.event_name}</h1>
              <p className="text-gray-500 text-sm">Ticket #{ticket.id}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Price</span>
              <span className="text-2xl font-bold text-blue-600">${ticket.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Created</span>
              <span className="text-gray-900">{new Date(ticket.created_at).toLocaleDateString()}</span>
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
                {purchasing ? 'Processing...' : `Purchase for $${ticket.price.toFixed(2)}`}
              </button>
            ) : (
              <a
                href={`/auth?redirect=/tickets/${ticketId}`}
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
