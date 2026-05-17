import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Ticket {
  id: number;
  user_id: number;
  event_name: string;
  price: number;
  created_at: string;
}

interface Order {
  id: number;
  user_id: number;
  ticket_id: number;
  status: string;
  created_at: string;
  qr_code?: string;
}

interface StoreState {
  // User state
  user: User | null;
  isAuthenticated: boolean;

  // Tickets state
  tickets: Ticket[];
  selectedTicket: Ticket | null;

  // Orders state
  orders: Order[];
  selectedOrder: Order | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
  logout: () => void;

  fetchTickets: () => Promise<void>;
  selectTicket: (ticket: Ticket | null) => void;
  createTicket: (event_name: string, price: number) => Promise<void>;

  fetchOrders: () => Promise<void>;
  selectOrder: (order: Order | null) => void;
  createOrder: (ticket_id: number) => Promise<void>;

  setError: (error: string | null) => void;
  clearError: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      tickets: [],
      selectedTicket: null,
      orders: [],
      selectedOrder: null,
      isLoading: false,
      error: null,

      // User actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const user = await response.json();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Login failed', isLoading: false });
          throw error;
        }
      },

      register: async (username: string, password: string, email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email }),
          });

          if (!response.ok) {
            throw new Error('Registration failed');
          }

          const user = await response.json();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Registration failed', isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, orders: [], tickets: [] });
      },

      // Ticket actions
      fetchTickets: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/tickets`);
          if (!response.ok) throw new Error('Failed to fetch tickets');
          const tickets = await response.json();
          set({ tickets, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch tickets', isLoading: false });
        }
      },

      selectTicket: (ticket) => set({ selectedTicket: ticket }),

      createTicket: async (event_name: string, price: number) => {
        const { user } = get();
        if (!user) throw new Error('User not authenticated');

        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id, event_name, price }),
          });

          if (!response.ok) throw new Error('Failed to create ticket');
          const ticket = await response.json();
          set({ tickets: [...get().tickets, ticket], isLoading: false });
        } catch (error) {
          set({ error: 'Failed to create ticket', isLoading: false });
          throw error;
        }
      },

      // Order actions
      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/orders`);
          if (!response.ok) throw new Error('Failed to fetch orders');
          const orders = await response.json();
          set({ orders, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch orders', isLoading: false });
        }
      },

      selectOrder: (order) => set({ selectedOrder: order }),

      createOrder: async (ticket_id: number) => {
        const { user } = get();
        if (!user) throw new Error('User not authenticated');

        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id, ticket_id, status: 'pending' }),
          });

          if (!response.ok) throw new Error('Failed to create order');
          const order = await response.json();
          set({ orders: [...get().orders, order], isLoading: false });
        } catch (error) {
          set({ error: 'Failed to create order', isLoading: false });
          throw error;
        }
      },

      // Error actions
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'lineskip-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
