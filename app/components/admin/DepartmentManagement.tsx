import React, { useState } from 'react';
import { useDepartments } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';
import { Department } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { toast } from 'sonner';

export const DepartmentManagement: React.FC = () => {
  const { departments, loading, refetch } = useDepartments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
    setEditingDepartment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        // Update department
        const { error } = await supabase
          .from('departments')
          .update({
            name: formData.name,
            description: formData.description || null,
          })
          .eq('id', editingDepartment.id);

        if (error) throw error;
        toast.success('Department updated successfully');
      } else {
        // Create department
        const { error } = await supabase
          .from('departments')
          .insert({
            name: formData.name,
            description: formData.description || null,
          });

        if (error) throw error;
        toast.success('Department created successfully');
      }

      setIsModalOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (departmentId: string) => {
    if (!confirm('Are you sure you want to delete this department? This may affect existing assets.')) return;

    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId);

      if (error) throw error;
      toast.success('Department deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Department Management</h1>
          <p className="text-slate-600 mt-2">Manage organizational departments</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          Add New Department
        </Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8">Loading departments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Created</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) => (
                  <tr key={department.id} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">{department.name}</td>
                    <td className="py-3 px-4">{department.description || '-'}</td>
                    <td className="py-3 px-4">{new Date(department.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(department)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(department.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {departments.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No departments found. Click "Add New Department" to create your first department.
              </div>
            )}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingDepartment ? 'Edit Department' : 'Add New Department'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Optional description"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit">
              {editingDepartment ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};