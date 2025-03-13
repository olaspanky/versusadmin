export interface User {
  id: number;
  _id: string;
  name: string;
  email: string;
  status: string;
  lastLogin: string;
  balance: number;
  accumulatedTime: string;
}

export interface UserActivity {
  id: number;
  user: User; // Changed from string to User
  activity: string;
  date: string;
  timeSpent: number;
}