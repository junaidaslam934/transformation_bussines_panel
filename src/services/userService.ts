import { IUsersResponse, IUser, IUserActivity, IUserActivityResponse, IDailyBodyMetricsResponse, IDailyWorkoutsResponse, ICustomWorkoutsResponse, IUserAssetsResponse, UserAssetType } from '@/types/api';

class UserService {
  private static baseUrl = 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';

  static async getUsers(page: number = 1, limit: number = 10): Promise<IUsersResponse> {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      
      const response = await fetch(`${this.baseUrl}/users?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getUserById(userId: string): Promise<{ success: boolean; data: IUser }> {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  static async getUserActivityByDate(userId: string, date: string): Promise<IUserActivityResponse> {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      
      const response = await fetch(`${this.baseUrl}/user-activities/by-date?userId=${userId}&date=${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }

  static async getUserByCognitoId(cognitoId: string): Promise<{ success: boolean; data: IUser }> {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      
      const response = await fetch(`${this.baseUrl}/users/cognito/${cognitoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user by Cognito ID:', error);
      throw error;
    }
  }

  static async updateUser(userId: string, payload: any): Promise<{ success: boolean; data: IUser }> {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || this.baseUrl;
      const response = await fetch(`${envBaseUrl}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async getWeekInReview(userId: string, date: string): Promise<{ success: boolean; data: any }> {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      
      const response = await fetch(`${this.baseUrl}/users/week-in-review?userId=${userId}&date=${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching week in review:', error);
      throw error;
    }
  }

  static async getDailyBodyMetrics(userId: string, date: string): Promise<IDailyBodyMetricsResponse> {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || this.baseUrl;
      // Hardcode the userId as requested
      const effectiveUserId = '681b17486bc1f46b3a2e406f';
      const url = `${envBaseUrl}/daily-body-metrics?userId=${encodeURIComponent(effectiveUserId)}&date=${encodeURIComponent(date)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching daily body metrics:', error);
      throw error;
    }
  }

  static async getMetricHistory(userId: string, type: string, duration: string): Promise<any> {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || this.baseUrl;
      // Hardcode the userId as requested
      const effectiveUserId = '681b17486bc1f46b3a2e406f';
      const url = `${envBaseUrl}/daily-body-metrics/history?userId=${encodeURIComponent(effectiveUserId)}&type=${encodeURIComponent(type)}&duration=${encodeURIComponent(duration)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching metric history:', error);
      throw error;
    }
  }

  static async getCustomWorkout(workoutId: string, userId: string): Promise<any> {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || this.baseUrl;
      // Hardcode the userId as requested
      const effectiveUserId = '681b17486bc1f46b3a2e406f';
      const url = `${envBaseUrl}/custom-workouts/${workoutId}?userId=${encodeURIComponent(effectiveUserId)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching custom workout:', error);
      throw error;
    }
  }

  static async getDailyWorkouts(workoutId: string): Promise<IDailyWorkoutsResponse> {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || this.baseUrl;
      const url = `${envBaseUrl}/daily-workouts?workoutId=${encodeURIComponent(workoutId)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching daily workouts:', error);
      throw error;
    }
  }

  static async getCustomWorkoutsByUser(userId: string): Promise<ICustomWorkoutsResponse> {
    try {
      // const authToken = localStorage.getItem('authToken') || '';
      const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || this.baseUrl;
      const url = `${envBaseUrl}/custom-workouts?userId=${encodeURIComponent(userId)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // 'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching custom workouts by user:', error);
      throw error;
    }
  }

  static async getUserAssets(params: { userId: string; assetType?: UserAssetType; page?: number; limit?: number; date?: string }): Promise<IUserAssetsResponse> {
    try {
      const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || this.baseUrl;
      const query = new URLSearchParams();
      query.set('userId', params.userId);
      if (params.assetType) query.set('assetType', params.assetType);
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));
      if (params.date) query.set('date', params.date);
      const url = `${envBaseUrl}/user-assets?${query.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user assets:', error);
      throw error;
    }
  }
}

export default UserService; 