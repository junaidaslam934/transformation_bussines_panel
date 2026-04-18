import api from '@/utils/api';
import { IDashboardStats, IDashboardStatsResponse, ITopAdvisorsResponse, IRecentUsersResponse, IChallengesResponse } from '@/lib/api/types';

export class DashboardService {
  /**
   * Get dashboard stats for admin
   * @returns Promise<IDashboardStatsResponse>
   */
  static async getDashboardStats(): Promise<IDashboardStatsResponse> {
    try {
      const response = await api.authenticated.get('/dashboard/admin/stats');
      
      if (response && response.success && response.data) {
        return response;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      throw new Error('Failed to fetch dashboard stats');
    }
  }

  /**
   * Get top advisors for admin dashboard
   * @returns Promise<ITopAdvisorsResponse>
   */
  static async getTopAdvisors(): Promise<ITopAdvisorsResponse> {
    try {
      const response = await api.authenticated.get('/dashboard/admin/top-advisors');
      
      if (response && response.success && response.data) {
        return response;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      throw new Error('Failed to fetch top advisors');
    }
  }

  /**
   * Get recent users for admin dashboard
   * @returns Promise<IRecentUsersResponse>
   */
  static async getRecentUsers(): Promise<IRecentUsersResponse> {
    try {
      const response = await api.authenticated.get('/users?limit=10');
      
      if (response && response.success && response.data) {
        return response;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      throw new Error('Failed to fetch recent users');
    }
  }

  /**
   * Get challenges for admin dashboard
   * @returns Promise<IChallengesResponse>
   */
  static async getChallenges(): Promise<IChallengesResponse> {
    try {
      const response = await api.authenticated.get('/challenge/previous-challenges');
      
      if (response && response.success && response.data) {
        return response;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      throw new Error('Failed to fetch challenges');
    }
  }
}

export default DashboardService; 