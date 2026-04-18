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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
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

  // PATCH request
  patch: async (endpoint: string, data?: any, options?: RequestInit) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'PATCH',
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
      return api.get(endpoint, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${authToken}`,
        },
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

    patch: async (endpoint: string, data?: any, token?: string, options?: RequestInit) => {
      const authToken = token || getAuthToken();
      return api.patch(endpoint, data, {
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
    return accessTokenCookie.split('=')[1];
  }
  
  // Fallback to localStorage if cookie not found
  const storedUser = localStorage.getItem('user-storage');
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      return userData.state?.idToken || '';
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return '';
    }
  }
  
  return '';
};

export default api; 