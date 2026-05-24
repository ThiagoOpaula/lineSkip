'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';
import { QrCode, Package } from 'lucide-react';

export default function OrderList() {
  const router = useRouter();
  const { t } = useTranslation();
  const { orders, fetchOrders, isLoading, user } = useStore();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">{t('orders.loginRequired')}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t('orders.title')}</h2>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('orders.empty')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('orders.orderId')} #{order.id}</h3>
              </div>

              <div className="mb-4 space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  {t('orders.ticketId')}: <span className="font-medium text-gray-900 dark:text-gray-100">{order.ticket_id}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('orders.status')}:{' '}
                  <span className={`font-medium capitalize ${
                    order.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                    order.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {order.status === 'completed' ? t('orders.completed') :
                     order.status === 'pending' ? t('orders.pending') :
                     order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('orders.created')}: {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              {order.qr_code && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-2">
                    <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('orders.qrCode')}</span>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={order.qr_code}
                      alt={`QR code for order ${order.id}`}
                      className="w-32 h-32"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="w-full py-2 px-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                >
                  {t('orders.viewDetails')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
