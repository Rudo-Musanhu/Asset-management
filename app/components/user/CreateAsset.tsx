import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useCategories, useDepartments } from '@/hooks/useData';
import { useAppContext } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CreateAssetProps {
  onSuccess: () => void;
  onNavigateToAssets?: () => void;
}

export const CreateAsset: React.FC<CreateAssetProps> = ({ onSuccess, onNavigateToAssets }) => {
  const { user } = useAuth();
  const { categories } = useCategories();
  const { departments } = useDepartments();
  const { triggerRefresh } = useAppContext();

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    department_id: '',
    date_purchased: '',
    cost: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    // Validate date - no future dates allowed
    if (form.date_purchased) {
      const purchaseDate = new Date(form.date_purchased);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (purchaseDate > today) {
        setError('Purchase date cannot be in the future. Please select today or an earlier date.');
        setSaving(false);
        return;
      }
    }


    // If image selected, upload first
    let image_url: string | null = null;
    if (imageFile) {
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `assets/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicData } = await supabase.storage.from('assets').getPublicUrl(filePath);
        image_url = publicData?.publicUrl || null;
      } catch (err: any) {
        console.error('Image upload error:', err);
        setError(err.message || 'Image upload failed');
        setSaving(false);
        return;
      }
    }

    const { error, data } = await supabase.from('assets').insert([{
      name: form.name,
      category_id: form.category_id || null,
      department_id: form.department_id || null,
      date_purchased: form.date_purchased,
      cost: parseFloat(form.cost),
      created_by: user?.id,
      image_url,
    }]);


    if (!error) {
      await supabase.from('activity_logs').insert([{
        user_id: user?.id,
        action: 'Created asset',
        entity_type: 'asset',
        details: form.name,
      }]);
      setForm({ name: '', category_id: '', department_id: '', date_purchased: '', cost: '' });
      setImageFile(null);
      setImagePreview(null);
      setSuccess(true);
      triggerRefresh();
      onSuccess();
    } else {
      console.error('Asset creation error:', error);
      setError(error.message);
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Create New Asset</h2>
        <p className="text-slate-500">Add a new asset to the system</p>
      </div>

      <Card className="max-w-2xl p-6">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">Asset created successfully!</p>
            {onNavigateToAssets && (
              <button
                onClick={onNavigateToAssets}
                className="mt-2 text-green-600 hover:text-green-800 underline text-sm"
              >
                View My Assets →
              </button>
            )}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Asset Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., MacBook Pro 16-inch"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                value={form.department_id}
                onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Date Purchased"
              type="date"
              value={form.date_purchased}
              onChange={(e) => setForm({ ...form, date_purchased: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              required
            />
            <p className="text-xs text-slate-500">Only today or past dates are allowed</p>
            <Input
              label="Cost (USD)"
              type="number"
              step="0.01"
              min="0"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

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

          <div className="pt-4">
            <Button type="submit" isLoading={saving} size="lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Asset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};