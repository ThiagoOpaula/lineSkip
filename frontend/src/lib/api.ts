const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: null as T,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Auth endpoints
export const authApi = {
  login: (username: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, password: string, email: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    }),
};

// Ticket endpoints
export const ticketsApi = {
  getAll: () => apiRequest('/tickets'),
  getById: (id: number) => apiRequest(`/tickets/${id}`),
  create: (data: { user_id: number; event_name: string; price: number }) =>
    apiRequest('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: { event_name?: string; price?: number }) =>
    apiRequest(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest(`/tickets/${id}`, {
      method: 'DELETE',
    }),
};

// Order endpoints
export const ordersApi = {
  getAll: () => apiRequest('/orders'),
  getById: (id: number) => apiRequest(`/orders/${id}`),
  create: (data: { user_id: number; ticket_id: number; status: string }) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Payment endpoints
export const paymentApi = {
  process: (data: { amount: number; currency: string; description: string; payment_method: string }) =>
    apiRequest('/payment/process', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
