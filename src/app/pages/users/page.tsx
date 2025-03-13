// app/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUsers, User } from '../../lib/api';
import { Box, Typography, List, ListItem, ListItemText, ListItemButton } from '@mui/material';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsersData();
  }, []);

  const handleUserClick = (email: string) => {
    router.push(`/pages/navigation/${encodeURIComponent(email)}`);
  };

  return (
    <Box sx={{ p: 4 }} className="text-white">
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user._id} disablePadding>
            <ListItemButton onClick={() => handleUserClick(user.email)}>
              <ListItemText primary={user.email} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}