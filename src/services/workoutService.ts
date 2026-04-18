import { IWorkoutsResponse } from '@/types/api';
import { IDailyWorkoutsResponse } from '@/types/api';

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

export class WorkoutService {
  /**
   * Get all workouts with pagination and filtering
   * @param level - Workout level (BEGINNER, INTERMEDIATE, EXPERT)
   * @param limit - Items per page (default: 10)
   * @param searchName - Optional search term
   * @returns Promise<IWorkoutsResponse>
   */
  static async getWorkouts(
    level: string = 'BEGINNER', 
    limit: number = 10, 
    searchName?: string
  ): Promise<IWorkoutsResponse> {
    try {
      const authToken = getAuthToken();
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/workouts?level=${level}&limit=${limit}`;
      
      if (searchName && searchName.trim()) {
        url += `&searchName=${encodeURIComponent(searchName.trim())}`;
      }
      
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
      console.error('Error fetching workouts:', error);
      throw new Error('Failed to fetch workouts');
    }
  }

  /**
   * Get workout by ID
   * @param workoutId - The workout ID
   * @returns Promise<IWorkoutsResponse>
   */
  static async getWorkoutById(workoutId: string): Promise<IWorkoutsResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/workouts/${workoutId}`;
      
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
      console.error('Error fetching workout:', error);
      throw new Error('Failed to fetch workout');
    }
  }

  /**
   * Create a new workout
   * @param workoutData - The workout data
   * @returns Promise<any>
   */
  static async createWorkout(workoutData: {
    title: string;
    tagLine: string;
    description: string;
    durationInWeeks: number;
    level: string;
    focusArea: string;
    equipment: string;
    workoutImage?: string | null;
  }): Promise<any> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/workouts`;
      
      console.log('Creating workout with data:', workoutData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(workoutData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Workout creation failed:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Workout creation response:', result);
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error creating workout:', error);
      throw new Error('Failed to create workout');
    }
  }

  /**
   * Update an existing workout
   * @param workoutId - The workout ID
   * @param workoutData - The updated workout data
   * @returns Promise<IWorkoutsResponse>
   */
  static async updateWorkout(workoutId: string, workoutData: {
    title?: string;
    tagLine?: string;
    description?: string;
    durationInWeeks?: number;
    
    level?: string;
    focusArea?: string;
    equipment?: string;
  workoutImage?: string | null;
  }): Promise<IWorkoutsResponse> {
          try {
        const authToken = getAuthToken();
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/workouts/${workoutId}`;
        
        console.log('Updating workout:', { workoutId, workoutData });
        console.log('Update URL:', url);
        console.log('Request body:', JSON.stringify(workoutData));
        
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(workoutData),
        });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Workout update failed:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Workout update response:', result);
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error updating workout:', error);
      throw new Error('Failed to update workout');
    }
  }

  /**
   * Delete a workout
   * @param workoutId - The workout ID
   * @returns Promise<IWorkoutsResponse>
   */
  static async deleteWorkout(workoutId: string): Promise<IWorkoutsResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/workouts/${workoutId}`;
      
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
      console.error('Error deleting workout:', error);
      throw new Error('Failed to delete workout');
    }
  }

  /**
   * Get presigned URL for image upload
   * @param workoutId - The workout ID
   * @param fileName - The file name
   * @param fileType - The file type
   * @returns Promise<any>
   */
  static async getPresignedUrl(workoutId: string, fileName: string, fileType: string): Promise<any> {
    try {
      const authToken = getAuthToken();
      // Try different URL patterns for the presigned URL endpoint
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/workouts/${workoutId}/generate-presigned-url`;
      
 
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          fileName,
          fileType
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Presigned URL request failed:', response.status, errorText);
        
        // Try alternative URL pattern if first one fails
        const alternativeUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/workouts/generate-presigned-url/${workoutId}`;
        console.log('Trying alternative URL:', alternativeUrl);
        
        console.log('Alternative request body being sent:', JSON.stringify({ fileName, fileType }));
        console.log('🔍 DEBUG: Alternative fileName length:', fileName.length);
        console.log('🔍 DEBUG: Alternative fileName contains extension?', /\.\w+$/.test(fileName));
        const alternativeResponse = await fetch(alternativeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            fileName,
            fileType
          }),
        });
        
        if (!alternativeResponse.ok) {
          const alternativeErrorText = await alternativeResponse.text();
          console.error('Alternative presigned URL request also failed:', alternativeResponse.status, alternativeErrorText);
          throw new Error(`HTTP error! status: ${alternativeResponse.status}`);
        }
        
        const alternativeResult = await alternativeResponse.json();
        console.log('Alternative presigned URL response:', alternativeResult);
        
        if (alternativeResult && alternativeResult.success) {
          return alternativeResult;
        } else {
          throw new Error('Invalid response structure from API');
        }
      }
      
      const result = await response.json();
      console.log('Presigned URL response:', result);
      
      if (result && result.success) {
        return result;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error getting presigned URL:', error);
      throw new Error('Failed to get presigned URL');
    }
  }

  /**
   * Upload image and get image ID
   * @param workoutId - The workout ID
   * @param file - The image file
   * @returns Promise<any>
   */
  static async uploadImage(workoutId: string, file: File): Promise<any> {
    console.log(file,"selectedImage")
    try {
      const authToken = localStorage.getItem('accessToken');
      // Clean filename by removing extension
      let fileName = file.name;
      const lastDotIndex = fileName.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        fileName = fileName.substring(0, lastDotIndex);
      }
      const fileType = file.type.split('/')[1];
      
      console.log('Original filename:', file.name);
      console.log('Clean filename (no extension):', fileName);
      console.log('File type:', fileType);
      
      console.log('Starting image upload process:', { 
        workoutId, 
        fileName, 
        fileType, 
        fileSize: file.size,
        mimeType: file.type 
      });
      
      // Step 1: Get presigned URL using WorkoutService
      console.log('Step 1: Getting presigned URL...');
      const presignedResponse = await this.getPresignedUrl(workoutId, fileName, fileType);
      
      if (!presignedResponse.success) {
        throw new Error('Failed to get presigned URL');
      }
      
      console.log('✅ Presigned URLs received:', presignedResponse.data);
      console.log('PUT URL:', presignedResponse.data.putUrl);
      console.log('GET URL:', presignedResponse.data.getUrl);
      
      // Step 2: Upload to S3 using PUT URL
      console.log('Step 2: Uploading to S3 using PUT URL...');
      console.log('PUT URL being used:', presignedResponse.data.putUrl);
      
             // Use XMLHttpRequest for better CORS handling with S3
       const uploadResponse = await new Promise<{ok: boolean, status: number, headers: string}>((resolve, reject) => {
         const xhr = new XMLHttpRequest();
         
         xhr.open('PUT', presignedResponse.data.putUrl, true);
         // Use just the extension to match the presigned URL signature
         const contentType = file.type.split('/')[1]; // 'jpeg' instead of 'image/jpeg'
         console.log('Setting Content-Type header to:', contentType);
         xhr.setRequestHeader('Content-Type', contentType);
         
         xhr.onload = function() {
           if (xhr.status >= 200 && xhr.status < 300) {
             resolve({
               ok: true,
               status: xhr.status,
               headers: xhr.getAllResponseHeaders()
             });
           } else {
             reject(new Error(`Upload failed with status: ${xhr.status}`));
           }
         };
         
         xhr.onerror = function() {
           reject(new Error('Upload failed'));
         };
         
         xhr.send(file);
       });
      
      console.log('S3 upload response status:', uploadResponse.status);
      console.log('S3 upload response headers:', uploadResponse.headers);
      
      if (!uploadResponse.ok) {
        console.error('❌ S3 upload failed:', uploadResponse.status);
        throw new Error(`Failed to upload image to S3: ${uploadResponse.status}`);
      }
      
      console.log('✅ Image uploaded successfully to S3');
      
      // Step 3: Update workout with GET URL using WorkoutService
      console.log('Step 3: Updating workout with GET URL...');
      
      // URL encode the getUrl to handle spaces in filenames
      let encodedGetUrl = presignedResponse.data.getUrl;
      try {
        // Split the URL to get the filename part
        const urlParts = presignedResponse.data.getUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        // URL encode the filename to handle spaces and special characters
        const encodedFilename = encodeURIComponent(filename);
        urlParts[urlParts.length - 1] = encodedFilename;
        encodedGetUrl = urlParts.join('/');
        
        console.log('Original getUrl:', presignedResponse.data.getUrl);
        console.log('Encoded getUrl:', encodedGetUrl);
      } catch (error) {
        console.warn('Could not encode URL, using original:', error);
        encodedGetUrl = presignedResponse.data.getUrl;
      }
      
      const updateResponse = await this.updateWorkout(workoutId, {
        workoutImage: encodedGetUrl
      });
      
      if (!updateResponse.success) {
        console.error('❌ Failed to update workout with image URL:', updateResponse);
        throw new Error('Failed to update workout with image URL');
      }
      
      console.log('✅ Workout updated with image URL successfully:', updateResponse);
      
      // Step 4: Skip verification as GET URLs may have signature issues
      console.log('Step 4: Skipping image verification (GET URLs may have signature issues)');
      console.log('✅ Image upload process completed successfully');
      
      return {
        success: true,
        imageUrl: presignedResponse.data.getUrl,
        workoutId: workoutId,
        putUrl: presignedResponse.data.putUrl,
        getUrl: presignedResponse.data.getUrl
      };
      
    } catch (error: any) {
      console.error('❌ Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Get daily workouts for a given workoutId
   * @param workoutId - The workout ID
   * @returns Promise<IDailyWorkoutsResponse>
   */
  static async getDailyWorkouts(workoutId: string): Promise<IDailyWorkoutsResponse> {
    try {
      const authToken = getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      const url = `${baseUrl}/daily-workouts?workoutId=${workoutId}`;
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
      console.error('Error fetching daily workouts:', error);
      throw new Error('Failed to fetch daily workouts');
    }
  }

  /**
   * Create a daily workout (with exercises)
   * @param dailyWorkout - The daily workout object
   * @returns Promise<any>
   */
  static async createDailyWorkout(dailyWorkout: any): Promise<any> {
    try {
      const authToken = getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      const url = `${baseUrl}/daily-workouts`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(dailyWorkout),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error creating daily workout:', error);
      throw new Error('Failed to create daily workout');
    }
  }

  /**
   * Create a complete daily workout with exercises
   * @param dailyWorkout - The daily workout object with exercises
   * @returns Promise<any>
   */
  static async createCompleteDailyWorkout(dailyWorkout: any): Promise<any> {
    try {
      const authToken = getAuthToken();
      let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      // Remove trailing slash if present
      baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const url = `${baseUrl}/daily-workouts/complete`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(dailyWorkout),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error creating complete daily workout:', error);
      throw new Error('Failed to create complete daily workout');
    }
  }

  /**
   * Update a complete daily workout with exercises
   * @param dailyWorkoutId - The daily workout ID
   * @param dailyWorkout - The daily workout object with exercises
   * @returns Promise<any>
   */
  static async updateCompleteDailyWorkout(dailyWorkoutId: string, dailyWorkout: any): Promise<any> {
    try {
      const authToken = getAuthToken();
      let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      // Remove trailing slash if present
      baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const url = `${baseUrl}/daily-workouts/complete`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(dailyWorkout),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error updating complete daily workout:', error);
      throw new Error('Failed to update complete daily workout');
    }
  }

  /**
   * Update an existing daily workout
   * @param dailyWorkoutId - The daily workout ID
   * @param dailyWorkout - The daily workout object
   * @returns Promise<any>
   */
  static async updateDailyWorkout(dailyWorkoutId: string, dailyWorkout: any): Promise<any> {
    try {
      const authToken = getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      const url = `${baseUrl}/daily-workouts/${dailyWorkoutId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(dailyWorkout),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error updating daily workout:', error);
      throw new Error('Failed to update daily workout');
    }
  }

  // === Daily workout exercises media helpers ===
  static async getExercisePresignedUrl(
    exerciseId: string,
    fileName: string,
    fileType: string,
    assetType: 'TUTORIAL_VIDEO' | 'VIDEO_THUMBNAIL' | 'VIDEO' = 'TUTORIAL_VIDEO'
  ): Promise<{ success: boolean; data: { putUrl: string; getUrl: string } }> {
    try {
      const authToken = getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      const url = `${baseUrl}/daily-workout-exercises/generate-presigned-url/${exerciseId}`;
      const normalizedType = assetType === 'VIDEO' ? 'TUTORIAL_VIDEO' : assetType;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ fileName, fileType, assetType: normalizedType }),
      });
      if (!res.ok) {
        let msg = `HTTP error! status: ${res.status}`;
        try {
          const b = await res.json();
          msg = b?.message || b?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      return await res.json();
    } catch (e: any) {
      console.error('Error getting exercise presigned URL:', e);
      throw new Error(e?.message || 'Failed to get exercise presigned URL');
    }
  }

  static async uploadExerciseMedia(putUrl: string, file: File): Promise<void> {
    try {
      let ctFromUrl: string | null = null;
      try {
        const u = new URL(putUrl);
        const q = u.searchParams.get('Content-Type');
        if (q) ctFromUrl = q;
      } catch {}

      const headers: Record<string, string> = {};
      if (ctFromUrl) headers['Content-Type'] = ctFromUrl;
      else if (file?.type) headers['Content-Type'] = file.type;

      const res = await fetch(putUrl, { method: 'PUT', headers, body: file });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`S3 upload failed: ${res.status} ${txt}`);
      }
    } catch (e: any) {
      console.error('Error uploading exercise media:', e);
      throw new Error(e?.message || 'Failed to upload exercise media');
    }
  }

  static async createExercise(dailyWorkoutId: string, exercise: any): Promise<any> {
    try {
      const authToken = getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      const url = `${baseUrl}/daily-workout-exercises`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ dailyWorkoutId, ...exercise }),
      });
      if (!res.ok) {
        let msg = `HTTP error! status: ${res.status}`;
        try {
          const b = await res.json();
          msg = b?.message || b?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      return await res.json();
    } catch (e: any) {
      console.error('Error creating exercise:', e);
      throw new Error(e?.message || 'Failed to create exercise');
    }
  }

  static async updateExercise(exerciseId: string, payload: any): Promise<any> {
    try {
      const authToken = getAuthToken();
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';
      const url = `${baseUrl}/daily-workout-exercises/${exerciseId}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = `HTTP error! status: ${res.status}`;
        try {
          const b = await res.json();
          msg = b?.message || b?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      return await res.json();
    } catch (e: any) {
      console.error('Error updating exercise:', e);
      throw new Error(e?.message || 'Failed to update exercise');
    }
  }
}

export default WorkoutService; 