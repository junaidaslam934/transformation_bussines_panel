"use client";
import { useState, useEffect } from 'react';
import DashboardService from '@/services/dashboardService';
import { IDashboardStats } from '@/lib/api/types';

export const useDashboardStats = () => {
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await DashboardService.getDashboardStats();
        setStats(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}; 