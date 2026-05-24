'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { useStore } from '@/store/useStore';
import { useTranslation } from 'react-i18next';

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'register') {
      setMode('register');
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AuthForm
          mode={mode}
          onToggleMode={() => setMode(mode === 'login' ? 'register' : 'login')}
        />
      </div>
    </main>
  );
}

export default function AuthPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-500 dark:text-gray-400">{t('common.loading')}</div>}>
      <AuthContent />
    </Suspense>
  );
}
