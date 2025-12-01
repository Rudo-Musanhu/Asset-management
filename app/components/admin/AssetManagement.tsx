import React, { useState } from 'react';
import { useAssets, useCategories, useDepartments, useUsers } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';
import { Asset } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { toast } from 'sonner';

export const AssetManagement: React.FC = () => {
  const { assets, loading, refetch } = useAssets();
  const { categories } = useCategories();
  const { departments } = useDepartments();
  const { users } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    department_id: '',
    date_purchased: '',
    cost: '',
  });

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
        // Update asset
        const { error } = await supabase
          .from('assets')
          .update(assetData)
          .eq('id', editingAsset.id);

        if (error) throw error;
        toast.success('Asset updated successfully');
      } else {
        // Create asset
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
          .from('assets')
          .insert({
            ...assetData,
            created_by: user?.id || 'system',
          });

        if (error) throw error;
        toast.success('Asset created successfully');
      }

      setIsModalOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      category_id: asset.category_id || '',
      department_id: asset.department_id || '',
      date_purchased: asset.date_purchased.split('T')[0], // Format for date input
      cost: asset.cost.toString(),
    });
    setIsModalOpen(true);
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
      refetch();
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
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Purchase Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Cost</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Created By</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">{asset.name}</td>
                    <td className="py-3 px-4">{asset.category?.name || '-'}</td>
                    <td className="py-3 px-4">{asset.department?.name || '-'}</td>
                    <td className="py-3 px-4">{new Date(asset.date_purchased).toLocaleDateString()}</td>
                    <td className="py-3 px-4">${asset.cost.toLocaleString()}</td>
                    <td className="py-3 px-4">{asset.creator?.full_name || 'System'}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(asset)}>
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category (Optional)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
            <select
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department (Optional)</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

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