# Services Documentation

## AdvisorService

The `AdvisorService` provides methods to interact with the API for managing advisors (users with role "ADVISOR").

### Methods

#### `getAdvisors(page: number, limit: number): Promise<IUsersResponse>`
Fetches paginated advisors from the dedicated advisors endpoint.

#### `getAllAdvisors(): Promise<IUser[]>`
Fetches all advisors from the dedicated advisors endpoint (up to 100 advisors).

#### `getAdvisorById(advisorId: string): Promise<{ success: boolean; data: IUser }>`
Fetches a specific advisor by their ID.

#### `deleteAdvisor(advisorId: string): Promise<void>`
Deletes an advisor by their ID.

#### `createAdvisor(advisorData: Partial<IUser>): Promise<{ success: boolean; data: IUser }>`
Creates a new advisor. Automatically sets the role to "ADVISOR".

#### `updateAdvisor(advisorId: string, advisorData: Partial<IUser>): Promise<{ success: boolean; data: IUser }>`
Updates an existing advisor's information.

#### `checkIfUserIsAdvisor(userId: string): Promise<boolean>`
Checks if a specific user is an advisor by their ID.

#### `getUsersByRole(role: string): Promise<IUser[]>`
Fetches all users with a specific role. For advisors, uses the dedicated advisors endpoint. For other roles, fetches all users and filters on the frontend.

### Usage Example

```typescript
import AdvisorService from '@/services/advisorService';

// Fetch all advisors
const advisors = await AdvisorService.getAllAdvisors();

// Create a new advisor
const newAdvisor = await AdvisorService.createAdvisor({
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  // other fields...
});

// Check if a user is an advisor
const isAdvisor = await AdvisorService.checkIfUserIsAdvisor("user_id_here");

// Get all users with a specific role
const admins = await AdvisorService.getUsersByRole("ADMIN");
const users = await AdvisorService.getUsersByRole("USER");
```

### Error Handling

All methods include proper error handling and will throw errors if:
- The API request fails
- The response format is invalid
- Authentication fails

### Authentication

All requests require an authentication token stored in localStorage as 'authToken'. 