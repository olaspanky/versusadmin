"use client";
import { useState, useEffect } from 'react';
import UserActivityTable from '../../components/UserActivityTable';
import UserActivityGraph from '../../components/UserActivityGraph';
import Modal from '../../components/Modal';
import { UserActivity, User } from '../../lib/data'; // Import from the shared file

const ActivityPage = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [graphData, setGraphData] = useState({ dates: [], timeSpent: [] });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('https://admin2-neon.vercel.app/api/users/activities');
        const data = await response.json();

        const formattedData: UserActivity[] = data.map((activity: UserActivity) => ({
          ...activity,
          date: new Date(activity.date).toLocaleDateString(),
          user: activity.user,
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

  const handleRowClick = (user: User) => {
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
            user={selectedUser}
          />
        )}
      </Modal>
    </div>
  );
};

export default ActivityPage;
