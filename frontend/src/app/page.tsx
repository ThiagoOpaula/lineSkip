'use client';

import { useStore } from '@/store/useStore';
import { Ticket, Package, Shield, Clock } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useStore();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to LineSkip
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Skip the ticket line! Purchase food tickets online and go directly to the food line.
            Fast, convenient, and hassle-free.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/tickets"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Browse Tickets
            </a>
            {!isAuthenticated && (
              <a
                href="/auth"
                className="px-8 py-4 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium"
              >
                Get Started
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose LineSkip?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Ticket className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Purchase tickets online in just a few clicks. No more waiting in long lines.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Your payment information is protected with industry-standard encryption.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-gray-600">
                Skip the line and go straight to the food counter. Your time is valuable!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Skip the Line?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who have already discovered the convenience of LineSkip.
          </p>
          <a
            href="/tickets"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium"
          >
            View Available Tickets
          </a>
        </div>
      </div>
    </main>
  );
}
