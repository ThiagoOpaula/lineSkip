'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ordersApi, ticketsApi, OrderResponse } from '@/lib/api';
import PaymentForm from '@/components/PaymentForm';
import { ArrowLeft } from 'lucide-react';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = Number(params.id);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const orderResult = await ordersApi.getById(orderId);
      if (orderResult.error) {
        setError(orderResult.error);
        setLoading(false);
        return;
      }
      setOrder(orderResult.data);

      if (orderResult.data.status !== 'pending') {
        setError('This order has already been paid');
        setLoading(false);
        return;
      }

      const ticketId = orderResult.data.ticket_id;
      if (!ticketId) {
        setError('This order does not have a linked ticket');
        setLoading(false);
        return;
      }
      const ticketResult = await ticketsApi.getById(ticketId);
      if (ticketResult.error) {
        setError('Could not load ticket details');
        setLoading(false);
        return;
      }
      setPrice(ticketResult.data.price);
      setLoading(false);
    }
    load();
  }, [orderId]);

  const handleSuccess = () => {
    router.push(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 text-center py-16">Loading payment details...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <a href={`/orders/${orderId}`} className="text-blue-600 hover:underline">
            &larr; Back to order
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <a
          href={`/orders/${orderId}`}
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to order
        </a>

        <PaymentForm amount={price} onSuccess={handleSuccess} />
      </div>
    </main>
  );
}
