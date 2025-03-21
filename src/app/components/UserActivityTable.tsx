// components/UserActivityTable.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserActivity } from '../lib/data'; // Use updated type

interface UserActivityTableProps {
  activities: UserActivity[];
  onRowClick: (user: string) => void; // Pass string (email)
}

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

const UserActivityTable: React.FC<UserActivityTableProps> = ({
  activities,
  onRowClick,
}) => {
  const [searchDate, setSearchDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredActivities = activities.filter((activity) => {
    if (!searchDate) return true;
    const activityDate = parseDate(activity.date);
    const filterDate = new Date(searchDate);
    activityDate.setHours(0, 0, 0, 0);
    filterDate.setHours(0, 0, 0, 0);
    return activityDate.getTime() === filterDate.getTime();
  });

  const sortedActivities = filteredActivities.sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return sortOrder === 'asc'
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });

  return (
    <div>
      <div className="flex items-center mb-4">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border p-2 rounded mr-4"
          placeholder="Filter by date"
        />
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Sort: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="text-xl font-extrabold text-white">
            <TableHead>User</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedActivities.map((activity, index) => (
            <TableRow
              key={index}
              onClick={() => onRowClick(activity.user)} // Pass user string
              className="cursor-pointer hover:bg-gray-800 text-white"
            >
              <TableCell>{activity.user.replace(/"/g, '')}</TableCell>
              <TableCell>{activity.activity}</TableCell>
              <TableCell>{activity.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserActivityTable;