import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAssets, useCategories, useDepartments } from '@/hooks/useData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';

export const MyAssets: React.FC<{ refreshKey?: number }> = ({ refreshKey }) => {
  const { user } = useAuth();
  const { assets, loading, error } = useAssets(user?.id);
  const { assets: allAssets, loading: allLoading } = useAssets(); // Fetch ALL assets for comparison
  const { categories } = useCategories();
  const { departments } = useDepartments();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');

  // Create lookup maps for categories and departments
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  const departmentMap = new Map(departments.map(d => [d.id, d]));

  useEffect(() => {
    console.log('MyAssets mounted/updated');
    console.log('MyAssets - user object:', user);
    console.log('MyAssets - user?.id type:', typeof user?.id, 'value:', user?.id);
    console.log('MyAssets - assets received (filtered):', assets);
    console.log('MyAssets - assets count (filtered):', assets.length);
    console.log('MyAssets - ALL assets count (unfiltered):', allAssets.length);
    console.log('MyAssets - error:', error);
    if (assets.length > 0) {
      console.log('MyAssets - sample asset:', assets[0]);
      console.log('MyAssets - sample asset created_by:', (assets[0] as any).created_by);
    }
    if (allAssets.length > 0) {
      console.log('MyAssets - all assets sample:', allAssets[0]);
      console.log('MyAssets - all assets created_by values:', allAssets.map(a => ({ name: a.name, created_by: (a as any).created_by })));
    }
  }, [user?.id, assets, allAssets, error]);

  const filtered = assets.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat && a.category_id !== filterCat) return false;
    return true;
  });

  const totalValue = filtered.reduce((sum, a) => sum + Number(a.cost), 0);
  const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const exportCSV = () => {
    const headers = ['Name', 'Category', 'Department', 'Cost', 'Date Purchased'];
    const rows = filtered.map((a) => [a.name, a.category_id ? categoryMap.get(a.category_id)?.name || '' : '', a.department_id ? departmentMap.get(a.department_id)?.name || '' : '', a.cost, a.date_purchased]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-assets.csv';
    a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Assets</h2>
          <p className="text-slate-500">{filtered.length} assets - Total: {formatCurrency(totalValue)}</p>
        </div>
        <Button variant="secondary" onClick={exportCSV}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]"><Input placeholder="Search assets..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="w-48"><Select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} options={categories.map((c) => ({ value: c.id, label: c.name }))} /></div>
          {(search || filterCat) && <Button variant="ghost" onClick={() => { setSearch(''); setFilterCat(''); }}>Clear</Button>}
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs font-mono">
          <p className="text-blue-900">DEBUG: User ID = {user?.id}</p>
          <p className="text-blue-900">DEBUG: Filtered assets = {assets.length}, All assets = {allAssets.length}</p>
          {assets.length === 0 && allAssets.length > 0 && (
            <p className="text-red-900">⚠️ Assets exist in DB but none match user ID. Check created_by field.</p>
          )}
          {assets.length === 0 && allAssets.length === 0 && (
            <p className="text-orange-900">⚠️ No assets in database at all.</p>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No assets found</h3>
          <p className="text-slate-500">Create your first asset to get started</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((asset) => (
            <Card key={asset.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-green-600">{formatCurrency(asset.cost)}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{asset.name}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {asset.category_id && categoryMap.get(asset.category_id) && <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">{categoryMap.get(asset.category_id)?.name}</span>}
                {asset.department_id && departmentMap.get(asset.department_id) && <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">{departmentMap.get(asset.department_id)?.name}</span>}
              </div>
              <p className="text-sm text-slate-500">Purchased: {new Date(asset.date_purchased).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};