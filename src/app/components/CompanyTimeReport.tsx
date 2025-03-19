// // components/CompanyTimeReport.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';

// interface CompanyTime {
//   company: string;
//   totalTime: number;
//   userCount: number;
// }

// const CompanyTimeReport = () => {
//     const [companies, setCompanies] = useState<CompanyTime[]>([]);
//     const [searchDate, setSearchDate] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fetchCompanyTimes = async (date?: string) => {
//     setLoading(true);
//     try {
//       const url = date 
//         ? `https://admin2-neon.vercel.app/api/users/companies/times?date=${date}`
//         : 'https://admin2-neon.vercel.app/api/users/companies/times';
      
//       const response = await fetch(url);
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to fetch data');
//       }
  
//       const data = await response.json();
      
//       // Ensure data is always an array
//       if (!Array.isArray(data)) {
//         throw new Error('Invalid data format received');
//       }
  
//       setCompanies(data);
//     } catch (error) {
//       console.error('Error fetching company times:', error);
//       setCompanies([]); // Reset to empty array
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompanyTimes();
//   }, []);

//   const handleSearch = () => {
//     fetchCompanyTimes(searchDate);
//   };

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours}h ${minutes}m`;
//   };

//   return (
//     <div className="p-6">
//       <div className="flex gap-4 mb-6">
//         <Input 
//           type="date"
//           value={searchDate}
//           onChange={(e) => setSearchDate(e.target.value)}
//           className="max-w-xs"
//         />
//         <Button onClick={handleSearch} disabled={loading}>
//           {loading ? 'Loading...' : 'Search by Date'}
//         </Button>
//       </div>


//     {loading ? (
//       <div className="text-center py-4">Loading company data...</div>
//     ) : companies.length === 0 ? (
//       <div className="text-center py-4 text-gray-500">
//         No company data available
//       </div>
//     ) : (
//       <Table>
//  <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Company</TableHead>
//             <TableHead>Total Time</TableHead>
//             <TableHead>Users</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {companies.map((company) => (
//             <TableRow key={company.company}>
//               <TableCell className="font-medium">{company.company}</TableCell>
//               <TableCell>{formatTime(company.totalTime)}</TableCell>
//               <TableCell>{company.userCount}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>      </Table>
//     )}

     
//     </div>
//   );
// };

// export default CompanyTimeReport;

// components/CompanyTimeReport.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CompanyTime {
  company: string;
  totalTime: number;
  userCount: number;
}

const CompanyTimeReport = () => {
  const [companies, setCompanies] = useState<CompanyTime[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCompanyTimes = async (start?: string, end?: string) => {
    setLoading(true);
    setError('');
    try {
      let url = 'https://admin2-neon.vercel.app/api/users/companies/times';
      const params = new URLSearchParams();
      
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      setCompanies(data);
    } catch (error) {
      console.error('Error fetching company times:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyTimes();
  }, []);

  const handleSearch = () => {
    if ((startDate && !endDate) || (!startDate && endDate)) {
      setError('Please provide both start and end dates');
      return;
    }
    if (startDate > endDate) {
      setError('End date cannot be before start date');
      return;
    }
    fetchCompanyTimes(startDate, endDate);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setError('');
    fetchCompanyTimes();
  };

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6 text-white">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-4">
          <Input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="max-w-xs"
            placeholder="Start date"
          />
          <Input 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="max-w-xs"
            placeholder="End date"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </Button>
          <Button className='bg-white text-black' onClick={clearFilters}>
            Clear
          </Button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>

      {loading ? (
        <div className="text-center py-4">Loading company data...</div>
      ) : companies.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No company data available
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Total Time</TableHead>
              <TableHead>Users</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.company}>
                <TableCell className="font-medium">{company.company}</TableCell>
                <TableCell>{formatTime(company.totalTime)}</TableCell>
                <TableCell>{company.userCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CompanyTimeReport;