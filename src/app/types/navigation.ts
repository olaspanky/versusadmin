// types/navigation.ts
export interface NavigationEntry {
    page: string;
    timestamp: string; // ISO string from backend
    timeSpent: number; // in seconds
  }
  
  export interface User {
    _id: string;
    email: string;
    navigationHistory: NavigationEntry[];
  }