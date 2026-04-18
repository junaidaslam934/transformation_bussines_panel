import api from '@/utils/api';
import { INutritionsResponse, IBaseFoodsResponse, IMealPlanItemsResponse, IBaseSupplementsResponse } from '@/types/api';

// Helper function to get auth token from cookies or localStorage
const getAuthToken = (): string => {
  // Try to get from cookie first
  const cookies = document.cookie.split(';');
  const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
  
  if (accessTokenCookie) {
    const token = accessTokenCookie.split('=')[1];
    return token;
  }
  
  // Fallback to localStorage if cookie not found
  const storedUser = localStorage.getItem('user-storage');
  
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      const token = userData.state?.idToken || '';
      return token;
    } catch (error) {
      return '';
    }
  }
  
  return '';
};

export class NutritionService {
  /**
   * Get all nutritions with pagination
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise<INutritionsResponse>
   */
  static async getNutritions(page: number = 1, limit: number = 100): Promise<INutritionsResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/nutritions?limit=${limit}&page=${page}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error fetching nutritions:', error);
      throw new Error('Failed to fetch nutritions');
    }
  }

  /**
   * Get nutrition by ID
   * @param nutritionId - The nutrition ID
   * @returns Promise<INutritionsResponse>
   */
  static async getNutritionById(nutritionId: string): Promise<INutritionsResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/nutritions/${nutritionId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error fetching nutrition:', error);
      throw new Error('Failed to fetch nutrition');
    }
  }

  /**
   * Create a new nutrition entry
   * @param nutritionData - The nutrition data
   * @returns Promise<INutritionsResponse>
   */
  static async createNutrition(nutritionData: {
    waterInTake: number;
    nutritionDate: string;
  }): Promise<INutritionsResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/nutritions`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(nutritionData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error creating nutrition:', error);
      throw new Error('Failed to create nutrition');
    }
  }

  /**
   * Update an existing nutrition entry
   * @param nutritionId - The nutrition ID
   * @param nutritionData - The updated nutrition data
   * @returns Promise<INutritionsResponse>
   */
  static async updateNutrition(nutritionId: string, nutritionData: {
    waterInTake?: number;
    nutritionDate?: string;
  }): Promise<INutritionsResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/nutritions/${nutritionId}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(nutritionData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error updating nutrition:', error);
      throw new Error('Failed to update nutrition');
    }
  }

  /**
   * Delete a nutrition entry
   * @param nutritionId - The nutrition ID
   * @returns Promise<INutritionsResponse>
   */
  static async deleteNutrition(nutritionId: string): Promise<INutritionsResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/nutritions/${nutritionId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error deleting nutrition:', error);
      throw new Error('Failed to delete nutrition');
    }
  }

  /**
   * Get base foods with pagination
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise<IBaseFoodsResponse>
   */
  static async getBaseFoods(page: number = 1, limit: number = 10): Promise<IBaseFoodsResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/base-foods/?limit=${limit}&page=${page}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error fetching base foods:', error);
      throw new Error('Failed to fetch base foods');
    }
  }

  /**
   * Get meal plan items with pagination
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise<IMealPlanItemsResponse>
   */
  static async getMealPlanItems(page: number = 1, limit: number = 10): Promise<IMealPlanItemsResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/meal-plan-items/?limit=${limit}&page=${page}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error fetching meal plan items:', error);
      throw new Error('Failed to fetch meal plan items');
    }
  }

  /**
   * Get base supplements with pagination
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise<IBaseSupplementsResponse>
   */
  static async getBaseSupplements(page: number = 1, limit: number = 10): Promise<IBaseSupplementsResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/base-supplements/?limit=${limit}&page=${page}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error fetching base supplements:', error);
      throw new Error('Failed to fetch base supplements');
    }
  }

  /**
   * Create a new meal plan item
   * @param mealPlanItemData - The meal plan item data
   * @returns Promise<IMealPlanItemsResponse>
   */
  static async createMealPlanItem(mealPlanItemData: {
    itemType: 'PROTEIN' | 'CARB' | 'VEGGIE';
    itemName: string;
    quantityInGrams: number;
    quantityInOz: number;
  }): Promise<IMealPlanItemsResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/meal-plan-items`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(mealPlanItemData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error creating meal plan item:', error);
      throw new Error('Failed to create meal plan item');
    }
  }
}

export default NutritionService; 