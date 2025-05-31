// Enums baseados no schema Prisma
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum ReactionType {
  THUMBS_UP = 'THUMBS_UP',
  THUMBS_DOWN = 'THUMBS_DOWN',
  LIGHT_BULB = 'LIGHT_BULB',
  SAD_FACE = 'SAD_FACE',
  THUNDER = 'THUNDER'
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Opcional para não expor no frontend
  description: string;
  groupId?: string;
  coins: number;
  role: Role;
  group?: Group;
  feedbacks?: Feedback[];
  reactions?: Reaction[];
  products?: Product[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  description: string;
  groupId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  description?: string;
  groupId?: string;
}

// Group types
export interface Group {
  id: string;
  name: string;
  level: number;
  parentId?: string;
  users?: User[];
  feedbacks?: Feedback[];
  parent?: Group;
  subgroups?: Group[];
}

export interface CreateGroupRequest {
  name: string;
  level?: number;
  parentId?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  level?: number;
  parentId?: string;
}

// Feedback types
export interface Feedback {
  id: string;
  content: string;
  file?: string;
  createdAt: string;
  reportCount: number;
  authorId: string;
  groupId?: string;
  isAnonymous: boolean;
  author?: User;
  group?: Group;
  reactions?: Reaction[];
  reactionCounts?: Record<ReactionType, number>;
}

export interface CreateFeedbackRequest {
  content: string;
  file?: string;
  groupId?: string;
  isAnonymous?: boolean;
}

export interface UpdateFeedbackRequest {
  content?: string;
  file?: string;
  groupId?: string;
  isAnonymous?: boolean;
}

// Reaction types
export interface Reaction {
  id: number;
  feedbackId: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
  feedback?: Feedback;
  user?: User;
}

export interface CreateReactionRequest {
  feedbackId: string;
  type: ReactionType;
}

// Product types (equivalente aos rewards)
export interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  cost: number;
  userId: string;
  user?: User;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  image?: string;
  cost: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  image?: string;
  cost?: number;
}

export interface PurchaseProductRequest {
  productId: string;
}

// Pagination e filtros
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FeedbackFilters extends PaginationParams {
  groupId?: string;
  authorId?: string;
  isAnonymous?: boolean;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface GroupFilters extends PaginationParams {
  parentId?: string;
  level?: number;
  search?: string;
}

export interface ProductFilters extends PaginationParams {
  maxCost?: number;
  minCost?: number;
  search?: string;
  available?: boolean;
} 