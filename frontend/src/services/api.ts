import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface Job {
  id: number;
  title: string;
  Company: string;
  location: string;
  jobType: string;
  exprience: string;
  description: string;
  skills: string[];
  salary: string;
  applyLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  companyId: number;
  createdAt?: string;
}

export interface InterviewRound {
  id?: number;
  roundNumber: number;
  title: string;
  description: string | null;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  establishedYear: number | null;
  type: string | null;
  industry: string | null;
  description?: string | null;
  discription?: string | null;
  website: string | null;
  logo: string | null;
  product?: Product[];
  interviewRounds?: InterviewRound[];
  _count?: {
    product: number;
    interviewRounds: number;
  };
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail: string | null;
  published: boolean;
  createAt: string;
  updateAt: string;
}

export interface User {
  id: string | number;
  username: string;
  email: string;
  role?: string;
}

export default api;
