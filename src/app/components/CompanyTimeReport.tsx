"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserTime {
  email: string;
  totalTime: number;
  activeDates: string[];
  idleDates: string[];
}

interface CompanyTime {
  company: string;
  totalTime: number;
  userCount: number;
  users: UserTime[];
}

const CompanyTimeReport = () => {
  const [companies, setCompanies] = useState<CompanyTime[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  const fetchCompanyTimes = async (start?: string, end?: string) => {
    setLoading(true);
    setError("");
    try {
      let url = "https://admin2-neon.vercel.app/api/users/companies/times";
      const params = new URLSearchParams();
      if (start) params.append("startDate", start);
      if (end) params.append("endDate", end);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch data");
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received");
      }

      setCompanies(data);
    } catch (error) {
      console.error("Error fetching company times:", error);
      setError(error instanceof Error ? error.message : "Failed to load data");
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
      setError("Please provide both start and end dates");
      return;
    }
    if (startDate > endDate) {
      setError("End date cannot be before start date");
      return;
    }
    fetchCompanyTimes(startDate, endDate);
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setError("");
    setExpandedCompany(null);
    fetchCompanyTimes();
  };

  const toggleCompany = (company: string) => {
    setExpandedCompany(expandedCompany === company ? null : company);
  };

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatDates = (dates: string[]) => {
    return dates.length > 0 ? dates.join(", ") : "None";
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-4">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="max-w-xs bg-gray-800 text-white border-gray-700"
            placeholder="Start date"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="max-w-xs bg-gray-800 text-white border-gray-700"
            placeholder="End date"
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Loading..." : "Search"}
          </Button>
          <Button
            onClick={clearFilters}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            Clear
          </Button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>

      {loading ? (
        <div className="text-center py-4">Loading company data...</div>
      ) : companies.length === 0 ? (
        <div className="text-center py-4 text-gray-400">
          No company data available
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700">
              <TableHead className="text-gray-300">Company</TableHead>
              <TableHead className="text-gray-300">Total Time</TableHead>
              <TableHead className="text-gray-300">Users</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <>
                <TableRow
                  key={company.company}
                  onClick={() => toggleCompany(company.company)}
                  className="cursor-pointer hover:bg-gray-800 border-b border-gray-700"
                >
                  <TableCell className="font-medium">{company.company}</TableCell>
                  <TableCell>{formatTime(company.totalTime)}</TableCell>
                  <TableCell>{company.userCount}</TableCell>
                </TableRow>
                {expandedCompany === company.company && (
                  <TableRow className="bg-gray-800">
                    <TableCell colSpan={3}>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Users</h3>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b border-gray-600">
                              <TableHead className="text-gray-300">Email</TableHead>
                              <TableHead className="text-gray-300">Total Time</TableHead>
                              <TableHead className="text-gray-300">Active Dates</TableHead>
                              <TableHead className="text-gray-300">Idle Dates</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {company.users.map((user) => (
                              <TableRow key={user.email} className="border-b border-gray-600">
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{formatTime(user.totalTime)}</TableCell>
                                <TableCell className="text-green-400">
                                  {formatDates(user.activeDates)}
                                </TableCell>
                                <TableCell className="text-yellow-400">
                                  {formatDates(user.idleDates)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CompanyTimeReport;