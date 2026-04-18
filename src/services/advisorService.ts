import { IUsersResponse, IUser } from '@/types/api';

class AdvisorService {
  private static baseUrl = 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';

  // Helper function to get cookie value
  private static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  static async getAdvisors(page: number = 1, limit: number = 100): Promise<IUsersResponse> {
    try {
      const authToken = this.getCookie('authToken') || '';
      
      // Use dedicated advisors endpoint
      const response = await fetch(`${this.baseUrl}/advisors?page=${page}&limit=${limit}`, {
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
      
      // Ensure data has the expected structure
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from API');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching advisors:', error);
      throw error;
    }
  }

  static async getAllAdvisors(): Promise<any[]> {
    try {
      const authToken = this.getCookie('authToken') || '';
      
      // Use dedicated advisors endpoint
      const response = await fetch(`${this.baseUrl}/advisors?limit=100`, {
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
      
      // Handle both array and object with data property
      if (Array.isArray(data)) {
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error fetching all advisors:', error);
      throw error;
    }
  }

  static async getAdvisorById(advisorId: string): Promise<{ success: boolean; data: IUser }> {
    try {
      const authToken = this.getCookie('authToken') || '';
      
      // First try the dedicated advisors endpoint
      let response = await fetch(`${this.baseUrl}/advisors/${advisorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      // If dedicated endpoint fails, try the users endpoint
      if (!response.ok) {
        console.log('Dedicated advisor endpoint failed, trying users endpoint...');
        response = await fetch(`${this.baseUrl}/users/${advisorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw advisor data:', data);
      
      // Handle both direct advisor object and wrapped response
      if (data.data) {
        return data;
      } else {
        return { success: true, data: data };
      }
    } catch (error) {
      console.error('Error fetching advisor by ID:', error);
      throw error;
    }
  }

  static async deleteAdvisor(advisorId: string): Promise<void> {
    try {
      const authToken = this.getCookie('authToken') || '';
      
      const response = await fetch(`${this.baseUrl}/users/${advisorId}`, {
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
      console.error('Error deleting advisor:', error);
      throw error;
    }
  }

  static async createAdvisor(advisorData: {
    firstName: string;
    lastName: string;
    cognitoId: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      tiktok?: string;
    };
  }): Promise<{ success: boolean; data: any }> {
    try {
      const authToken = this.getCookie('accessToken') || '';
      
      const response = await fetch(`${this.baseUrl}/advisors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(advisorData),
      });

      if (!response.ok) {
        // Try to get the error response data
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If we can't parse JSON, use text
          errorData = { message: await response.text() };
        }
        
        // Create an error object that preserves the API response
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        (error as any).response = { data: errorData, status: response.status };
        throw error;
      }

      const data = await response.json();
      console.log('Advisor created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating advisor:', error);
      throw error;
    }
  }

  static async generatePresignedUrl(advisorId: string, fileName: string, fileType: string): Promise<{ success: boolean; data: any }> {
    try {
      const authToken = this.getCookie('authToken') || '';
      
      console.log('Generating presigned URL for:', { advisorId, fileName, fileType });
      
      const response = await fetch(`${this.baseUrl}/advisors/generate-presigned-url/${advisorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          fileName,
          fileType
        }),
      });

      if (!response.ok) {
        // Try to get the error response data
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If we can't parse JSON, use text
          errorData = { message: await response.text() };
        }
        
        // Create an error object that preserves the API response
        const error = new Error(errorData.message || `Failed to generate presigned URL: ${response.status}`);
        (error as any).response = { data: errorData, status: response.status };
        throw error;
      }

      const data = await response.json();
      console.log('Presigned URL generated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  static async uploadImageToS3(presignedUrl: string, file: File): Promise<void> {
    try {
      console.log('Uploading to S3 with URL:', presignedUrl);
      console.log('File type:', file.type);
      
      // For S3 presigned URLs, we need to use the exact Content-Type that was used to generate the URL
      // The presigned URL already includes the necessary AWS signature parameters
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('S3 upload error response:', errorText);
        console.error('Response status:', response.status);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        throw new Error(`S3 upload failed with status: ${response.status}`);
      }

      console.log('Image uploaded to S3 successfully');
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw error;
    }
  }

  static async updateAdvisor(advisorId: string, advisorData: any): Promise<{ success: boolean; data: IUser }> {
    try {
      const authToken = this.getCookie('accessToken') || '';
      
      // Only allow editing of specific fields: socialLinks, profileImage, firstName
      const allowedFields = {
        socialLinks: advisorData.socialLinks,
        profileImage: advisorData.profileImage,
        firstName: advisorData.firstName
      };
      
      // Remove undefined values
      const dataToSend = Object.fromEntries(
        Object.entries(allowedFields).filter(([_, value]) => value !== undefined)
      );
      
      const response = await fetch(`${this.baseUrl}/advisors/${advisorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        // Try to get the error response data
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If we can't parse JSON, use text
          errorData = { message: await response.text() };
        }
        
        // Create an error object that preserves the API response
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        (error as any).response = { data: errorData, status: response.status };
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating advisor:', error);
      throw error;
    }
  }

  static async updateAdvisorProfileImage(advisorId: string, imageUrl: string): Promise<{ success: boolean; data: any }> {
    try {
      const authToken = this.getCookie('authToken') || '';
      
      console.log('🔧 Updating advisor profile image:', { advisorId, imageUrl });
      const url = `${this.baseUrl}/advisors/${advisorId}`;
      console.log('🔧 PATCH URL:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          profileImage: imageUrl
        }),
      });
      
      console.log('🔧 PATCH Response status:', response.status);

      if (!response.ok) {
        // Try to get the error response data
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If we can't parse JSON, use text
          errorData = { message: await response.text() };
        }
        
              console.log('❌ PATCH Response error:', errorData);
      console.log('❌ Response status:', response.status);
      console.log('❌ Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Create an error object that preserves the API response
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      (error as any).response = { data: errorData, status: response.status };
      throw error;
      }

      const data = await response.json();
      console.log('🔧 PATCH Response:', data);
      
      if (data && data.success) {
        console.log('✅ Advisor profile image updated successfully');
        return data;
      } else {
        throw new Error('Invalid response from update API');
      }
    } catch (error) {
      console.error('Error updating advisor profile image:', error);
      throw error;
    }
  }

  static async uploadAdvisorProfileImage(advisorId: string, imageFile: File): Promise<{ success: boolean; data: any }> {
    try {
      console.log('🔧 === UPLOAD ADVISOR PROFILE IMAGE CALLED ===');
      console.log('🔧 Starting advisor profile image upload:', { advisorId, fileName: imageFile.name });
      
      // Step 1: Generate presigned URL
      const fileExtension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `profile_${Date.now()}.${fileExtension}`;
      
      console.log('🔧 Generating presigned URL for:', { advisorId, fileName, fileExtension });
      
      const presignedResponse = await this.generatePresignedUrl(advisorId, fileName, fileExtension);
      
      if (!presignedResponse.success || !presignedResponse.data?.putUrl) {
        console.error('🔧 Failed to get presigned URL:', presignedResponse);
        throw new Error('Failed to generate upload URL for image');
      }
      
      console.log('🔧 Presigned URL received:', presignedResponse.data.putUrl);
      console.log('🔧 Get URL for database:', presignedResponse.data.getUrl);
      
      // Step 2: Upload image to S3 using putUrl
      console.log('🔧 Uploading image to S3...');
      await this.uploadImageToS3(presignedResponse.data.putUrl, imageFile);
      console.log('🔧 Image uploaded to S3 successfully');
      
      // Step 3: Update advisor profile with the getUrl in database
      console.log('🔧 Updating advisor profile with image URL:', presignedResponse.data.getUrl);
      const updateResponse = await this.updateAdvisorProfileImage(advisorId, presignedResponse.data.getUrl);
      
      console.log('🔧 Profile update response:', updateResponse);
      return updateResponse;
      
    } catch (error) {
      console.error('Error in uploadAdvisorProfileImage:', error);
      throw error;
    }
  }

  static async checkIfUserIsAdvisor(userId: string): Promise<boolean> {
    try {
      const authToken = this.getCookie('authToken') || '';
      
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
      return data.data?.role === 'ADVISOR';
    } catch (error) {
      console.error('Error checking if user is advisor:', error);
      throw error;
    }
  }

  static async getUsersByRole(role: string): Promise<any[]> {
    try {
      const authToken = this.getCookie('authToken') || '';
      
      // For advisors, use the dedicated endpoint
      if (role === 'ADVISOR') {
        const response = await fetch(`${this.baseUrl}/advisors?limit=100`, {
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
        
        // Handle both array and object with data property
        if (Array.isArray(data)) {
          return data;
        } else if (data.data && Array.isArray(data.data)) {
          return data.data;
        } else {
          throw new Error('Invalid response format from API');
        }
      }
      
      // For other roles, fetch all users and filter
      const response = await fetch(`${this.baseUrl}/users?page=1&limit=1000`, {
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
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from API');
      }
      
      // Filter by role on frontend
      const usersByRole = data.data.filter((user: IUser) => user.role === role);
      
      return usersByRole;
    } catch (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      throw error;
    }
  }

  static async getAssignedUsers(advisorId: string, page: number = 1, limit: number = 10, searchName: string = ''): Promise<{
    success: boolean;
    total: number;
    page: number;
    limit: number;
    data: any[];
  }> {
    try {
      const authToken = this.getCookie('authToken') || '';
      
      // Build query parameters
      let queryParams = `limit=${limit}&page=${page}`;
      if (searchName && searchName.trim() !== '') {
        queryParams += `&searchName=${encodeURIComponent(searchName.trim())}`;
      }
      
      const response = await fetch(`${this.baseUrl}/advisors/get-assigned-users/${advisorId}?${queryParams}`, {
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
      console.log('Assigned users response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching assigned users:', error);
      throw error;
    }
  }

  static async getDroppedUsers(advisorId: string, page: number = 1, limit: number = 10, searchName: string = ''): Promise<{
    success: boolean;
    total: number;
    page: number;
    limit: number;
    data: any[];
  }> {
    try {
      const authToken = this.getCookie('authToken') || '';
      
      // Build query parameters
      let queryParams = `limit=${limit}&page=${page}`;
      if (searchName && searchName.trim() !== '') {
        queryParams += `&searchName=${encodeURIComponent(searchName.trim())}`;
      }
      
      const response = await fetch(`${this.baseUrl}/advisors/dropped-users/${advisorId}?${queryParams}`, {
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
      console.log('Dropped users API call:', {
        url: `${this.baseUrl}/advisors/dropped-users/${advisorId}?${queryParams}`,
        searchName,
        response: data
      });
      return data;
    } catch (error) {
      console.error('Error fetching dropped users:', error);
      throw error;
    }
  }
}

export default AdvisorService; 