'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { authApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Home, Ticket, Package, LayoutDashboard, LogOut, User, Calendar, Menu, X } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useStore();
  const { t } = useTranslation();
  const [hydrated, setHydrated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = isAuthenticated
    ? [
        { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { href: '/events', label: t('nav.events'), icon: Calendar },
        { href: '/tickets', label: t('nav.tickets'), icon: Ticket },
        { href: '/orders', label: t('nav.orders'), icon: Package },
      ]
    : [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/events', label: t('nav.events'), icon: Calendar },
        { href: '/tickets', label: t('nav.tickets'), icon: Ticket },
      ];

  const navContent = (
    <>
      <div className="flex items-center">
        <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">LineSkip</span>
        </Link>
        <div className="hidden md:flex ml-10 space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <LanguageSwitcher />
        {isAuthenticated ? (
          <>
            <Link
              href="/dashboard"
              className="hidden md:flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <User className="w-4 h-4 mr-1" />
              <span className="text-sm">{user?.username}</span>
            </Link>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="hidden md:flex items-center text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth"
              className="hidden md:inline-flex text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              href="/auth?mode=register"
              className="hidden md:inline-flex bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {t('nav.register')}
            </Link>
          </>
        )}

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </>
  );

  if (!hydrated) {
    return (
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">LineSkip</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {navContent}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    <User className="w-4 h-4 mr-2" />
                    {user?.username}
                  </div>
                  <button
                    onClick={() => { logout(); router.push('/'); setMobileMenuOpen(false); }}
                    className="flex items-center w-full text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link
                    href="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/auth?mode=register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 text-center transition-colors"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
