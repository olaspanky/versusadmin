'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO, isWithinInterval } from 'date-fns';

interface NavigationEntry {
  page: string;
  timestamp: string;
  timeSpent: number;
}

interface User {
  email: string;
  accumulatedTime: number;
  navigationHistory: NavigationEntry[];
  dailyTime: { date: string; timeSpent: number }[];
}

interface CompanyData {
  company: string;
  totalTime: number;
  userCount: number;
}



interface PageStats {
  page: string;
  visitCount: number;
  totalTimeSpent: number;
}

export default function CompanyAnalyticsDashboard() {
  const { email } = useParams<{ email?: string }>();
  const decodedEmail = email ? decodeURIComponent(email) : '';
  const [users, setUsers] = useState<User[]>([]);
  const [companyTimes, setCompanyTimes] = useState<CompanyData[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [showActivityTable, setShowActivityTable] = useState(false);
  const [error, setError] = useState<string>('');

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersRes = await fetch('https://admin2-neon.vercel.app/api/users'); // Adjust if endpoint differs
        if (!usersRes.ok) throw new Error('Failed to fetch users');
        const usersData: User[] = await usersRes.json();
        setUsers(usersData);

        // Fetch company times with date range
        let companyUrl = 'https://admin2-neon.vercel.app/api/users/companies/times';
        if (startDate && endDate) {
          const params = new URLSearchParams({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          });
          companyUrl += `?${params.toString()}`;
        }
        const companyRes = await fetch(companyUrl);
        if (!companyRes.ok) {
          const errorData = await companyRes.json();
          throw new Error(errorData.message || 'Failed to fetch company times');
        }
        const companyData: CompanyData[] = await companyRes.json();
        if (!Array.isArray(companyData)) throw new Error('Invalid company data format');
        setCompanyTimes(companyData);
        setError('');
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setCompanyTimes([]);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  // Filter navigation history
  const filteredHistory = useMemo(() => {
    const ignoredPages = ['/pbr/home2', '/pbr/ghana', '/pbr/overview'];
    const allHistory = users.flatMap(user => user.navigationHistory.map(entry => ({
      ...entry,
      email: user.email,
    })));
    let result = allHistory
      .filter(entry => !ignoredPages.includes(entry.page))
      .map(entry => ({
        ...entry,
        page: entry.page.replace('/pbr/', '').replace('/', ''),
      }))
      .filter(entry => entry.page.trim() !== '');
    if (startDate && endDate) {
      result = result.filter(entry =>
        isWithinInterval(parseISO(entry.timestamp), { start: startDate, end: endDate })
      );
    }
    return result;
  }, [users, startDate, endDate]);

  // Format time to hours
  const formatTimeToHours = (seconds: number) => {
    const hours = (seconds / 3600).toFixed(2); // Convert to hours with 2 decimal places
    return `${hours}h`;
  };

  // Top Users
  const topUsers = useMemo(() => {
    return users
      .map(user => ({
        email: user.email,
        totalTime: user.accumulatedTime,
      }))
      .sort((a, b) => b.totalTime - a.totalTime)
      .slice(0, 10);
  }, [users]);

  // Top Companies
  const topCompanies = useMemo(() => companyTimes.slice(0, 10), [companyTimes]);

  // Top User per Company
  const topUserPerCompany = useMemo(() => {
    const companyUserMap = new Map<string, { email: string; totalTime: number }>();
    users.forEach(user => {
      const domain = user.email.split('@')[1]?.split('.')[0] || 'Unknown';
      const current = companyUserMap.get(domain);
      if (!current || user.accumulatedTime > current.totalTime) {
        companyUserMap.set(domain, { email: user.email, totalTime: user.accumulatedTime });
      }
    });
    return Array.from(companyUserMap.entries()).map(([company, data]) => ({
      company,
      email: data.email,
      totalTime: data.totalTime,
    }));
  }, [users]);

  // Top Pages Visited
  const pageStats: PageStats[] = useMemo(() => {
    const pageMap = filteredHistory.reduce((acc, entry) => {
      acc[entry.page] = {
        visitCount: (acc[entry.page]?.visitCount || 0) + 1,
        totalTimeSpent: (acc[entry.page]?.totalTimeSpent || 0) + entry.timeSpent,
      };
      return acc;
    }, {} as Record<string, { visitCount: number; totalTimeSpent: number }>);
    return Object.entries(pageMap)
      .map(([page, stats]) => ({ page, ...stats }))
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 10);
  }, [filteredHistory]);

  // Time Spent Trend


  // Activity Table
  const activityColumns: ColumnDef<{ email: string; page: string; timestamp: string; timeSpent: number }>[] = useMemo(
    () => [
      { accessorKey: 'email', header: 'User' },
      { accessorKey: 'page', header: 'Page' },
      { accessorKey: 'timestamp', header: 'Timestamp', cell: ({ row }) => format(parseISO(row.original.timestamp), 'PPpp') },
      { accessorKey: 'timeSpent', header: 'Time Spent (h)', cell: ({ row }) => formatTimeToHours(row.original.timeSpent) },
    ],
    []
  );

  const activityTable = useReactTable({
    data: filteredHistory,
    columns: activityColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="min-h-screen bg-gray-800  p-6 text-white">
        <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text  tracking-wide">
          Company Analytic - Company Performance {decodedEmail ? `for ${decodedEmail}` : 'Overview'}
        </h1>

        {/* Date Filters */}
        <div className="flex justify-center gap-4 mb-8">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{ textField: { className: "bg-white/10 text-white rounded-md border border-white/20 focus:ring-indigo-500" } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{ textField: { className: "bg-white/10 text-white rounded-md border border-white/20 focus:ring-indigo-500" } }}
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            onClick={() => { setStartDate(null); setEndDate(null); }}
          >
            All Time
          </button>
        </div>
        {error && <div className="text-center text-red-400 mb-4">{error}</div>}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Users */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-indigo-300 mb-4">Top Users by Time Spent</h2>
            {topUsers.length > 0 ? topUsers.map((user, index) => (
              <div key={user.email} className={`flex justify-between py-2 px-4 rounded-md mb-2 ${index === 0 ? 'bg-indigo-500/20' : 'bg-gray-500/20'}`}>
                <span>{user.email}</span>
                <span>{formatTimeToHours(user.totalTime)}</span>
              </div>
            )) : <p className="text-gray-400">No data available</p>}
          </div>

          {/* Top Companies */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-indigo-300 mb-4">Top Companies by Time</h2>
            {topCompanies.length > 0 ? topCompanies.map((company, index) => (
              <div key={company.company} className={`flex justify-between py-2 px-4 rounded-md mb-2 ${index === 0 ? 'bg-indigo-500/20' : 'bg-gray-500/20'}`}>
                <span className="capitalize">{company.company}</span>
                <span>{formatTimeToHours(company.totalTime)} ({company.userCount} users)</span>
              </div>
            )) : <p className="text-gray-400">{error ? 'Error loading data' : 'No data available'}</p>}
          </div>

          {/* Top User per Company */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-indigo-300 mb-4">Top User per Company</h2>
            {topUserPerCompany.length > 0 ? topUserPerCompany.slice(0, 10).map((entry) => (
              <div key={entry.company} className="flex justify-between py-2 px-4 rounded-md mb-2 bg-gray-500/20">
                <span className="capitalize">{entry.company}: {entry.email}</span>
                <span>{formatTimeToHours(entry.totalTime)}</span>
              </div>
            )) : <p className="text-gray-400">No data available</p>}
          </div>

          {/* Top Pages Visited */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-indigo-300 mb-4">Top Pages Visited</h2>
            {pageStats.length > 0 ? pageStats.map((page, index) => (
              <div key={page.page} className={`flex justify-between py-2 px-4 rounded-md mb-2 ${index === 0 ? 'bg-indigo-500/20' : 'bg-gray-500/20'}`}>
                <span className="capitalize">{page.page}</span>
                <span>{page.visitCount} visits ({formatTimeToHours(page.totalTimeSpent)})</span>
              </div>
            )) : <p className="text-gray-400">No data available</p>}
          </div>
        </div>

        {/* Time Spent Trend */}
      

        {/* Activity Table Toggle */}
        <div className="flex justify-center mb-6">
          <button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-full transition-all"
            onClick={() => setShowActivityTable(!showActivityTable)}
          >
            {showActivityTable ? 'Hide User Activity' : 'View User Activity'}
          </button>
        </div>

        {showActivityTable && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md shadow-lg">
            <input
              placeholder="Search activity..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="mb-4 w-full max-w-sm bg-white/10 text-white border border-white/20 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  {activityTable.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b border-white/10">
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="text-indigo-300 py-2 px-4">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {activityTable.getRowModel().rows.length > 0 ? (
                    activityTable.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-white/10 transition-colors border-b border-white/10">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-2 px-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-400">
                        No activity data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
}