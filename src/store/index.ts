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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, role: UserRole, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  uploadAvatar: (file: File) => Promise<string | null>;
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

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }
          
          const user: User = {
            ...data.user,
            balance: data.user.balance || 0,
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
          
          // Also update profile store if data is available
          if (data.user.modelProfile) {
            useProfileStore.getState().setModelProfile(data.user.modelProfile);
          } else if (data.user.agencyProfile) {
            useProfileStore.getState().setAgencyProfile(data.user.agencyProfile);
          }
          
          return { success: true };
        } catch (error: any) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return { success: false, error: error.message };
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

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
          }
          
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

          // Also update profile store if data is available
          if (data.user.modelProfile) {
            useProfileStore.getState().setModelProfile(data.user.modelProfile);
          } else if (data.user.agencyProfile) {
            useProfileStore.getState().setAgencyProfile(data.user.agencyProfile);
          }
          
          return { success: true };
        } catch (error: any) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      uploadAvatar: async (file: File) => {
        const token = get().token;
        if (!token) return null;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
          const response = await fetch(`${API_URL}/api/user/avatar`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
          });

          if (!response.ok) throw new Error('Failed to upload avatar');
          
          const data = await response.json();
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, avatar: data.avatarUrl } });
          }
          return data.avatarUrl;
        } catch (error) {
          console.error('Avatar upload error:', error);
          return null;
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

// Social Store (Gifts & Stickers)
interface Gift {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

interface Sticker {
  id: string;
  imageUrl: string;
}

interface StickerPack {
  id: string;
  name: string;
  stickers: Sticker[];
}

interface SocialState {
  gifts: Gift[];
  stickerPacks: StickerPack[];
  isLoading: boolean;
  fetchGifts: () => Promise<void>;
  fetchStickers: () => Promise<void>;
  sendGift: (giftId: string, receiverId: string) => Promise<boolean>;
}

export const useSocialStore = create<SocialState>()((set, get) => ({
  gifts: [],
  stickerPacks: [],
  isLoading: false,

  fetchGifts: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/social/gifts`);
      if (response.ok) {
        const data = await response.json();
        set({ gifts: data });
      }
    } catch (error) {
      console.error('Fetch gifts error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStickers: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/social/stickers`);
      if (response.ok) {
        const data = await response.json();
        set({ stickerPacks: data });
      }
    } catch (error) {
      console.error('Fetch stickers error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  sendGift: async (giftId, receiverId) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/api/social/send-gift`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ giftId, receiverId }),
      });

      if (response.ok) {
        // Update user balance in auth store
        const gift = get().gifts.find(g => g.id === giftId);
        if (gift) {
          const user = useAuthStore.getState().user;
          if (user) {
            useAuthStore.getState().updateUser({ 
              balance: (user.balance || 0) - gift.price 
            });
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Send gift error:', error);
      return false;
    }
  }
}));

// Profile Store
interface ProfileState {
  modelProfile: ModelProfile | null;
  agencyProfile: AgencyProfile | null;
  isLoading: boolean;
  fetchProfile: (userId: string) => Promise<any>;
  updateProfile: (profileData: any) => Promise<boolean>;
  uploadPhotos: (files: FileList) => Promise<string[] | null>;
  updateModelProfile: (profile: Partial<ModelProfile>) => void;
  updateAgencyProfile: (profile: Partial<AgencyProfile>) => void;
  setModelProfile: (profile: ModelProfile | null) => void;
  setAgencyProfile: (profile: AgencyProfile | null) => void;
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  modelProfile: null,
  agencyProfile: null,
  isLoading: false,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/user/profile/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      
      if (data.role === 'model') {
        set({ modelProfile: data.modelProfile, agencyProfile: null });
      } else {
        set({ agencyProfile: data.agencyProfile, modelProfile: null });
      }
      return data;
    } catch (error) {
      console.error('Fetch profile error:', error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profileData: any) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();

      if (data.role === 'model') {
        set({ modelProfile: data.modelProfile });
      } else {
        set({ agencyProfile: data.agencyProfile });
      }
      
      // Update name in auth store if changed
      if (profileData.name) {
        useAuthStore.getState().updateUser({ name: profileData.name });
      }
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  uploadPhotos: async (files: FileList) => {
    const token = useAuthStore.getState().token;
    if (!token) return null;

    set({ isLoading: true });
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    try {
      const response = await fetch(`${API_URL}/api/user/profile/photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload photos');
      const data = await response.json();
      
      // Update local state
      const currentModel = get().modelProfile;
      const currentAgency = get().agencyProfile;
      
      if (currentModel) {
        set({ 
          modelProfile: { 
            ...currentModel, 
            photos: [...(currentModel.photos || []), ...data.photoUrls] 
          } 
        });
      } else if (currentAgency) {
        set({ 
          agencyProfile: { 
            ...currentAgency, 
            photos: [...(currentAgency.photos || []), ...data.photoUrls] 
          } 
        });
      }
      
      return data.photoUrls;
    } catch (error) {
      console.error('Upload photos error:', error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
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

export const useCatalogStore = create<CatalogState>()((set) => ({
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
  sendMessage: (receiverId: string, content: string, type?: Message['type'], mediaUrl?: string) => Promise<boolean>;
  uploadChatImage: (file: File) => Promise<string | null>;
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
  
  fetchMessages: async (_conversationId) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
  
  sendMessage: async (receiverId, content, type = 'text', mediaUrl) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'current-user',
      receiverId,
      content,
      type,
      mediaUrl,
      createdAt: new Date(),
      isRead: false,
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    
    return true;
  },

  uploadChatImage: async (file) => {
    const token = useAuthStore.getState().token;
    if (!token) return null;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_URL}/api/messages/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Chat image upload error:', error);
      return null;
    }
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
  removeFromFavorites: (targetUserId: string) => Promise<boolean>;
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
  
  removeFromFavorites: async (targetUserId) => {
    set((state) => ({
      favorites: state.favorites.filter(fav => fav.targetUserId !== targetUserId),
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

export const useAdminStore = create<AdminState>()((set) => ({
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
  
  updateUserStatus: async (_userId, _status) => {
    return true;
  },
  
  verifyUser: async (_userId) => {
    return true;
  },
  
  respondToTicket: async (_ticketId, _response) => {
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
