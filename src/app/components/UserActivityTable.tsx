'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserActivity } from '../lib/data';

interface UserActivityTableProps {
  activities: UserActivity[];
  onRowClick: (user: string) => void;
}

// Helper function to parse a date string in "DD/MM/YYYY" format
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

const UserActivityTable: React.FC<UserActivityTableProps> = ({
  activities,
  onRowClick,
}) => {
  // State for filtering by date (from the input, in "YYYY-MM-DD" format)
  const [searchDate, setSearchDate] = useState('');
  // State to toggle sorting order: 'asc' for oldest first, 'desc' for newest first
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter activities by comparing the date from the input with each activity's date.
  const filteredActivities = activities.filter((activity) => {
    if (!searchDate) return true;
    const activityDate = parseDate(activity.date);
    const filterDate = new Date(searchDate);
    // Normalize both dates to midnight for an accurate comparison
    activityDate.setHours(0, 0, 0, 0);
    filterDate.setHours(0, 0, 0, 0);
    return activityDate.getTime() === filterDate.getTime();
  });

  // Sort only by the date of the activity using the parsed Date object.
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
        {/* Date filter input */}
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border p-2 rounded mr-4"
          placeholder="Filter by date"
        />
        {/* Toggle sorting order */}
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
              key={index} // Replace with a unique ID if available
              onClick={() => onRowClick(activity.user)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{activity.user}</TableCell>
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
