'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { authApi } from '@/lib/api';
import { Home, Ticket, Package, LayoutDashboard, LogOut, User, Calendar } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    if (useStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsub;
  }, []);

  // Verify persisted user still exists in the database
  useEffect(() => {
    if (hydrated && user && isAuthenticated) {
      authApi.me(user.id).then((res) => {
        if (res.error) {
          logout();
          router.push('/auth');
        }
      });
    }
  }, [hydrated]);

  if (!hydrated) {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-xl font-bold text-blue-600">LineSkip</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
              <span className="text-xl font-bold text-blue-600">LineSkip</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/"
                  className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Link>
              )}
              <Link
                href="/events"
                className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Events
              </Link>
              <Link
                href="/tickets"
                className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Ticket className="w-4 h-4 mr-1" />
                Tickets
              </Link>
              {isAuthenticated && (
                <Link
                  href="/orders"
                  className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Package className="w-4 h-4 mr-1" />
                  Orders
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <User className="w-4 h-4 mr-1" />
                  <span className="text-sm">{user?.username}</span>
                </Link>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="flex items-center text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth?mode=register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
