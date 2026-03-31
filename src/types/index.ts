// User roles
export type UserRole = 'model' | 'agency' | 'admin';

// Subscription types
export type SubscriptionType = 'free' | 'model_plus' | 'agency_pro' | 'premium';

// Model categories
export type ModelCategory = 
  | 'fashion' 
  | 'commercial' 
  | 'runway' 
  | 'plus-size' 
  | 'fitness' 
  | 'beauty' 
  | 'editorial' 
  | 'lingerie' 
  | 'parts' 
  | 'promo';

// Request statuses
export type RequestStatus = 'pending' | 'accepted' | 'declined';

// Request types
export type RequestType = 'model_to_agency' | 'agency_to_model';

// Transaction types
export type TransactionType = 'deposit' | 'purchase' | 'subscription' | 'refund';

// Transaction statuses
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// User base interface
export interface User {
  id: string;
  email: string;
  role: UserRole;
  balance: number;
  subscriptionType: SubscriptionType;
  subscriptionExpires?: Date;
  isVerified: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  avatarUrl?: string;
  name: string;
}

// Model profile
export interface ModelProfile {
  userId: string;
  name: string;
  age: number;
  height: number;
  bust: number;
  waist: number;
  hips: number;
  shoeSize: number;
  clothingSize: string;
  location: string;
  willingToRelocate: boolean;
  bio: string;
  categories: ModelCategory[];
  photos: string[];
  videos?: string[];
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    website?: string;
  };
  socialLinksHidden: boolean;
  status: 'looking' | 'working' | 'not_looking';
  experience: string;
  languages: string[];
}

// Agency profile
export interface AgencyProfile {
  userId: string;
  name: string;
  description: string;
  specialization: string[];
  location: string;
  otherOffices: string[];
  requirements: string;
  website?: string;
  logo?: string;
  photos: string[];
  representedModelsCount: number;
  contactsHidden: boolean;
  contacts?: {
    phone?: string;
    email?: string;
    socialLinks?: {
      instagram?: string;
      facebook?: string;
    };
  };
  foundedYear?: number;
}

// Request
export interface Request {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: RequestType;
  status: RequestStatus;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  fromUser?: User;
  toUser?: User;
}

// Contact purchase
export interface ContactPurchase {
  id: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  createdAt: Date;
}

// Transaction
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  paymentMethod?: string;
  description?: string;
  createdAt: Date;
}

// Favorite
export interface Favorite {
  id: string;
  userId: string;
  targetUserId: string;
  createdAt: Date;
  targetUser?: User;
}

// View log
export interface ViewLog {
  id: string;
  viewerId: string;
  viewedId: string;
  createdAt: Date;
  viewer?: User;
}

// Message
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  type?: 'text' | 'image' | 'gift' | 'sticker';
  mediaUrl?: string;
  giftId?: string;
  stickerId?: string;
}

// Chat conversation
export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  updatedAt: Date;
  participants?: User[];
  unreadCount?: number;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'message' | 'payment' | 'system';
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

// Subscription plan
export interface SubscriptionPlan {
  id: SubscriptionType;
  name: string;
  price: number;
  period: 'monthly';
  features: string[];
  forRole: UserRole | 'both';
}

// Microservice
export interface Microservice {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
}

// Filter options
export interface ModelFilters {
  location?: string;
  minHeight?: number;
  maxHeight?: number;
  minAge?: number;
  maxAge?: number;
  categories?: ModelCategory[];
  status?: 'looking' | 'working' | 'not_looking';
  willingToRelocate?: boolean;
}

export interface AgencyFilters {
  location?: string;
  specialization?: string[];
  hasOpenings?: boolean;
}

// Admin stats
export interface AdminStats {
  totalUsers: number;
  onlineUsers: number;
  newUsersToday: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  microtransactionsRevenue: number;
  subscriptionsRevenue: number;
  pendingVerifications: number;
  pendingSupportTickets: number;
}

// Support ticket
export interface SupportTicket {
  id: string;
  userId: string;
  category: 'technical' | 'financial' | 'complaint' | 'other';
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

// Promo code
export interface PromoCode {
  id: string;
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  validFrom: Date;
  validTo: Date;
  applicableTo: 'subscription' | 'balance' | 'both';
  isActive: boolean;
}

// Event/Casting
export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: 'casting' | 'show' | 'photoshoot' | 'other';
  organizerId?: string;
  organizerType: 'agency' | 'platform';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxParticipants?: number;
  participants: EventParticipant[];
  createdAt: Date;
}

export interface EventParticipant {
  id: string;
  eventId: string;
  userId: string;
  status: 'applied' | 'approved' | 'rejected';
  appliedAt: Date;
  user?: User;
}
