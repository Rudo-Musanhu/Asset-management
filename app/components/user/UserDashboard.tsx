import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAssets, useCategories } from '@/hooks/useData';
import { Card, StatCard } from '@/components/ui/Card';

export const UserDashboard: React.FC<{ refreshKey?: number }> = ({ refreshKey }) => {
  const { user } = useAuth();
  const { assets } = useAssets(user?.id);
  const { categories } = useCategories();

  const totalValue = assets.reduce((sum, a) => sum + Number(a.cost), 0);
  const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const catStats = categories.map((c) => ({
    name: c.name,
    count: assets.filter((a) => a.category_id === c.id).length,
  })).filter((c) => c.count > 0);

  const recentAssets = assets.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user?.full_name}</h2>
        <p className="text-slate-500">Here's an overview of your assets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="My Assets" value={assets.length} color="blue" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
        <StatCard title="Total Value" value={formatCurrency(totalValue)} color="green" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Categories Used" value={catStats.length} color="purple" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Assets</h3>
          {recentAssets.length === 0 ? (
            <p className="text-slate-500 text-sm">No assets yet. Create your first asset!</p>
          ) : (
            <div className="space-y-3">
              {recentAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{asset.name}</p>
                      <p className="text-xs text-slate-500">{asset.category?.name || 'Uncategorized'}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">{formatCurrency(asset.cost)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Assets by Category</h3>
          {catStats.length === 0 ? (
            <p className="text-slate-500 text-sm">No categorized assets yet</p>
          ) : (
            <div className="space-y-4">
              {catStats.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-600 rounded-full" />
                    <span className="text-slate-700">{c.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};