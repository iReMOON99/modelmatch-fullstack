import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  ModelProfile,
  AgencyProfile,
  Request,
  Message,
  Conversation,
  Notification,
  Transaction,
  Favorite,
  SubscriptionPlan,
  Microservice,
  AdminStats,
  SupportTicket,
  Event,
  PromoCode,
  UserRole,
  RequestStatus,
  ModelFilters,
  AgencyFilters,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, role: UserRole, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Login failed');
          }

          const data = await response.json();
          
          const user: User = {
            ...data.user,
            balance: 0,
            subscriptionType: 'free',
            isVerified: true,
            isEmailVerified: true,
            createdAt: new Date(),
          };

          set({ 
            user, 
            token: data.token,
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },
      
      register: async (email, password, role, name) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role, name }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Registration failed');
          }

          const data = await response.json();
          
          const user: User = {
            ...data.user,
            balance: 0,
            subscriptionType: 'free',
            isVerified: false,
            isEmailVerified: false,
            createdAt: new Date(),
          };

          set({ 
            user, 
            token: data.token,
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Profile Store
interface ProfileState {
  modelProfile: ModelProfile | null;
  agencyProfile: AgencyProfile | null;
  isLoading: boolean;
  updateModelProfile: (profile: Partial<ModelProfile>) => void;
  updateAgencyProfile: (profile: Partial<AgencyProfile>) => void;
  setModelProfile: (profile: ModelProfile | null) => void;
  setAgencyProfile: (profile: AgencyProfile | null) => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  modelProfile: null,
  agencyProfile: null,
  isLoading: false,
  
  updateModelProfile: (profileData) => {
    set((state) => ({
      modelProfile: state.modelProfile 
        ? { ...state.modelProfile, ...profileData }
        : null,
    }));
  },
  
  updateAgencyProfile: (profileData) => {
    set((state) => ({
      agencyProfile: state.agencyProfile 
        ? { ...state.agencyProfile, ...profileData }
        : null,
    }));
  },
  
  setModelProfile: (profile) => set({ modelProfile: profile }),
  setAgencyProfile: (profile) => set({ agencyProfile: profile }),
}));

// Catalog Store
interface CatalogState {
  models: User[];
  agencies: User[];
  modelFilters: ModelFilters;
  agencyFilters: AgencyFilters;
  isLoading: boolean;
  totalModels: number;
  totalAgencies: number;
  setModelFilters: (filters: ModelFilters) => void;
  setAgencyFilters: (filters: AgencyFilters) => void;
  fetchModels: () => Promise<void>;
  fetchAgencies: () => Promise<void>;
  setModels: (models: User[]) => void;
  setAgencies: (agencies: User[]) => void;
}

export const useCatalogStore = create<CatalogState>()((set, get) => ({
  models: [],
  agencies: [],
  modelFilters: {},
  agencyFilters: {},
  isLoading: false,
  totalModels: 0,
  totalAgencies: 0,
  
  setModelFilters: (filters) => set({ modelFilters: filters }),
  setAgencyFilters: (filters) => set({ agencyFilters: filters }),
  
  fetchModels: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return mock data
    set({ isLoading: false });
  },
  
  fetchAgencies: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
  
  setModels: (models) => set({ models }),
  setAgencies: (agencies) => set({ agencies }),
}));

// Requests Store
interface RequestsState {
  sentRequests: Request[];
  receivedRequests: Request[];
  isLoading: boolean;
  sendRequest: (toUserId: string, type: Request['type'], message?: string) => Promise<boolean>;
  respondToRequest: (requestId: string, status: RequestStatus) => Promise<boolean>;
  fetchRequests: () => Promise<void>;
}

export const useRequestsStore = create<RequestsState>()((set) => ({
  sentRequests: [],
  receivedRequests: [],
  isLoading: false,
  
  sendRequest: async (toUserId, type, message) => {
    const newRequest: Request = {
      id: Math.random().toString(36).substr(2, 9),
      fromUserId: 'current-user',
      toUserId,
      type,
      status: 'pending',
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      sentRequests: [...state.sentRequests, newRequest],
    }));
    
    return true;
  },
  
  respondToRequest: async (requestId, status) => {
    set((state) => ({
      receivedRequests: state.receivedRequests.map(req =>
        req.id === requestId ? { ...req, status, updatedAt: new Date() } : req
      ),
    }));
    return true;
  },
  
  fetchRequests: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
}));

// Messages Store
interface MessagesState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<boolean>;
  setCurrentConversation: (conversation: Conversation | null) => void;
}

export const useMessagesStore = create<MessagesState>()((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  
  fetchConversations: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
  
  fetchMessages: async (conversationId) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
  
  sendMessage: async (receiverId, content) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'current-user',
      receiverId,
      content,
      createdAt: new Date(),
      isRead: false,
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    
    return true;
  },
  
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
}));

// Balance Store
interface BalanceState {
  transactions: Transaction[];
  isLoading: boolean;
  deposit: (amount: number, paymentMethod: string) => Promise<boolean>;
  purchase: (amount: number, description: string) => Promise<boolean>;
  fetchTransactions: () => Promise<void>;
}

export const useBalanceStore = create<BalanceState>()((set) => ({
  transactions: [],
  isLoading: false,
  
  deposit: async (amount, paymentMethod) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'current-user',
      type: 'deposit',
      amount,
      status: 'completed',
      paymentMethod,
      description: `Deposit $${amount}`,
      createdAt: new Date(),
    };
    
    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    }));
    
    return true;
  },
  
  purchase: async (amount, description) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'current-user',
      type: 'purchase',
      amount: -amount,
      status: 'completed',
      description,
      createdAt: new Date(),
    };
    
    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    }));
    
    return true;
  },
  
  fetchTransactions: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
}));

// Favorites Store
interface FavoritesState {
  favorites: Favorite[];
  isLoading: boolean;
  addToFavorites: (targetUserId: string) => Promise<boolean>;
  removeFromFavorites: (favoriteId: string) => Promise<boolean>;
  fetchFavorites: () => Promise<void>;
  isFavorite: (targetUserId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favorites: [],
  isLoading: false,
  
  addToFavorites: async (targetUserId) => {
    const newFavorite: Favorite = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'current-user',
      targetUserId,
      createdAt: new Date(),
    };
    
    set((state) => ({
      favorites: [...state.favorites, newFavorite],
    }));
    
    return true;
  },
  
  removeFromFavorites: async (favoriteId) => {
    set((state) => ({
      favorites: state.favorites.filter(fav => fav.id !== favoriteId),
    }));
    return true;
  },
  
  fetchFavorites: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
  
  isFavorite: (targetUserId) => {
    return get().favorites.some(fav => fav.targetUserId === targetUserId);
  },
}));

// Notifications Store
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  
  fetchNotifications: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
  
  markAsRead: async (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
  
  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map(notif => ({ ...notif, isRead: true })),
      unreadCount: 0,
    }));
  },
  
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));

// Admin Store
interface AdminState {
  stats: AdminStats | null;
  users: User[];
  transactions: Transaction[];
  supportTickets: SupportTicket[];
  events: Event[];
  promoCodes: PromoCode[];
  isLoading: boolean;
  fetchStats: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchSupportTickets: () => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'blocked' | 'banned') => Promise<boolean>;
  verifyUser: (userId: string) => Promise<boolean>;
  respondToTicket: (ticketId: string, response: string) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>()((set, get) => ({
  stats: null,
  users: [],
  transactions: [],
  supportTickets: [],
  events: [],
  promoCodes: [],
  isLoading: false,
  
  fetchStats: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockStats: AdminStats = {
      totalUsers: 1543,
      onlineUsers: 127,
      newUsersToday: 23,
      revenueToday: 456,
      revenueWeek: 3245,
      revenueMonth: 15432,
      microtransactionsRevenue: 8432,
      subscriptionsRevenue: 7000,
      pendingVerifications: 15,
      pendingSupportTickets: 8,
    };
    
    set({ stats: mockStats, isLoading: false });
  },
  
  fetchUsers: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
  
  fetchTransactions: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
  
  fetchSupportTickets: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
  
  updateUserStatus: async (userId, status) => {
    return true;
  },
  
  verifyUser: async (userId) => {
    return true;
  },
  
  respondToTicket: async (ticketId, response) => {
    return true;
  },
}));

// UI Store
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: string;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      theme: 'light',
      language: 'en',
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

// Subscription Plans Data
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'model_plus',
    name: 'Model Plus',
    price: 29,
    period: 'monthly',
    features: [
      'Unlimited profile views',
      '10 contacts per month',
      'Priority in search results',
      'Profile statistics',
      'No daily limits',
    ],
    forRole: 'model',
  },
  {
    id: 'agency_pro',
    name: 'Agency Pro',
    price: 99,
    period: 'monthly',
    features: [
      'Everything in Model Plus',
      'Mass messaging (100/month)',
      'API access',
      'Personal manager',
      'Advanced analytics',
    ],
    forRole: 'agency',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 199,
    period: 'monthly',
    features: [
      'Exclusive homepage placement',
      'Social media promotion',
      'Top verification badge',
      'Unlimited everything',
      'VIP support',
    ],
    forRole: 'both',
  },
];

// Microservices Data
export const microservices: Microservice[] = [
  {
    id: 'open_contacts',
    name: 'Open Contacts',
    price: 3,
    description: 'View phone, email, and social media of any profile',
    icon: 'contact',
  },
  {
    id: 'extra_request',
    name: 'Extra Request',
    price: 1,
    description: 'Send additional request beyond daily limit',
    icon: 'send',
  },
  {
    id: 'boost_profile',
    name: 'Boost Profile',
    price: 2,
    description: 'Top position in search results for 24 hours',
    icon: 'trending-up',
  },
  {
    id: 'who_viewed',
    name: 'Who Viewed',
    price: 1,
    description: 'See who visited your profile in the last 7 days',
    icon: 'eye',
  },
  {
    id: 'urgent_request',
    name: 'Urgent Request',
    price: 2,
    description: 'Priority placement in agency queue',
    icon: 'zap',
  },
];
