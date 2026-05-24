import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, ticketsApi, ordersApi, eventsApi, EventResponse, OrderStatus } from '@/lib/api';

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
  ticket_id: number | null;
  event_id: number | null;
  status: OrderStatus;
  created_at: string;
  qr_code: string | null;
}

type Event = EventResponse;

interface StoreState {
  // User state
  user: User | null;
  isAuthenticated: boolean;

  // Tickets state
  tickets: Ticket[];
  selectedTicket: Ticket | null;

  // Events state
  events: Event[];
  selectedEvent: Event | null;

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

  fetchEvents: () => Promise<void>;
  selectEvent: (event: Event | null) => void;
  createOrderForEvent: (event_id: number) => Promise<Order>;

  fetchOrders: () => Promise<void>;
  selectOrder: (order: Order | null) => void;
  createOrder: (ticket_id: number) => Promise<Order>;

  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      tickets: [],
      selectedTicket: null,
      events: [],
      selectedEvent: null,
      orders: [],
      selectedOrder: null,
      isLoading: false,
      error: null,

      // User actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.login(username, password);
          if (result.error) throw new Error(result.error);
          set({ user: result.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Login failed', isLoading: false });
          throw error;
        }
      },

      register: async (username: string, password: string, email: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.register(username, password, email);
          if (result.error) throw new Error(result.error);
          set({ user: result.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Registration failed', isLoading: false });
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
          const result = await ticketsApi.getAll();
          if (result.error) throw new Error(result.error);
          set({ tickets: result.data || [], isLoading: false });
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
          const result = await ticketsApi.create({ user_id: user.id, event_name, price });
          if (result.error) throw new Error(result.error);
          set({ tickets: [...get().tickets, result.data], isLoading: false });
        } catch (error) {
          set({ error: 'Failed to create ticket', isLoading: false });
          throw error;
        }
      },

      // Event actions
      fetchEvents: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await eventsApi.getAll();
          if (result.error) throw new Error(result.error);
          set({ events: result.data || [], isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch events', isLoading: false });
        }
      },

      selectEvent: (event) => set({ selectedEvent: event }),

      createOrderForEvent: async (event_id: number) => {
        const { user } = get();
        if (!user) throw new Error('User not authenticated');

        set({ isLoading: true, error: null });
        try {
          const result = await ordersApi.create({ user_id: user.id, event_id, status: 'pending' });
          if (result.error) throw new Error(result.error);
          const orders = [...get().orders, result.data];
          set({ orders, isLoading: false });
          return result.data;
        } catch (error) {
          set({ error: 'Failed to create order', isLoading: false });
          throw error;
        }
      },

      // Order actions
      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await ordersApi.getAll();
          if (result.error) throw new Error(result.error);
          set({ orders: result.data || [], isLoading: false });
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
          const result = await ordersApi.create({ user_id: user.id, ticket_id, status: 'pending' });
          if (result.error) throw new Error(result.error);
          const orders = [...get().orders, result.data];
          set({ orders, isLoading: false });
          return result.data;
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
