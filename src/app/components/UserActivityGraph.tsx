'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import html2canvas from "html2canvas";
import {User} from "./UserTable"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// components/UserActivityGraph.tsx
interface UserActivityGraphProps {
  data: { dates: string[]; timeSpent: number[] };
  user: User; // This User type expects 'id'
}

const UserActivityGraph: React.FC<UserActivityGraphProps> = ({ data, user }) => {
  const [dateRange, setDateRange] = useState<string>('this-week');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);

  const { 
    filteredDates, 
    filteredTimeSpent, 
    idlePeriods, 
    activeDays 
  } = useMemo(() => {
    if (data.dates.length === 0) {
      return { 
        filteredDates: [], 
        filteredTimeSpent: [], 
        idlePeriods: [], 
        activeDays: 0 
      };
    }

    // Parse all dates to Date objects
    const dateObjects = data.dates.map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    });

    // Get current date in user's timezone
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let startDate = new Date(0);
    let endDate = new Date(today);

    // Calculate date ranges
    switch (dateRange) {
      case 'this-week': {
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
        startDate = new Date(today);
        startDate.setDate(diff);
        endDate = new Date(today);
        break;
      }
      case 'last-week': {
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
        startDate = new Date(today);
        startDate.setDate(diff - 7);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      }
      case 'last-month': {
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 1);
        endDate = new Date(today);
        endDate.setDate(0); // Last day of previous month
        break;
      }
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
        }
        break;
      default:
        startDate = new Date(0); // Show all data if no range selected
    }

    // Adjust to UTC for comparison with UTC dates
    startDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
    endDate = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999));

    // Filter data based on date range
    const filteredIndices: number[] = [];
    dateObjects.forEach((date, index) => {
      if (date >= startDate && date <= endDate) {
        filteredIndices.push(index);
      }
    });

    // Calculate idle periods
    const sortedDates = filteredIndices.map(i => dateObjects[i]).sort((a, b) => a.getTime() - b.getTime());
    const idlePeriods: { start: string; end: string; days: number }[] = [];
    
    if (sortedDates.length > 1) {
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const currentDate = sortedDates[i];
        const nextDate = sortedDates[i + 1];
        
        const diffTime = Math.abs(nextDate.getTime() - currentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
        
        if (diffDays > 0) {
          const idleStart = new Date(currentDate);
          idleStart.setDate(idleStart.getDate() + 1);
          
          const idleEnd = new Date(nextDate);
          idleEnd.setDate(idleEnd.getDate() - 1);
          
          idlePeriods.push({
            start: format(idleStart, 'yyyy-MM-dd'),
            end: format(idleEnd, 'yyyy-MM-dd'),
            days: diffDays
          });
        }
      }
    }

    return {
      filteredDates: filteredIndices.map(i => data.dates[i]),
      filteredTimeSpent: filteredIndices.map(i => data.timeSpent[i]),
      idlePeriods,
      activeDays: filteredIndices.length
    };
  }, [data, dateRange, customStartDate, customEndDate]);

  const chartData = {
    labels: filteredDates,
    datasets: [
      {
        label: `Time Spent by ${user} (minutes)`,
        data: filteredTimeSpent,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  const downloadGraphImage = async () => {
    const graphElement = document.getElementById("user-activity-graph");
    if (!graphElement) return;
  
    const canvas = await html2canvas(graphElement);
    const image = canvas.toDataURL("image/png");
  
    // Create a download link
    const link = document.createElement("a");
    link.href = image;
    link.download = `user_activity_${user}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Activity Over Time</CardTitle>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            {dateRange === 'custom' && (
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[160px] pl-3 text-left font-normal">
                      {customStartDate ? format(customStartDate, 'PPP') : (
                        <span className="text-muted-foreground">Start date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={setCustomStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[160px] pl-3 text-left font-normal">
                      {customEndDate ? format(customEndDate, 'PPP') : (
                        <span className="text-muted-foreground">End date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customEndDate}
                      onSelect={setCustomEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
        <div id="user-activity-graph" className="w-full h-96 bg-white">
  <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
</div>

        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <Button onClick={downloadGraphImage} className="mt-4">
  Download 
</Button>


        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Active Days</h3>
              <p className="text-3xl font-bold text-primary">{activeDays}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Idle Periods</h3>
              {idlePeriods.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {idlePeriods.map((period, index) => (
                    <li key={index} className="border rounded p-2 bg-muted/50">
                      <span className="font-medium">{period.start} to {period.end}</span>
                      <span className="text-muted-foreground ml-2">({period.days} {period.days === 1 ? 'day' : 'days'})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No idle periods detected</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityGraph;