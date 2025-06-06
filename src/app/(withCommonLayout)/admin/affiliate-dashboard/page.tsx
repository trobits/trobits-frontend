"use client";

import React, { useState } from "react";
import { useGetAffiliateAnalyticsQuery, useGetTopAffiliateUsersQuery } from "@/redux/features/api/affiliateApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, MousePointer, TrendingUp, DollarSign, Calendar, Filter } from "lucide-react";

const AffiliateDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: analytics, isLoading: analyticsLoading } = useGetAffiliateAnalyticsQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: topUsers, isLoading: topUsersLoading } = useGetTopAffiliateUsersQuery({
    limit: 20,
    period: "30d",
  });

  const handleDateChange = (field: string, value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  if (analyticsLoading || topUsersLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Affiliate Tracking Dashboard</h1>
          
          {/* Date Range Filter */}
          <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">From:</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">To:</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics?.totalClicks || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Unique Users</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics?.uniqueUsers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Top Affiliate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white">
                {analytics?.topAffiliates?.[0]?.affiliateName || "N/A"}
              </div>
              <div className="text-sm text-gray-400">
                {analytics?.topAffiliates?.[0]?.clicks || 0} clicks
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg. Daily Clicks</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {analytics?.clicksByDate ? Math.round(analytics.totalClicks / analytics.clicksByDate.length) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Clicks by Date */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Clicks Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.clicksByDate || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Affiliates */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Performing Affiliates</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.topAffiliates?.slice(0, 5) || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="affiliateName" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="clicks" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Users Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Users (Reward Candidates)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400">Total Clicks</th>
                    <th className="text-left py-3 px-4 text-gray-400">Unique Affiliates</th>
                    <th className="text-left py-3 px-4 text-gray-400">Est. Earnings</th>
                    <th className="text-left py-3 px-4 text-gray-400">Last Activity</th>
                    <th className="text-left py-3 px-4 text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers?.map((user, index) => (
                    <tr key={user.userId} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-white">{user.userName || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{user.email || 'N/A'}</td>
                      <td className="py-3 px-4 text-white font-semibold">{user.totalClicks}</td>
                      <td className="py-3 px-4 text-gray-300">{user.uniqueAffiliates}</td>
                      <td className="py-3 px-4 text-green-400">${user.estimatedEarnings.toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(user.lastActivity).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          size="sm" 
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => {
                            // TODO: Implement reward sending
                            alert(`Send reward to ${user.userName || user.email}`);
                          }}
                        >
                          Send Reward
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateDashboard; 