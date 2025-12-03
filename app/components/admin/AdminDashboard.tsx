import React, { useMemo } from 'react';
import { useUsers, useAssets, useCategories, useDepartments, useActivityLogs } from '../../hooks/useData';
import { Card } from '../ui/Card';

export const AdminDashboard: React.FC<{ refreshKey?: number }> = ({ refreshKey }) => {
  const { users, loading: usersLoading } = useUsers();
  const { assets, loading: assetsLoading } = useAssets();
  const { categories, loading: categoriesLoading } = useCategories();
  const { departments, loading: departmentsLoading } = useDepartments();
  const { logs } = useActivityLogs();

  // Memoize calculations to prevent unnecessary recalculations
  const stats = useMemo(() => {
    return {
      totalUsers: users.length,
      totalAssets: assets.length,
      totalCategories: categories.length,
      totalDepartments: departments.length,
      totalAssetValue: assets.reduce((sum, asset) => sum + (Number(asset.cost) || 0), 0),
      usedCategories: new Set(assets.map(a => a.category_id).filter(Boolean)).size,
      usedDepartments: new Set(assets.map(a => a.department_id).filter(Boolean)).size,
    };
  }, [users, assets, categories, departments]);

  const { totalUsers, totalAssets, totalCategories, totalDepartments, totalAssetValue } = stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Overview of your asset management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Assets</p>
              <p className="text-2xl font-bold text-slate-900">{totalAssets}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Categories</p>
              <p className="text-2xl font-bold text-slate-900">{totalCategories}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7v8m6-8v8m-5 5h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Departments</p>
              <p className="text-2xl font-bold text-slate-900">{totalDepartments}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Asset Value Card */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Asset Value</p>
            <p className="text-3xl font-bold text-slate-900">${totalAssetValue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-full">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {logs.length > 0 ? (
            logs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{log.action}</p>
                  <p className="text-xs text-slate-500">
                    {log.user?.full_name || 'System'} • {new Date(log.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(log.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No recent activity</p>
          )}
        </div>
      </Card>
    </div>
  );
};