"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

interface WithAuthProps {
  requiredRole?: 'ADMIN' | 'USER' | 'ADVISOR';
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { requiredRole }: WithAuthProps = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isAuthenticated } = useUserStore();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        // Immediate check for auth token
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.log('No auth token found, redirecting to login');
          router.replace('/login');
          return;
        }

        // Check if user is authenticated
        if (!isAuthenticated || !user) {
          console.log('User not authenticated, redirecting to login');
          router.replace('/login');
          return;
        }

        // Check if user has required role
        if (requiredRole && user.role !== requiredRole) {
          console.log(`User role ${user.role} does not match required role ${requiredRole}`);
          router.replace('/login');
          return;
        }

        // Check if user account is active
        if (user.accountStatus !== 'ACTIVE') {
          console.log('User account is not active');
          router.replace('/login');
          return;
        }

        // User is authenticated and authorized
        setIsChecking(false);
      };

      checkAuth();
    }, [isAuthenticated, user, requiredRole, router]);

    // Show loading while checking
    if (isChecking) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      );
    }

    // Render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };
} 