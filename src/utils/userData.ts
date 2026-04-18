// Utility function to filter out null values from user data
export const filterNonNullUserData = (userData: any): any => {
  const filteredData: any = {};
  
  Object.keys(userData).forEach(key => {
    const value = userData[key];
    
    // Keep the value if it's not null and not undefined
    if (value !== null && value !== undefined) {
      // For arrays, keep them even if empty
      if (Array.isArray(value)) {
        filteredData[key] = value;
      } else {
        filteredData[key] = value;
      }
    }
  });
  
  return filteredData;
};

// Function to get user display name
export const getUserDisplayName = (user: any): string => {
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  } else if (user?.firstName) {
    return user.firstName;
  } else if (user?.email) {
    return user.email;
  }
  return 'User';
};

// Function to get user role display
export const getUserRoleDisplay = (user: any): string => {
  return user?.role || 'USER';
}; 