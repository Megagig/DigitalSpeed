import { User, Blog, Project, Product, Gallery, Contact, Category, Tag, Sale, Setting, AuditTrail, Role } from '@prisma/client';

// Auth types
export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

// Blog types
export type BlogWithRelations = Blog & {
  category?: Category | null;
  tags: Tag[];
};

export type BlogFormData = {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  categoryId?: string;
  tags: string[];
  published: boolean;
};

// Project types
export type ProjectWithImages = Project & {
  images: { id: string; url: string }[];
};

export type ProjectFormData = {
  title: string;
  slug: string;
  description: string;
  images: string[];
  published: boolean;
};

// Product types
export type ProductWithImages = Product & {
  images: { id: string; url: string }[];
};

export type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  published: boolean;
};

// Dashboard types
export type DashboardStats = {
  totalBlogs: number;
  totalProjects: number;
  totalProducts: number;
  totalGalleryItems: number;
  totalContacts: number;
  recentBlogs: Blog[];
  recentProjects: Project[];
  recentProducts: Product[];
  recentContacts: Contact[];
  blogsByCategory: { category: string; count: number }[];
  topSellingProducts: { product: string; sales: number }[];
  mostLikedProjects: { project: string; likes: number }[];
};
