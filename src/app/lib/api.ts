// lib/api.ts
import axios from 'axios';

// Define the NavigationEntry interface based on backend response
export interface NavigationEntry {
  page: string;
  timestamp: string; // ISO string from backend
  timeSpent: number; // in seconds
}

// Define the response type for all users
export interface UserNavigationHistory {
  email: string;
  navigationHistory: NavigationEntry[];
}

export interface User {
    _id: string;
    email: string;
    navigationHistory: NavigationEntry[];
  }
  

const api = axios.create({
  baseURL: 'https://admin2-neon.vercel.app/api/users', // Adjusted to match your route structure
});


export const fetchUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/');
    return response.data;
  };
// Fetch navigation history for a single user or all users
export const fetchNavigationHistory = async (
  email?: string // Optional email parameter
): Promise<NavigationEntry[] | UserNavigationHistory[]> => {
  const url = email ? `/navigation/${email}` : '/navigation';
  const response = await api.get(url);

  // Type guard to handle different response shapes
  if (Array.isArray(response.data) && response.data.length > 0) {
    if ('email' in response.data[0]) {
      // All users' data
      return response.data as UserNavigationHistory[];
    }
    // Single user data
    return response.data as NavigationEntry[];
  }
  return response.data as NavigationEntry[]; // Default to empty array or single user
};