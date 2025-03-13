
"use client"
import { useState, useEffect } from 'react';
import UserActivityTable from '../../components/UserActivityTable';
import UserActivityGraph from '../../components/UserActivityGraph';
import Modal from '../../components/Modal';

interface UserActivity {
  id: number; // Should be number to match the data type in data.ts
  user: string;
  activity: string;
  date: string;
  timeSpent: number; // Add missing field
}

const ActivityPage = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [graphData, setGraphData] = useState({ dates: [], timeSpent: [] });
  console.log("selectedUser", selectedUser);  

// In ActivityPage.tsx
useEffect(() => {
  const fetchActivities = async () => {
    try {
      const response = await fetch('https://admin2-neon.vercel.app/api/users/activities');
      const data = await response.json();
      // Convert dates to readable format
      const formattedData: UserActivity[] = data.map((activity: UserActivity) => ({
        ...activity,
        date: new Date(activity.date).toLocaleDateString()
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
          const response = await fetch(`https://admin2-neon.vercel.app/api/users/activities/${selectedUser}/graph`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setGraphData(data);
        } catch (error) {
          console.error('Error fetching graph data:', error);
        }
      }
    };
  
    fetchGraphData();
  }, [selectedUser]);

  const handleRowClick = (user: string) => {
    setSelectedUser(user); // Ensure `user` is the email or correct identifier
  };
  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="p-8 max-h-[100vh]">
      <h1 className="text-2xl font-bold mb-4">User Activity</h1>
      <div className='h-screen overflow-auto'>
      <UserActivityTable activities={activities} onRowClick={handleRowClick} />
      </div>
      <Modal isOpen={!!selectedUser} onClose={handleCloseModal}>
        {selectedUser && <UserActivityGraph data={graphData} user={selectedUser} />}
      </Modal>
    </div>
  );
};

export default ActivityPage;
