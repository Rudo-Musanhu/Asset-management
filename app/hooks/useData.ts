import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User, Department, AssetCategory, Asset, ActivityLog } from '../types';
import { useAppContext } from '../contexts/AppContext';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('app_users').select('*').order('created_at', { ascending: false });
      if (err) {
        console.error('useUsers error:', err);
        setError(err.message);
        setUsers([]);
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      console.error('useUsers exception:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  return { users, loading, error, refetch: fetchUsers };
};

export const useAssets = (userId?: string) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useAppContext();

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First try - just get assets without joins to debug
      const { data, error: err } = await supabase
        .from('assets')
        .select('id, name, category_id, department_id, date_purchased, cost, created_by, created_at')
        .order('created_at', { ascending: false });
      
      
      if (err) {
        console.error('[useAssets] Query error:', err);
        setError(err.message);
        setAssets([]);
      } else {
        if (data && data.length > 0) {
        }
        
        // Filter by userId if provided, otherwise show all
        let filtered = (data as any[]) || [];
        if (userId) {
          filtered = filtered.filter(a => a.created_by === userId);
        }
        setAssets(filtered as Asset[]);
      }
    } catch (err) {
      console.error('[useAssets] Exception:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { 
    fetchAssets(); 
  }, [fetchAssets]);
  
  // Refetch when refreshTrigger changes
  useEffect(() => {
    fetchAssets();
  }, [refreshTrigger, fetchAssets]);

  return { assets, loading, error, refetch: fetchAssets };
};

export const useActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useAppContext();

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('activity_logs').select('*, user:app_users(*)').order('created_at', { ascending: false }).limit(10);
      if (err) {
        console.error('useActivityLogs error:', err);
        setError(err.message);
        setLogs([]);
      } else {
        setLogs(data || []);
      }
    } catch (err) {
      console.error('useActivityLogs exception:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  
  // Refetch when refreshTrigger changes
  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger, fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('asset_categories').select('*').order('created_at', { ascending: false });
      if (err) {
        console.error('useCategories error:', err);
        setError(err.message);
        setCategories([]);
      } else {
        setCategories(data || []);
      }
    } catch (err) {
      console.error('useCategories exception:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  return { categories, loading, error, refetch: fetchCategories };
};

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('departments').select('*').order('created_at', { ascending: false });
      if (err) {
        console.error('useDepartments error:', err);
        setError(err.message);
        setDepartments([]);
      } else {
        setDepartments(data || []);
      }
    } catch (err) {
      console.error('useDepartments exception:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);
  return { departments, loading, error, refetch: fetchDepartments };
};
