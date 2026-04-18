import { signOut } from 'aws-amplify/auth';
import { useUserStore } from '@/store/userStore';
import { errorToast, successToast } from '@/lib/toasts';

export const logout = async () => {
  try {
    // Sign out from AWS Cognito
    await signOut();
    
    // Clear Zustand store
    const { logout: clearStore } = useUserStore.getState();
    clearStore();
    
    // Clear all auth cookies with proper domain and path
    const cookieOptions = [
      'path=/',
      'expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'domain=' + (window.location.hostname === 'localhost' ? '' : window.location.hostname)
    ].join('; ');
    
    document.cookie = `accessToken=; ${cookieOptions}`;
    document.cookie = `idToken=; ${cookieOptions}`;
    document.cookie = `authToken=; ${cookieOptions}`;
    document.cookie = `user=; ${cookieOptions}`;
    
    // Clear localStorage - remove all auth-related items
    localStorage.removeItem('me');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('user');
    
    // Force clear any remaining auth data
    Object.keys(localStorage).forEach(key => {
      if (key.toLowerCase().includes('token') || key.toLowerCase().includes('auth') || key.toLowerCase().includes('user')) {
        localStorage.removeItem(key);
      }
    });
    
    successToast('Logged out successfully');
    
    // Redirect to login page
    window.location.href = '/login';
  } catch (error: any) {
    console.error('Logout error:', error);
    errorToast('Error during logout');
  }
};

export const clearUserData = () => {
  const { clearUser } = useUserStore.getState();
  clearUser();
  
  // Clear all auth cookies with proper domain and path
  const cookieOptions = [
    'path=/',
    'expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'domain=' + (window.location.hostname === 'localhost' ? '' : window.location.hostname)
  ].join('; ');
  
  document.cookie = `accessToken=; ${cookieOptions}`;
  document.cookie = `idToken=; ${cookieOptions}`;
  document.cookie = `authToken=; ${cookieOptions}`;
  document.cookie = `user=; ${cookieOptions}`;
  
  // Clear localStorage - remove all auth-related items
  localStorage.removeItem('me');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('authToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('user');
  
  // Force clear any remaining auth data
  Object.keys(localStorage).forEach(key => {
    if (key.toLowerCase().includes('token') || key.toLowerCase().includes('auth') || key.toLowerCase().includes('user')) {
      localStorage.removeItem(key);
    }
  });
}; 

// Utility functions for authentication

export const setAuthCookie = (token: string, name: string = 'authToken') => {
  if (typeof window !== 'undefined') {
    // Set cookie with secure options
    document.cookie = `${name}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
  }
};

export const removeAuthCookie = (name: string = 'authToken') => {
  if (typeof window !== 'undefined') {
    // Remove cookie by setting expiration to past date
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export const getAuthCookie = (name: string = 'authToken') => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
    return cookie ? cookie.split('=')[1] : null;
  }
  return null;
};

export const clearAllAuthCookies = () => {
  removeAuthCookie('authToken');
  removeAuthCookie('idToken');
  removeAuthCookie('accessToken');
  removeAuthCookie('user');
};

// Specific function to clear accessToken
export const clearAccessToken = () => {
  if (typeof window !== 'undefined') {
    // Clear from cookies
    const cookieOptions = [
      'path=/',
      'expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'domain=' + (window.location.hostname === 'localhost' ? '' : window.location.hostname)
    ].join('; ');
    
    document.cookie = `accessToken=; ${cookieOptions}`;
    
    // Clear from localStorage
    localStorage.removeItem('accessToken');
  }
}; 

// Utility function for immediate authentication checks
export function checkAuthImmediately(): boolean {
  if (typeof window === 'undefined') {
    return false; // Server-side, assume not authenticated
  }

  // Check for auth token in localStorage
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.log('No auth token found in localStorage');
    return false;
  }

  return true;
}

// Utility function to redirect to login
export function redirectToLogin(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

// Utility function to check if user should be redirected
export function shouldRedirectToLogin(): boolean {
  return !checkAuthImmediately();
} 