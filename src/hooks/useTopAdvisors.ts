"use client";
import { useState, useEffect } from 'react';
import DashboardService from '@/services/dashboardService';
import { ITopAdvisor } from '@/lib/api/types';

export const useTopAdvisors = () => {
  const [advisors, setAdvisors] = useState<ITopAdvisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await DashboardService.getTopAdvisors();
        setAdvisors(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch top advisors');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisors();
  }, []);

  return { advisors, loading, error };
}; 