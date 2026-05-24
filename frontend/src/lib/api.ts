const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Response types matching backend DTOs
export interface UserResponse {
  id: number;
  username: string;
  email: string;
}

export interface TicketResponse {
  id: number;
  user_id: number;
  event_name: string;
  price: number;
  created_at: string;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

export interface OrderResponse {
  id: number;
  user_id: number;
  ticket_id: number | null;
  event_id: number | null;
  status: OrderStatus;
  created_at: string;
  qr_code: string | null;
}

export interface PaymentResponse {
  payment_id: string;
  status: string;
  amount: number;
  currency: string;
  created_at: string;
}

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
    apiRequest<UserResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, password: string, email: string) =>
    apiRequest<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    }),

  me: (user_id: number) =>
    apiRequest<UserResponse>(`/auth/me?user_id=${user_id}`),
};

// Ticket endpoints
export const ticketsApi = {
  getAll: () => apiRequest<TicketResponse[]>('/tickets'),
  getById: (id: number) => apiRequest<TicketResponse>(`/tickets/${id}`),
  create: (data: { user_id: number; event_name: string; price: number }) =>
    apiRequest<TicketResponse>('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: { event_name?: string; price?: number }) =>
    apiRequest<TicketResponse>(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest<{ message: string }>(`/tickets/${id}`, {
      method: 'DELETE',
    }),
};

export interface EventResponse {
  id: number;
  name: string;
  description: string | null;
  date: string;
  price: number;
  total_tickets: number;
  created_at: string;
}

export const eventsApi = {
  getAll: () => apiRequest<EventResponse[]>('/events'),
  getById: (id: number) => apiRequest<EventResponse>(`/events/${id}`),
};

// Order endpoints
export const ordersApi = {
  getAll: () => apiRequest<OrderResponse[]>('/orders'),
  getById: (id: number) => apiRequest<OrderResponse>(`/orders/${id}`),
  create: (data: { user_id: number; ticket_id?: number; event_id?: number; status: OrderStatus }) =>
    apiRequest<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Payment endpoints
export const paymentApi = {
  process: (data: { amount: number; currency: string; description: string; payment_method: string }) =>
    apiRequest<PaymentResponse>('/payment/process', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
