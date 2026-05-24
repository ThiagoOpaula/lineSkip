'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';
import { Ticket, Shield, Clock, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const features = [
    {
      icon: Ticket,
      title: t('landing.features.easyBooking'),
      desc: t('landing.features.easyBookingDesc'),
      color: 'blue',
    },
    {
      icon: Shield,
      title: t('landing.features.securePayments'),
      desc: t('landing.features.securePaymentsDesc'),
      color: 'green',
    },
    {
      icon: Clock,
      title: t('landing.features.saveTime'),
      desc: t('landing.features.saveTimeDesc'),
      color: 'purple',
    },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            {t('landing.hero.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/tickets"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium inline-flex items-center gap-2"
            >
              {t('landing.hero.browseTickets')}
              <ArrowRight className="w-5 h-5" />
            </a>
            {!isAuthenticated && (
              <a
                href="/auth"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-lg font-medium"
              >
                {t('landing.hero.getStarted')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
            {t('landing.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              const colors = colorMap[feature.color as keyof typeof colorMap];
              return (
                <div key={feature.title} className="text-center p-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} rounded-full mb-4`}>
                    <Icon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('landing.cta.subtitle')}
          </p>
          <a
            href="/tickets"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium"
          >
            {t('landing.cta.viewTickets')}
          </a>
        </div>
      </div>
    </main>
  );
}
