'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { QrCode, Package } from 'lucide-react';

export default function OrderList() {
  const router = useRouter();
  const { orders, fetchOrders, isLoading, user } = useStore();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center py-8">
        <p className="text-gray-500">Please login to view your orders</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

      {isLoading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No orders yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <Package className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
              </div>

              <div className="mb-4 space-y-2">
                <p className="text-gray-600">
                  Ticket ID: <span className="font-medium">{order.ticket_id}</span>
                </p>
                <p className="text-gray-600">
                  Status: <span className="font-medium capitalize">{order.status}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              {order.qr_code && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center mb-2">
                    <QrCode className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">QR Code</span>
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
                  className="w-full py-2 px-4 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
