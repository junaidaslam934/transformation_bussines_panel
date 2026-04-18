"use client";
import { useState, useEffect } from 'react';
import DashboardService from '@/services/dashboardService';
import { IUser } from '@/lib/api/types';

export const useRecentUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await DashboardService.getRecentUsers();
        setUsers(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch recent users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}; 