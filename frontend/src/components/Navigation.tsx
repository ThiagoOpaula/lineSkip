'use client';

import { useStore } from '@/store/useStore';
import { Home, Ticket, Package, LogOut, User } from 'lucide-react';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useStore();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">LineSkip</span>
            </a>
            <div className="hidden md:flex ml-10 space-x-8">
              <a
                href="/"
                className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </a>
              <a
                href="/tickets"
                className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Ticket className="w-4 h-4 mr-1" />
                Tickets
              </a>
              {isAuthenticated && (
                <a
                  href="/orders"
                  className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Package className="w-4 h-4 mr-1" />
                  Orders
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <a
                  href="/orders"
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <User className="w-4 h-4 mr-1" />
                  <span className="text-sm">{user?.username}</span>
                </a>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/auth"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </a>
                <a
                  href="/auth?mode=register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
