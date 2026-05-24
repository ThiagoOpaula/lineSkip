'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ordersApi, OrderResponse } from '@/lib/api';
import { Package, ArrowLeft, CreditCard, QrCode, CheckCircle, Clock } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = Number(params.id);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await ordersApi.getById(orderId);
      if (result.error) {
        setError(result.error);
      } else {
        setOrder(result.data);
      }
      setLoading(false);
    }
    load();
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center py-16">Loading order...</div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center py-16">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <a href="/orders" className="text-blue-600 hover:underline">&larr; Back to orders</a>
        </div>
      </main>
    );
  }

  const isPending = order.status === 'pending';
  const isCompleted = order.status === 'completed';

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <a
          href="/orders"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to orders
        </a>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
              <div className="flex items-center mt-1">
                {isCompleted ? (
                  <span className="inline-flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center text-sm text-yellow-600">
                    <Clock className="w-4 h-4 mr-1" />
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Ticket ID</span>
              <span className="font-medium">#{order.ticket_id}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium capitalize ${isCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Created</span>
              <span className="text-gray-900">{new Date(order.created_at).toLocaleString()}</span>
            </div>
          </div>

          {order.qr_code && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center mb-4">
                <QrCode className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold">QR Code</h2>
              </div>
              <div className="flex justify-center bg-gray-50 rounded-lg p-6">
                <img
                  src={order.qr_code}
                  alt={`QR code for order ${order.id}`}
                  className="w-48 h-48"
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-3">
                Show this QR code at the counter to redeem your order
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            {isPending && (
              <button
                onClick={() => router.push(`/orders/${order.id}/payment`)}
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-lg font-medium"
              >
                <CreditCard className="w-5 h-5" />
                Pay Now
              </button>
            )}
            <a
              href="/events"
              className="block w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-center"
            >
              Browse More Events
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
