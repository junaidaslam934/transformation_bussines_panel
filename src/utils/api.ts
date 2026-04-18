// Generic API client for making HTTP requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1';

export const api = {
  // GET request
  get: async (endpoint: string, options?: RequestInit) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Invalid JSON response');
      }
    }
    
    if (data && typeof data === 'object') {
      return data;
    } else if (data === null || data === undefined) {
      throw new Error('API returned empty response');
    } else {
      throw new Error('Invalid API response format');
    }
  },

  // POST request
  post: async (endpoint: string, data?: any, options?: RequestInit) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // PUT request
  put: async (endpoint: string, data?: any, options?: RequestInit) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // DELETE request
  delete: async (endpoint: string, options?: RequestInit) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Request with authentication
  authenticated: {
    get: async (endpoint: string, token?: string, options?: RequestInit) => {
      const authToken = token || getAuthToken();
      
      const headers = {
        'Content-Type': 'application/json',
        ...options?.headers,
        Authorization: `Bearer ${authToken}`,
      };
      
      return api.get(endpoint, {
        ...options,
        headers,
      });
    },

    post: async (endpoint: string, data?: any, token?: string, options?: RequestInit) => {
      const authToken = token || getAuthToken();
      return api.post(endpoint, data, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${authToken}`,
        },
      });
    },

    put: async (endpoint: string, data?: any, token?: string, options?: RequestInit) => {
      const authToken = token || getAuthToken();
      return api.put(endpoint, data, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${authToken}`,
        },
      });
    },

    delete: async (endpoint: string, token?: string, options?: RequestInit) => {
      const authToken = token || getAuthToken();
      return api.delete(endpoint, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${authToken}`,
        },
      });
    },
  },
};

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

// Test function to check API connectivity
export const testAPI = async () => {
  try {
    console.log('🧪 Testing API connectivity...');
    const response = await fetch(`${API_BASE_URL}/health`);
    console.log('🏥 Health check response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('❌ API connectivity test failed:', error);
    return false;
  }
};

export default api; 