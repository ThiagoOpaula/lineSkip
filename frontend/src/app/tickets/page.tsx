'use client';

import TicketList from '@/components/TicketList';

export default function TicketsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tickets</h1>
        <TicketList />
      </div>
    </main>
  );
}
