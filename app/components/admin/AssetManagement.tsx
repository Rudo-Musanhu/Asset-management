
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Asset } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useCategories, useDepartments, useUsers } from '../../hooks/useData';

export const AssetManagement: React.FC = () => {
  const { triggerRefresh } = useAppContext();
  const { user } = useAuth();
  const { categories } = useCategories();
  const { departments } = useDepartments();
  const { users } = useUsers();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAssets, setTotalAssets] = useState<number>(0);

  // Helper functions to get names by ID
  const getCategoryName = (categoryId: string | null): string => {
    if (!categoryId) return '-';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '-';
  };

  const getDepartmentName = (departmentId: string | null): string => {
    if (!departmentId) return '-';
    const department = departments.find(d => d.id === departmentId);
    return department?.name || '-';
  };

  const getUserName = (userId: string | null): string => {
    if (!userId) return 'System';
    const creator = users.find(u => u.id === userId);
    return creator?.full_name || creator?.email || '-';
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    department_id: '',
    created_by: '',
    date_purchased: '',
    cost: '',
  });

  // Fetch all assets + total count for Admin
  const fetchAssets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('assets')
      .select('id, name, category_id, department_id, date_purchased, cost, created_by, created_at');

    if (error) {
      console.error('[AssetManagement] Error fetching:', error);
      toast.error(error.message);
    } else {
      setAssets(data || []);
      setTotalAssets(data?.length || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (editingAsset) {
      setFormData({
        name: editingAsset.name,
        category_id: editingAsset.category_id || '',
        department_id: editingAsset.department_id || '',
        created_by: editingAsset.created_by || '',
        date_purchased: editingAsset.date_purchased,
        cost: editingAsset.cost.toString(),
      });
      setImagePreview(editingAsset.image_url || null);
      setIsModalOpen(true);
    }
  }, [editingAsset]);

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: '',
      department_id: '',
      date_purchased: '',
      cost: '',
    });
    setEditingAsset(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate date - no future dates allowed
      if (formData.date_purchased) {
        const purchaseDate = new Date(formData.date_purchased);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (purchaseDate > today) {
          toast.error('Purchase date cannot be in the future. Please select today or an earlier date.');
          return;
        }
      }
      const assetData: any = {
        name: formData.name,
        category_id: formData.category_id || null,
        department_id: formData.department_id || null,
        date_purchased: formData.date_purchased,
        cost: parseFloat(formData.cost),
      };

      // If an image file was selected, upload to Supabase Storage and set image_url
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `assets/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, imageFile);
          if (uploadError) throw uploadError;
          const { data: publicData } = await supabase.storage.from('assets').getPublicUrl(filePath);
          assetData.image_url = publicData?.publicUrl || '';
      }

      if (editingAsset) {
        const { error } = await supabase
          .from('assets')
          .update(assetData)
          .eq('id', editingAsset.id);

        if (error) throw error;
        toast.success('Asset updated successfully');
      } else {
        const { error } = await supabase
          .from('assets')
          .insert({
            ...assetData,
            created_by: formData.created_by || user?.id || null,
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
        <Button onClick={() => { 
          resetForm(); 
          setIsModalOpen(true);
        }}>
          Add New Asset
        </Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8"><div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Department</th>
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
                    <td className="py-3 px-4">{getCategoryName(asset.category_id)}</td>
                    <td className="py-3 px-4">{getDepartmentName(asset.department_id)}</td>
                    <td className="py-3 px-4">{new Date(asset.date_purchased).toLocaleDateString()}</td>
                    <td className="py-3 px-4">${asset.cost.toLocaleString()}</td>
                    <td className="py-3 px-4">{getUserName(asset.created_by)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingAsset(asset)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(asset.id)}>
                          Delete
                        </Button>
                      </div>
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
        onClose={() => { 
          setIsModalOpen(false); 
          resetForm(); 
        }}
        title={editingAsset ? 'Edit Asset' : 'Add New Asset'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date</label>
            <input
              type="date"
              value={formData.date_purchased}
              onChange={(e) => setFormData({ ...formData, date_purchased: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Only today or past dates are allowed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cost ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {user?.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Created By</label>
              <select
                value={formData.created_by}
                onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select creator</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                setImagePreview(file ? URL.createObjectURL(file) : null);
              }}
              className="w-full"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 max-h-40 rounded-md" />
            )}
          </div>

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