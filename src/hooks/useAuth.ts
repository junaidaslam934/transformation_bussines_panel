import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export function useAuth(requiredRole?: 'ADMIN' | 'USER' | 'ADVISOR') {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check for auth token in localStorage
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.log('No auth token found in localStorage');
        setIsLoading(false);
        setIsAuthorized(false);
        router.replace('/login');
        return;
      }

      // If we have an auth token but user store is not initialized yet,
      // wait a bit longer before making decisions
      if (!isAuthenticated || !user) {
        console.log('User store not yet initialized, waiting...');
        // Set a longer timeout to allow store to initialize
        const timeoutId = setTimeout(checkAuth, 500);
        return () => clearTimeout(timeoutId);
      }

      // Check if user has required role (if specified)
      if (requiredRole && user.role !== requiredRole) {
        console.log(`User role ${user.role} does not match required role ${requiredRole}`);
        setIsLoading(false);
        setIsAuthorized(false);
        router.replace('/login');
        return;
      }

      // Check if user account is active
      if (user.accountStatus !== 'ACTIVE') {
        console.log('User account is not active');
        setIsLoading(false);
        setIsAuthorized(false);
        router.replace('/login');
        return;
      }

      // User is authenticated and authorized
      setIsLoading(false);
      setIsAuthorized(true);
    };

    // Initial check with a small delay
    const timeoutId = setTimeout(checkAuth, 200);
    
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, requiredRole, router]);

  return { isLoading, isAuthorized, user };
} 