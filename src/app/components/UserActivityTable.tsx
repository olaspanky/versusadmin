import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserActivity, User } from '../lib/data'; // Import from the shared file

interface UserActivityTableProps {
  activities: UserActivity[];
  onRowClick: (user: User) => void; // Update to accept User object
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
      <div className="flex items-center mb-4 ">
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
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedActivities.map((activity, index) => (
            <TableRow
              key={index}
              onClick={() => onRowClick(activity.user)}
              className="cursor-pointer hover:bg-gray-800 text-white "
            >
              <TableCell>{activity.user.email}</TableCell> {/* Display user name */}
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
