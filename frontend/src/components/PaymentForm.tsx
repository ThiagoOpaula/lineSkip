'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { paymentApi } from '@/lib/api';
import { CreditCard } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
}

export default function PaymentForm({ amount, onSuccess }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useStore();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      const result = await paymentApi.process({
        amount,
        currency: 'USD',
        description: `Ticket purchase for ${user?.username || 'guest'}`,
        payment_method: paymentMethod,
      });

      if (result.error) throw new Error(result.error);

      console.log('Payment successful:', result.data);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold">Payment Details</h2>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded">
        <p className="text-gray-600">Total Amount:</p>
        <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Credit Card
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              PayPal
            </label>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
