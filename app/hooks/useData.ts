import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User, Department, AssetCategory, Asset, ActivityLog } from '../types';
import { useAppContext } from '../contexts/AppContext';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('app_users').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  return { users, loading, refetch: fetchUsers };
};

export const useAssets = (userId?: string) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshTrigger } = useAppContext();

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('assets')
      .select('*, category:asset_categories(*), department:departments(*), creator:app_users(*)')
      .order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('created_by', userId);
    }
    const { data } = await query;
    setAssets(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchAssets(); }, [fetchAssets, refreshTrigger]);
  return { assets, loading, refetch: fetchAssets };
};

export const useActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const fetchLogs = useCallback(async () => {
    const { data } = await supabase.from('activity_logs').select('*, user:app_users(*)').order('created_at', { ascending: false }).limit(10);
    setLogs(data || []);
  }, []);
  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  return { logs, refetch: fetchLogs };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('asset_categories').select('*').order('created_at', { ascending: false });
    setCategories(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  return { categories, loading, refetch: fetchCategories };
};

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('departments').select('*').order('created_at', { ascending: false });
    setDepartments(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);
  return { departments, loading, refetch: fetchDepartments };
};
