'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ordersApi, OrderResponse } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { Package, ArrowLeft, CreditCard, QrCode, CheckCircle, Clock } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
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
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center py-16 text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center py-16">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || t('common.error')}</p>
          <a href="/orders" className="text-blue-600 dark:text-blue-400 hover:underline">{t('orders.backToOrders')}</a>
        </div>
      </main>
    );
  }

  const isPending = order.status === 'pending';
  const isCompleted = order.status === 'completed';

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <a
          href="/orders"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('orders.backToOrders')}
        </a>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('orders.orderId')} #{order.id}</h1>
              <div className="flex items-center mt-1">
                {isCompleted ? (
                  <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {t('orders.completed')}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {t('orders.pending')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('orders.orderId')}</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">#{order.id}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('orders.ticketId')}</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">#{order.ticket_id}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">{t('orders.status')}</span>
              <span className={`font-medium capitalize ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {isCompleted ? t('orders.completed') : t('orders.pending')}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 dark:text-gray-400">{t('orders.created')}</span>
              <span className="text-gray-900 dark:text-gray-100">{new Date(order.created_at).toLocaleString()}</span>
            </div>
          </div>

          {order.qr_code && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-2">
                  <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('orders.qrCode')}</h2>
              </div>
              <div className="flex justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <img
                  src={order.qr_code}
                  alt={`QR code for order ${order.id}`}
                  className="w-48 h-48"
                />
              </div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                {t('orders.qrDescription')}
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            {isPending && (
              <button
                onClick={() => router.push(`/orders/${order.id}/payment`)}
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-lg font-medium transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                {t('orders.payNow')}
              </button>
            )}
            <a
              href="/events"
              className="block w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-center transition-colors"
            >
              {t('orders.browseEvents')}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
