'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Ticket } from 'lucide-react';

export default function TicketList() {
  const { tickets, fetchTickets, selectTicket, createOrder, isLoading, user } = useStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handlePurchase = async (ticketId: number) => {
    if (!user) {
      alert('Please login to purchase tickets');
      return;
    }

    try {
      await createOrder(ticketId);
      alert('Ticket purchased successfully!');
    } catch (error) {
      alert('Failed to purchase ticket');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Available Tickets</h2>

      {isLoading ? (
        <div className="text-center py-8">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No tickets available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <Ticket className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold">{ticket.event_name}</h3>
              </div>

              <div className="mb-4">
                <p className="text-gray-600">
                  Price: <span className="font-bold">${ticket.price.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(ticket.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => selectTicket(ticket)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  View Details
                </button>
                <button
                  onClick={() => handlePurchase(ticket.id)}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
