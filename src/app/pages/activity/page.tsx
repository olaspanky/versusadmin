"use client"
import { useState, useEffect } from 'react';
import UserActivityTable from '../../components/UserActivityTable';
import UserActivityGraph from '../../components/UserActivityGraph';
import Modal from '../../components/Modal';

// First, define or import the User interface
interface User {
  id: number;
  _id: string;
  name: string;
  email: string;
  status: string;
  lastLogin: string;
  balance: number;
  accumulatedTime: string;
}

interface UserActivity {
  id: number;
  user: User; // Changed from string to User
  activity: string;
  date: string;
  timeSpent: number;
}

const ActivityPage = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Changed to User type
  const [graphData, setGraphData] = useState({ dates: [], timeSpent: [] });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('https://admin2-neon.vercel.app/api/users/activities');
        const data = await response.json();
        
        const formattedData: UserActivity[] = data.map((activity: UserActivity) => ({
          ...activity,
          date: new Date(activity.date).toLocaleDateString(),
          user: activity.user // Ensure API returns full user object
        }));
        
        setActivities(formattedData);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchGraphData = async () => {
      if (selectedUser) {
        try {
          const response = await fetch(
            `https://admin2-neon.vercel.app/api/users/activities/${selectedUser.email}/graph`
          );
          if (!response.ok) throw new Error('Network response was not ok');
          setGraphData(await response.json());
        } catch (error) {
          console.error('Error fetching graph data:', error);
        }
      }
    };
    fetchGraphData();
  }, [selectedUser]);

  const handleRowClick = (user: User) => { // Updated parameter type
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="p-8 max-h-[100vh]">
      <h1 className="text-2xl font-bold mb-4">User Activity</h1>
      <div className='h-screen overflow-auto'>
        <UserActivityTable 
          activities={activities} 
          onRowClick={handleRowClick} 
        />
      </div>
      <Modal isOpen={!!selectedUser} onClose={handleCloseModal}>
        {selectedUser && (
          <UserActivityGraph 
            data={graphData} 
            user={selectedUser} // Now passing User object
          />
        )}
      </Modal>
    </div>
  );
};

export default ActivityPage;