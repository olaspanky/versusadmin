// ../lib/data.ts
export interface User {
  id: string; // Changed from _id to id
  name: string;
  email: string;
  status: string;
  lastLogin: string;
  balance: number;
  accumulatedTime: number;
}

export interface UserActivity {
  id: string;
  user: string;
  activity: string;
  date: string;
  timeSpent: number;
}