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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { fetchNavigationHistory, NavigationEntry } from '../../../lib/api';

interface ChartData {
  date: string;
  timeSpent: number;
}

interface PageStats {
  page: string; // Cleaned-up page name
  visitCount: number;
  totalTimeSpent: number;
}

interface UserNavigationHistory {
  url: string;
  timestamp?: string;
  timeSpent?: number;
}


export default function UserNavigationPage() {
  const { email } = useParams<{ email: string }>();
  const decodedEmail = decodeURIComponent(email);
  const [history, setHistory] = useState<NavigationEntry[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [showAllNavigations, setShowAllNavigations] = useState(false);


  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchNavigationHistory(decodedEmail) as (NavigationEntry | UserNavigationHistory)[];
  
        // Convert UserNavigationHistory to NavigationEntry format
        const formattedData: NavigationEntry[] = data.map((entry) => ({
          page: "page" in entry ? entry.page : entry.url,
          timestamp: entry.timestamp ?? new Date().toISOString(),
          timeSpent: entry.timeSpent ?? 0,
        }));
  
        setHistory(formattedData);
      } catch (error) {
        console.error("Error fetching navigation history:", error);
      }
    };
  
    if (decodedEmail) {
      loadHistory();
    }
  }, [decodedEmail]);
  

  // Filter out ignored pages and apply date range, clean up URLs
  const filteredHistory = useMemo(() => {
    const ignoredPages = ['/pbr/home2', '/pbr/ghana', '/pbr/overview'];
    let result = history
      .filter((entry) => !ignoredPages.includes(entry.page)) // Strictly exclude these pages
      .map((entry) => ({
        ...entry,
        page: entry.page.replace('/pbr/', '').replace('/', ''), // Clean up remaining URLs
      }))
      .filter((entry) => entry.page.trim() !== ''); // Ensure no empty page names
    if (startDate && endDate) {
      result = result.filter((entry) =>
        isWithinInterval(parseISO(entry.timestamp), { start: startDate, end: endDate })
      );
    }
    return result;
  }, [history, startDate, endDate]);

  // Calculate page stats for dashboard
  const pageStats: PageStats[] = useMemo(() => {
    const pageMap = filteredHistory.reduce((acc, entry) => {
      const cleanedPage = entry.page;
      acc[cleanedPage] = {
        visitCount: (acc[cleanedPage]?.visitCount || 0) + 1,
        totalTimeSpent: (acc[cleanedPage]?.totalTimeSpent || 0) + entry.timeSpent,
      };
      return acc;
    }, {} as Record<string, { visitCount: number; totalTimeSpent: number }>);

    return Object.entries(pageMap)
      .map(([page, stats]) => ({ page, ...stats }))
      .sort((a, b) => b.visitCount - a.visitCount);
  }, [filteredHistory]);

  const topPages = pageStats.slice(0, 3);
  const leastPages = pageStats.slice(-3).reverse();

  // Chart data for time spent trend
  const chartData: ChartData[] = useMemo(() => {
    const dailyTotals = filteredHistory.reduce((acc, entry) => {
      const date = format(parseISO(entry.timestamp), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + entry.timeSpent;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyTotals)
      .map(([date, timeSpent]) => ({ date, timeSpent }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredHistory]);

  // Table setup
  const columns: ColumnDef<NavigationEntry>[] = useMemo(
    () => [
      { accessorKey: 'page', header: 'Page' },
      {
        accessorKey: 'timestamp',
        header: 'Timestamp',
        cell: ({ row }) => format(parseISO(row.original.timestamp), 'PPpp'),
      },
      { accessorKey: 'timeSpent', header: 'Time Spent (s)' },
    ],
    []
  );

  const table = useReactTable({
    data: filteredHistory,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-6 text-white">
        <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 tracking-wide">
          Company Analytic - Company Performance for {decodedEmail}
        </h1>

        {/* Date Filters */}
        <div className="flex justify-center gap-4 mb-8">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{
              textField: {
                className: "bg-white/10 text-white rounded-md border border-white/20 focus:ring-indigo-500",
              },
            }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{
              textField: {
                className: "bg-white/10 text-white rounded-md border border-white/20 focus:ring-indigo-500",
              },
            }}
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
            }}
          >
            All Time
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Top 3 Pages */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-indigo-300 mb-4">Top 3 Most Visited Pages</h2>
            {topPages.length > 0 ? (
              topPages.map((page, index) => (
                <div
                  key={page.page}
                  className={`flex justify-between py-2 px-4 rounded-md mb-2 ${
                    index === 0 ? 'bg-indigo-500/20' : index === 1 ? 'bg-purple-500/20' : 'bg-blue-500/20'
                  }`}
                >
                  <span className="capitalize">{page.page}</span>
                  <span>{page.visitCount} visits ({page.totalTimeSpent}s)</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No meaningful data available</p>
            )}
          </div>

          {/* Least Visited Pages */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-indigo-300 mb-4">Least Visited Pages</h2>
            {leastPages.length > 0 ? (
              leastPages.map((page) => (
                <div key={page.page} className="flex justify-between py-2 px-4 rounded-md mb-2 bg-gray-500/20">
                  <span className="capitalize">{page.page}</span>
                  <span>{page.visitCount} visits ({page.totalTimeSpent}s)</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No meaningful data available</p>
            )}
          </div>
        </div>

        {/* Time Spent Trend */}
        {chartData.length > 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-indigo-300 mb-4">Time Spent Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis dataKey="date" stroke="#ffffff" />
                <YAxis
                  label={{ value: 'Time (s)', angle: -90, position: 'insideLeft', fill: '#ffffff' }}
                  stroke="#ffffff"
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff10', border: '1px solid #ffffff20', color: '#ffffff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="timeSpent" stroke="#a78bfa" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-gray-400 mb-8">No time spent data available</div>
        )}

        {/* Toggle Full Navigation History */}
        <div className="flex justify-center mb-6">
          <button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-full transition-all"
            onClick={() => setShowAllNavigations(!showAllNavigations)}
          >
            {showAllNavigations ? 'Hide Navigations' : 'View All Navigations'}
          </button>
        </div>

        {showAllNavigations && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md shadow-lg">
            <input
              placeholder="Search navigations..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="mb-4 w-full max-w-sm bg-white/10 text-white border border-white/20 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
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
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-white/10 transition-colors border-b border-white/10"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-2 px-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-400">
                        No navigation data available
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