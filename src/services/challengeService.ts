import api from '@/utils/api';
import { 
  IActiveChallenge, 
  IActiveChallengeData,
  IActiveChallengeResponse,
  ICreateChallengeRequest, 
  IChallengeResponse, 
  IChallengesListResponse,
  IChallengeParticipantsResponse 
} from '@/types/api';

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

export class ChallengeService {
  /**
   * Get current active challenge
   * @returns Promise<IActiveChallengeResponse>
   */
  static async getActiveChallenge(): Promise<IActiveChallengeResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/challenge/active-challenge/`;
      
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
    } catch (error) {
      console.error('Error fetching active challenge:', error);
      throw new Error('Failed to fetch active challenge');
    }
  }

  /**
   * Create a new challenge (with optional image upload)
   * @param challengeData - The challenge data (title, startDate, endDate, description)
   * @param imageFile - Optional image file to upload
   * @returns Promise<IChallengeResponse>
   */
  static async createChallenge(
    challengeData: Omit<ICreateChallengeRequest, 'image' | 'imageUrl'>, 
    imageFile?: File
  ): Promise<IChallengeResponse> {
    console.log("Service - createChallenge method called with updated code");
    console.log("Service - Image file parameter:", imageFile);
    try {
      // Prepare the request payload
      const requestPayload = {
        title: challengeData.title,
        startDate: challengeData.startDate,
        endDate: challengeData.endDate,
        description: challengeData.description,
      };

      console.log("Service - Creating challenge with data:", requestPayload);
      console.log("Service - Image file received:", imageFile);
      console.log("Service - Image file details:", imageFile ? {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      } : "No file");

      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/challenge`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestPayload),
      });
      console.log("hi")
      
      const result = await response.json();
      console.log("Service - Challenge creation response:", result);
      console.log("Service - Challenge creation response data:", result.success);
      
      if (result && result.success) {
        // If image file is provided, upload it using the challenge ID
        console.log("Service - Full result data:", result.data);
        console.log("Service - Result data keys:", Object.keys(result.data || {}));
        console.log("Service - Checking for _id:", result.data?._id);
        console.log("Service - Checking for id:", result.data?.id);
        
        // Try to get the challenge ID from multiple possible locations
        const challengeId = result.data?._id || result.data?.id || result.data?.challengeId;
        console.log("Service - Extracted challenge ID:", challengeId);
        
        if (imageFile && challengeId) {
          console.log("Service - Starting image upload for challenge ID:", challengeId);
          
          try {
            const uploadResult = await this.uploadChallengeImage(challengeId, imageFile);
            console.log("Service - Image upload completed successfully:", uploadResult);
          } catch (imageError) {
            console.error('Service - Error uploading challenge image:', imageError);
            // Continue with challenge creation even if image upload fails
          }
        } else {
          console.log("Service - No image file or challenge ID, skipping image upload");
        }
        
        return result;
      } else {
        // Handle error response with proper message extraction
        const errorMessage = result?.message || 'Failed to create challenge';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error creating challenge:', error);
      
      // If it's already an Error object with a message, re-throw it
      if (error instanceof Error) {
        throw error;
      }
      
      // Handle specific error cases
      if (error.message?.includes('409') || error.message?.includes('activeChallengeExists')) {
        throw new Error('An active challenge already exists. Please end the current challenge before creating a new one.');
      }
      
      throw new Error('Failed to create challenge');
    }
  }

    /**
   * Get presigned URL for challenge image upload
   * @param challengeId - The challenge ID
   * @param file - The file to upload
   * @returns Promise<{ putUrl: string; getUrl: string }>
   */
  static async getChallengeUploadUrl(
    challengeId: string,
    file: File
  ): Promise<{ putUrl: string; getUrl: string }> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/challenge/generate-presigned-url/${challengeId}`;
      
      console.log('🔗 Getting presigned URLs from:', url);
      console.log('📁 File details:', { name: file.name, type: file.type });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Presigned URL API error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

             const result = await response.json();
       console.log('📋 Presigned URL API response:', JSON.stringify(result, null, 2));
       
       if (result && result.success && result.data) {
         const { putUrl, getUrl } = result.data;
         
         console.log('🔗 PUT URL:', putUrl);
         console.log('🔗 GET URL:', getUrl);
         
         // Validate URLs
         if (!putUrl || !getUrl) {
           console.error('❌ Missing URLs:', { putUrl, getUrl });
           throw new Error('Missing putUrl or getUrl in response');
         }
         
         // Ensure URLs are properly formatted
         if (!putUrl.startsWith('http') || !getUrl.startsWith('http')) {
           console.error('❌ Invalid URL format:', { putUrl, getUrl });
           throw new Error('Invalid URL format received from API');
         }
         
         // Additional validation for GET URL
         if (getUrl.includes('{{API_BASE_URL_TEST}}') || getUrl.includes('undefined')) {
           console.error('❌ Malformed GET URL:', getUrl);
           throw new Error('Malformed GET URL received from API');
         }
         
         // Validate that the GET URL contains the challenge ID
         if (!getUrl.includes(challengeId)) {
           console.error('❌ GET URL does not contain challenge ID:', { challengeId, getUrl });
           throw new Error('GET URL does not contain the correct challenge ID');
         }
         
         // Validate URL structure
         const expectedUrlPattern = `https://transformation-storage-bucket.s3.amazonaws.com/challenges/${challengeId}/`;
         if (!getUrl.startsWith(expectedUrlPattern)) {
           console.error('❌ GET URL does not match expected pattern:', { 
             expected: expectedUrlPattern,
             actual: getUrl 
           });
           throw new Error('GET URL does not match expected S3 bucket pattern');
         }
         
         console.log('✅ Valid presigned URLs received');
         console.log('✅ GET URL contains correct challenge ID:', challengeId);
         return { putUrl, getUrl };
       } else {
         console.error('❌ Invalid response structure:', result);
         throw new Error('Invalid response from upload URL API');
       }
    } catch (error) {
      console.error('❌ Error getting upload URL:', error);
      throw new Error('Failed to get upload URL');
    }
  }

  /**
   * Upload file to S3 using presigned URL
   * @param putUrl - The presigned PUT URL
   * @param file - The file to upload
   * @returns Promise<boolean>
   */
  static async uploadToS3(putUrl: string, file: File): Promise<boolean> {
    try {
      const response = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ File uploaded to S3 successfully');
      return true;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  /**
   * Update challenge with image URL
   * @param challengeId - The challenge ID
   * @param imageUrl - The image URL to set
   * @returns Promise<boolean>
   */
  static async updateChallengeImage(
    challengeId: string,
    imageUrl: string
  ): Promise<boolean> {
    try {
             // Validate the image URL
       if (!imageUrl || !imageUrl.startsWith('http')) {
         throw new Error('Invalid image URL format');
       }
       
       // Additional URL validation
       try {
         new URL(imageUrl);
       } catch (error) {
         console.error('❌ Invalid URL format:', imageUrl);
         throw new Error('Invalid URL format');
       }
      
      const authToken = getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      const url = `${baseUrl}/challenge/${challengeId}`;
      
             console.log('🔄 Updating challenge with image URL:', imageUrl);
       console.log('🔗 Update URL:', url);
       console.log('🔑 Auth token:', authToken ? 'Present' : 'Missing');
       console.log('🆔 Challenge ID:', challengeId);
       
       // Validate that the image URL contains the correct challenge ID
       if (!imageUrl.includes(challengeId)) {
         console.error('❌ Image URL does not contain challenge ID:', { challengeId, imageUrl });
         throw new Error('Image URL does not contain the correct challenge ID');
       }
       
       const requestBody = {
         challengeImage: imageUrl
       };
       
       console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update challenge API error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📋 Update challenge API response:', result);
      
      if (result && result.success) {
        console.log('✅ Challenge image updated successfully');
        return true;
      } else {
        console.error('❌ Invalid response structure:', result);
        throw new Error('Invalid response from update API');
      }
    } catch (error) {
      console.error('❌ Error updating challenge image:', error);
      throw new Error('Failed to update challenge image');
    }
  }

  /**
   * Upload image for a challenge (simplified version following announcement pattern)
   * @param challengeId - The challenge ID
   * @param imageFile - The image file to upload
   * @returns Promise<any>
   */
  static async uploadChallengeImage(challengeId: string, imageFile: File): Promise<any> {
    try {
      console.log('🚀 Starting challenge image upload for:', challengeId);
      
      // 1. Get presigned URLs
      console.log('📁 Getting upload URL for file:', imageFile.name);
      const { putUrl, getUrl } = await this.getChallengeUploadUrl(challengeId, imageFile);
      console.log('✅ Got upload URLs:', { putUrl: putUrl.substring(0, 50) + '...', getUrl });
      
      // 2. Upload to S3
      console.log('📤 Uploading to S3...');
      await this.uploadToS3(putUrl, imageFile);
      console.log('✅ S3 upload successful');
      
      // 3. Update challenge with the image URL
      console.log('🔄 Updating challenge with image URL:', getUrl);
      
      // URL encode the GET URL to handle spaces and special characters
      const encodedImageUrl = encodeURI(getUrl);
      console.log('🔄 Using encoded image URL:', encodedImageUrl);
      
      await this.updateChallengeImage(challengeId, encodedImageUrl);
      console.log('✅ Challenge updated with image URL');
      
      return {
        success: true,
        imageUrl: getUrl,
        challengeId: challengeId
      };
      
    } catch (error) {
      console.error('❌ Error uploading challenge image:', error);
      throw error;
    }
  }

  /**
   * Complete challenge image upload flow (similar to advisor pattern)
   * @param challengeId - The challenge ID
   * @param imageFile - The image file to upload
   * @returns Promise<{ success: boolean; data: any }>
   */
  static async uploadChallengeProfileImage(challengeId: string, imageFile: File): Promise<{ success: boolean; data: any }> {
    try {
      console.log('🔧 === UPLOAD CHALLENGE PROFILE IMAGE CALLED ===');
      console.log('🔧 Starting challenge profile image upload:', { challengeId, fileName: imageFile.name });
      
      // Step 1: Generate presigned URL
      const fileExtension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `challenge_${Date.now()}.${fileExtension}`;
      
      console.log('🔧 Generating presigned URL for:', { challengeId, fileName, fileExtension });
      
      const { putUrl, getUrl } = await this.getChallengeUploadUrl(challengeId, imageFile);
      
      if (!putUrl || !getUrl) {
        console.error('🔧 Failed to get presigned URL:', { putUrl, getUrl });
        throw new Error('Failed to generate upload URL for image');
      }
      
      console.log('🔧 Presigned URL received:', putUrl);
      console.log('🔧 Get URL for database:', getUrl);
      
      // Step 2: Upload image to S3 using putUrl
      console.log('🔧 Uploading image to S3...');
      await this.uploadToS3(putUrl, imageFile);
      console.log('🔧 Image uploaded to S3 successfully');
      
      // Step 3: Update challenge profile with the getUrl in database
      console.log('🔧 Updating challenge profile with image URL:', getUrl);
      const updateResponse = await this.updateChallengeImage(challengeId, getUrl);
      
      console.log('🔧 Profile update response:', updateResponse);
      return { success: true, data: { imageUrl: getUrl, challengeId } };
      
    } catch (error) {
      console.error('Error in uploadChallengeProfileImage:', error);
      throw error;
    }
  }


  /** 
   * End the current active challenge
   * @param challengeId - The ID of the challenge to end
   * @returns Promise<IChallengeResponse>
   */
  static async endActiveChallenge(challengeId: string): Promise<IChallengeResponse> {
    try {
      const authToken = getAuthToken();
      const baseUrl = 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      const url = `${baseUrl}/challenge/${challengeId}`;
      
      console.log('End challenge URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        // Handle error response with proper message extraction
        const errorMessage = result?.message || 'Failed to end challenge';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error ending challenge:', error);
      
      // If it's already an Error object with a message, re-throw it
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to end challenge');
    }
  }

  /**
   * Get all challenges (active and inactive)
   * @returns Promise<IChallengesListResponse>
   */
  static async getAllChallenges(): Promise<IChallengesListResponse> {
    try {
      const response = await api.authenticated.get('/challenge/previous-challenges');
      
      if (response && response.success) {
        return response;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      console.error('Error fetching all challenges:', error);
      throw new Error('Failed to fetch challenges');
    }
  }



  /**
   * Delete a challenge
   * @param challengeId - The challenge ID
   * @returns Promise<IChallengeResponse>
   */
  static async deleteChallenge(challengeId: string): Promise<IChallengeResponse> {
    try {
      const response = await api.authenticated.delete(`/challenge/${challengeId}`);
      
      if (response && response.success) {
        return response;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      console.error('Error deleting challenge:', error);
      throw new Error('Failed to delete challenge');
    }
  }

  /**
   * Get challenge participants
   * @param challengeId - The challenge ID
   * @returns Promise<IChallengeParticipantsResponse>
   */
  static async getChallengeParticipants(challengeId: string): Promise<IChallengeParticipantsResponse> {
    try {
      const response = await api.authenticated.get(`/challenge/${challengeId}/participants`);
      
      if (response && response.success) {
        return response;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      console.error('Error fetching challenge participants:', error);
      throw new Error('Failed to fetch challenge participants');
    }
  }

  /**
   * Add participant to challenge
   * @param challengeId - The challenge ID
   * @param userId - The user ID to add
   * @returns Promise<IChallengeResponse>
   */
  static async addParticipantToChallenge(challengeId: string, userId: string): Promise<IChallengeResponse> {
    try {
      const response = await api.authenticated.post(`/challenge/${challengeId}/participants`, { userId });
      
      if (response && response.success) {
        return response;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      console.error('Error adding participant to challenge:', error);
      throw new Error('Failed to add participant to challenge');
    }
  }

  /**
   * Remove participant from challenge
   * @param challengeId - The challenge ID
   * @param userId - The user ID to remove
   * @returns Promise<IChallengeResponse>
   */
  static async removeParticipantFromChallenge(challengeId: string, userId: string): Promise<IChallengeResponse> {
    try {
      const response = await api.authenticated.delete(`/challenge/${challengeId}/participants/${userId}`);
      
      if (response && response.success) {
        return response;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      console.error('Error removing participant from challenge:', error);
      throw new Error('Failed to remove participant from challenge');
    }
  }

  /**
   * Declare a winner for a challenge
   * @param winnerId - The ID of the user to declare as winner
   * @param challengeId - The ID of the challenge
   * @returns Promise<IChallengeResponse>
   */
  static async declareWinner(winnerId: string, challengeId: string): Promise<IChallengeResponse> {
    try {
      const authToken = getAuthToken();
      const baseUrl = 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      const url = `${baseUrl}/challenge/set-winner`;
      
      console.log('Environment variables:', {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_API_BASE_URL_TEST: process.env.NEXT_PUBLIC_API_BASE_URL_TEST
      });
      console.log('Declare winner URL:', url);
      console.log('Request payload:', { winnerId, challengeId });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          winnerId,
          challengeId
        }),
      });
      
      const result = await response.json();
      
      if (result && result.success) {
        return result;
      } else {
        // Handle error response with proper message extraction
        const errorMessage = result?.message || 'Failed to declare winner';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error declaring winner:', error);
      
      // If it's already an Error object with a message, re-throw it
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to declare winner');
    }
  }

  /**
   * Update an existing challenge
   * @param challengeId - The ID of the challenge to update
   * @param challengeData - The updated challenge data
   * @param imageFile - Optional image file to upload
   * @returns Promise<IChallengeResponse>
   */
  static async updateChallenge(
    challengeId: string, 
    challengeData: Partial<Omit<ICreateChallengeRequest, 'image' | 'imageUrl'>>,
    imageFile?: File
  ): Promise<IChallengeResponse> {
    try {
      const authToken = getAuthToken();
      const baseUrl = 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      const url = `${baseUrl}/challenge/${challengeId}`;
      
      console.log('Update challenge URL:', url);
      console.log('Update challenge data:', challengeData);
      console.log('Image file:', imageFile);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(challengeData),
      });
      
      const result = await response.json();
      
      if (result && result.success) {
        // If image file is provided, upload it
        if (imageFile) {
          try {
            const uploadResult = await this.uploadChallengeImage(challengeId, imageFile);
            console.log('Challenge image updated successfully:', uploadResult);
          } catch (imageError) {
            console.error('Error uploading challenge image:', imageError);
            // Continue with challenge update even if image upload fails
          }
        }
        
        return result;
      } else {
        // Handle error response with proper message extraction
        const errorMessage = result?.message || 'Failed to update challenge';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error updating challenge:', error);
      
      // If it's already an Error object with a message, re-throw it
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to update challenge');
    }
  }
}

export default ChallengeService; 