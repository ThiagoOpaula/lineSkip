'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { useStore } from '@/store/useStore';

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
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
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
