
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Asset } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { toast } from 'sonner';
import { useAppContext } from '../../contexts/AppContext';

export const AssetManagement: React.FC = () => {
  const { triggerRefresh } = useAppContext();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAssets, setTotalAssets] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    department_id: '',
    date_purchased: '',
    cost: '',
  });

  // Fetch all assets + total count for Admin
  const fetchAssets = async () => {
    setLoading(true);
    const { data, error, count } = await supabase
      .from('assets')
      .select('*', { count: 'exact' });

    if (error) {
      toast.error(error.message);
    } else {
      setAssets(data || []);
      setTotalAssets(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: '',
      department_id: '',
      date_purchased: '',
      cost: '',
    });
    setEditingAsset(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const assetData = {
        name: formData.name,
        category_id: formData.category_id || null,
        department_id: formData.department_id || null,
        date_purchased: formData.date_purchased,
        cost: parseFloat(formData.cost),
      };

      if (editingAsset) {
        const { error } = await supabase
          .from('assets')
          .update(assetData)
          .eq('id', editingAsset.id);

        if (error) throw error;
        toast.success('Asset updated successfully');
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
          .from('assets')
          .insert({
            ...assetData,
            created_by: user?.id || null,
          });

        if (error) throw error;
        toast.success('Asset created successfully');
      }

      setIsModalOpen(false);
      resetForm();
      fetchAssets(); // refresh list + count
      triggerRefresh();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;
      toast.success('Asset deleted successfully');
      fetchAssets();
      triggerRefresh();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Asset Management</h1>
          <p className="text-slate-600 mt-2">Manage all assets in the system</p>
          <p className="text-slate-700 mt-1">Total Assets: {totalAssets}</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          Add New Asset
        </Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8">Loading assets...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Category ID</th>
                  <th className="text-left py-3 px-4">Department ID</th>
                  <th className="text-left py-3 px-4">Purchase Date</th>
                  <th className="text-left py-3 px-4">Cost</th>
                  <th className="text-left py-3 px-4">Created By</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">{asset.name}</td>
                    <td className="py-3 px-4">{asset.category_id || '-'}</td>
                    <td className="py-3 px-4">{asset.department_id || '-'}</td>
                    <td className="py-3 px-4">{new Date(asset.date_purchased).toLocaleDateString()}</td>
                    <td className="py-3 px-4">${asset.cost.toLocaleString()}</td>
                    <td className="py-3 px-4">{asset.created_by || 'System'}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingAsset(asset)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(asset.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {assets.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No assets found. Click "Add New Asset" to create your first asset.
              </div>
            )}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingAsset ? 'Edit Asset' : 'Add New Asset'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Asset Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Category ID"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          />

          <Input
            label="Department ID"
            value={formData.department_id}
            onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
          />

          <Input
            label="Purchase Date"
            type="date"
            value={formData.date_purchased}
            onChange={(e) => setFormData({ ...formData, date_purchased: e.target.value })}
            required
          />

          <Input
            label="Cost ($)"
            type="number"
            step="0.01"
            min="0"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit">
              {editingAsset ? 'Update Asset' : 'Create Asset'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};