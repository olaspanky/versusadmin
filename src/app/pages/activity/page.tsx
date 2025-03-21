"use client";
import { useState, useEffect } from 'react';
import UserActivityTable from '../../components/UserActivityTable';

import { UserActivity, User } from '../../lib/data';

// Transform user string to User object
const stringToUser = (userString: string): User => {
  const cleanString = userString.replace(/"/g, '');
  return {
    id: cleanString, // Changed from _id to id
    name: cleanString.replace(/@.*$/, ''),
    email: cleanString,
    status: 'active', // Default
    lastLogin: new Date().toISOString(), // Default
    balance: 0, // Default
    accumulatedTime: 0, // Default
  };
};

const ActivityPage = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('https://admin2-neon.vercel.app/api/users/activities');
        const data = await response.json();

        type ActivityResponse = {
          id: string | number;
          user: string;
          activity: string;
          date: string;
          timeSpent: number;
        };

        const formattedData: UserActivity[] = data.map((activity: ActivityResponse) => ({
          id: String(activity.id),
          user: activity.user,
          activity: activity.activity,
          date: new Date(activity.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
          timeSpent: activity.timeSpent,
        }));

        setActivities(formattedData);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();
  }, []);



  const handleRowClick = (user: string) => {
    const selectedUser = stringToUser(user);
    console.log('Selected user:', selectedUser);
  };


  console.log("activities is", activities);

  return (
    <div className="p-8 max-h-[100vh]">
      <h1 className="text-2xl font-bold mb-4 text-white">User Activity</h1>
      <div className="h-screen overflow-auto">
        <UserActivityTable
          activities={activities}
          onRowClick={handleRowClick}
        />
      </div>
     
    </div>
  );
};

export default ActivityPage;