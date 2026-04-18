# User Store with Zustand

This implementation uses Zustand to manage user authentication state with localStorage persistence.

## Files Created/Modified

### 1. `src/store/userStore.ts`
- Main Zustand store for user state management
- Automatically persists to localStorage
- Includes user info, authentication status, and auth token

### 2. `src/hooks/useAuth.ts`
- Custom hook for easy access to user state
- Provides helper methods for common user data access

### 3. `src/utils/auth.ts`
- Utility functions for authentication operations
- Includes logout functionality that clears all user data

### 4. Updated Components
- `src/components/auth/Login/SignInForm.tsx` - Now uses Zustand store
- `src/components/common/header.tsx` - Now displays real user data

## Usage Examples

### Basic Usage
```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isLoggedIn, username, email } = useAuth();
  
  if (!isLoggedIn) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>Email: {email}</p>
    </div>
  );
}
```

### Direct Store Access
```tsx
import { useUserStore } from "@/store/userStore";

function MyComponent() {
  const { user, setUser, logout } = useUserStore();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div>
      <p>User ID: {user?.userId}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### Logout Function
```tsx
import { logout } from "@/utils/auth";

function LogoutButton() {
  const handleLogout = async () => {
    await logout(); // This will sign out from Cognito and clear all data
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

## Store Structure

```typescript
interface UserState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  idToken: string | null;
  setUser: (user: UserInfo) => void;
  setAuthToken: (token: string) => void;
  logout: () => void;
  clearUser: () => void;
}

interface UserInfo {
  userId: string;
  username: string;
  email: string;
  email_verified: string;
  status: string;
  enabled: string;
  userSub?: string;
}
```

## Features

- ✅ Automatic localStorage persistence
- ✅ TypeScript support
- ✅ AWS Cognito integration
- ✅ Cookie management for auth tokens
- ✅ Clean logout functionality
- ✅ Easy-to-use hooks
- ✅ Real-time state updates

## Benefits over direct localStorage

1. **Type Safety**: Full TypeScript support
2. **Reactivity**: Components automatically re-render when state changes
3. **Centralized State**: All user data in one place
4. **Middleware Support**: Built-in persistence with Zustand
5. **Better Performance**: Only re-renders components that use the store
6. **Developer Experience**: Better debugging and state inspection 