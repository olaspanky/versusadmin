'use client';

import { useState, useEffect } from 'react';
import { PencilIcon, LockClosedIcon, BanIcon, ClockIcon } from '@heroicons/react/outline';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Modal from '../components/Modal';
import UserActivityGraph from './UserActivityGraph';

// UsersTable.tsx
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



const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [action, setAction] = useState<'edit' | 'reset' | 'suspend' | 'history' | null>(null);
  const [graphData, setGraphData] = useState({ dates: [], timeSpent: [] });

  console.log('Users:', users);
  

  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://admin2-neon.vercel.app/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAction = (user: User, actionType: 'edit' | 'reset' | 'suspend' | 'history') => {
    setSelectedUser(user);
    setAction(actionType);
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setAction(null);
  };

  const handleEditUser = async (updatedName: string, updatedEmail: string) => {
    if (selectedUser) {
      try {
        const response = await fetch(`https://admin2-neon.vercel.app/api/users/${selectedUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: updatedName, email: updatedEmail }),
        });
        const updatedUser = await response.json();
        setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
        closeDialog();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleResetPassword = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`https://admin2-neon.vercel.app/api/users/${selectedUser.id}/reset`, {
          method: 'POST',
        });
        const data = await response.json();
        alert(data.message);
        closeDialog();
      } catch (error) {
        console.error('Error resetting password:', error);
      }
    }
  };

  const handleSuspendUser = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`https://admin2-neon.vercel.app/api/users/${selectedUser.id}/suspend`, {
          method: 'POST',
        });
        const updatedUser = await response.json();
        setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
        closeDialog();
      } catch (error) {
        console.error('Error suspending user:', error);
      }
    }
  };

  useEffect(() => {
    const fetchGraphData = async () => {
      if (selectedUser && action === 'history') {
        try {
          const response = await fetch(`https://admin2-neon.vercel.app/api/users/activities/${selectedUser.email}/graph`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Fetched graph data:', data); // Log the fetched data
          setGraphData(data);
        } catch (error) {
          console.error('Error fetching graph data:', error);
        }
      }
    };

    fetchGraphData();
  }, [selectedUser, action]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setAction(null);
  };

  return (
    <div className="w-full h-[80vh] text-white overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className='text-xl font-extrabold text-white'>
            <TableHead>Name</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">  {user?.email.replace(/"/g, '')}
              </TableCell>
              <TableCell>
              <span>
  {(parseFloat(user.accumulatedTime) / 3600).toFixed(2)} hours
</span>
              </TableCell>
              <TableCell>{formatDate(user.lastLogin)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAction(user, 'edit')}>
                          <PencilIcon className="h-4 w-4 text-blue-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit User</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAction(user, 'reset')}>
                          <LockClosedIcon className="h-4 w-4 text-yellow-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset Password</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAction(user, 'suspend')}>
                          <BanIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Suspend User</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAction(user, 'history')}>
                          <ClockIcon className="h-4 w-4 text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Login History</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialogs for actions */}
      {action === 'edit' && selectedUser && (
        <Dialog open={true} onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div>
              <input type="text" placeholder="Name" defaultValue={selectedUser.name} onChange={(e) => handleEditUser(e.target.value, selectedUser.email)} />
              <input type="email" placeholder="Email" defaultValue={selectedUser.email} onChange={(e) => handleEditUser(selectedUser.name, e.target.value)} />
              <Button onClick={closeDialog}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {action === 'reset' && selectedUser && (
        <Dialog open={true} onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
            </DialogHeader>
            <div>
              <p>Are you sure you want to reset the password for {selectedUser.email}?</p>
              <Button onClick={handleResetPassword}>Confirm</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {action === 'suspend' && selectedUser && (
        <Dialog open={true} onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suspend User</DialogTitle>
            </DialogHeader>
            <div>
              <p>Are you sure you want to {selectedUser.status === 'Active' ? 'suspend' : 'activate'} {selectedUser.email}?</p>
              <Button onClick={handleSuspendUser}>Confirm</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Modal isOpen={action === 'history' && !!selectedUser} onClose={handleCloseModal}>
        {selectedUser && <UserActivityGraph data={graphData} user={selectedUser} />}
      </Modal>
    </div>
  );
};

export default UsersTable;
