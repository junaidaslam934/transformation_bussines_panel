"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

interface SimpleAuthCheckProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER' | 'ADVISOR';
}

export default function SimpleAuthCheck({ children, requiredRole }: SimpleAuthCheckProps) {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only check after a reasonable delay to allow store initialization
    const timeoutId = setTimeout(() => {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        console.log('No auth token found, redirecting to login');
        router.replace('/login');
        return;
      }

      // If we have a token but user is not loaded yet, wait a bit more
      if (!isAuthenticated || !user) {
        console.log('User not loaded yet, waiting...');
        return;
      }

      // Check role if required
      if (requiredRole && user.role !== requiredRole) {
        console.log(`User role ${user.role} does not match required role ${requiredRole}`);
        router.replace('/login');
        return;
      }

      // Check account status
      if (user.accountStatus !== 'ACTIVE') {
        console.log('User account is not active');
        router.replace('/login');
        return;
      }

      setHasChecked(true);
    }, 1000); // Wait 1 second before checking

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, requiredRole, router]);

  // Show loading only if we haven't checked yet and we have a token
  if (!hasChecked && localStorage.getItem('authToken')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 