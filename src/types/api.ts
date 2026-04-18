// Base response wrapper
interface IAPIResponse<T> {
  success: boolean;
  data: T;
}

// Based on your API response
interface IUserResponse {
  success: boolean;
  data: IUser;
}

// User Activity Types
export interface IUserActivity {
  _id: string;
  userId: string;
  stepCount: number;
  walkTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUserActivityResponse {
  success: boolean;
  data: IUserActivity;
}

// User Types
export interface IUser {
  _id: string;
  cognitoId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accountStatus: string;
  goal: string | null;
  currentWeight: number | null;
  currentWeightUnit: string | null;
  weightGoal: number | null;
  weightUnit: string | null;
  sizeUnit: string;
  gender: string;
  height: number | null;
  heightUnit: string | null;
  dateOfBirth: string | null;
  advisorId: string | null;
  advisorAssignDate: string | null;
  targetCalories: number | null;
  suggestedCalories: number | null;
  targetProteins: number | null;
  suggestedProteins: number | null;
  tasksPreferences: string[];
  targetCarbs: number | null;
  suggestedCarbs: number | null;
  targetFats: number | null;
  suggestedFats: number | null;
  targetFiber: number | null;
  suggestedFiber: number | null;
  mealsPerDay: number;
  nutritionPlan: string;
  trainingLevel: string;
  restDays: string[];
  isWalkTimer: boolean;
  stepDevice: string | null;
  activity: string;
  fcmTokens: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  advisorDetails: IAdvisorDetails | null;
}

export interface IAdvisorDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  cognitoId: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  assessmentAvailability: any[];
  socialLinks: {
    instagram: string | null;
    facebook: string | null;
    youtube: string | null;
    linkedin: string | null;
    tiktok: string | null;
    other: string | null;
  };
  accountStatus: string;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IUsersResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: IUser[];
}

// Supporting types
interface IAdvisor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add other advisor fields as needed
}

// Challenge Types - For Getting Active Challenge (API Response)
export interface IActiveChallengeData {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  challengeImage: string | null;
  progress: number;
  users: any[];
  winner: any | null;
}

export interface IActiveChallengeResponse {
  success: boolean;
  data: IActiveChallengeData;
}

// Challenge Types - For Creating/Managing Challenges
export interface IActiveChallenge {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  image?: string | null;
  isActive: boolean;
  createdAt: string;
  endedAt?: string;
  progress?: number;
  totalParticipants?: number;
  activeParticipants?: number;
  daysRemaining?: number;
}

export interface ICreateChallengeRequest {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  image?: File | null;
  imageUrl?: string | null;
}

export interface IChallengeResponse {
  success: boolean;
  message?: string;
  data?: IActiveChallenge;
  code?: string;
}

export interface IChallengesListResponse {
  success: boolean;
  data: IActiveChallenge[];
}

export interface IChallengeParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  progress: number;
  rank: number;
  advisor?: IAdvisor;
  subscription?: string;
}

export interface IChallengeParticipantsResponse {
  success: boolean;
  data: IChallengeParticipant[];
  total: number;
  page: number;
  limit: number;
}

// Nutrition Types
export interface INutritionUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface INutrition {
  _id: string;
  createdBy: INutritionUser;
  waterInTake: number;
  nutritionDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface INutritionsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: INutrition[];
}

// Base Foods Types
export interface IPortionOption {
  _id: string;
  portionLabel: string;
  valueInGrams: number;
  valueInOzs: number;
}

export interface IBaseFood {
  _id: string;
  foodName: string;
  foodImage: string | null;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  fiber: number;
  createdBy: INutritionUser;
  isAdminCreated: boolean;
  portionOptions: IPortionOption[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IBaseFoodsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: IBaseFood[];
}

// Meal Plan Items Types
export interface IMealPlanItem {
  _id: string;
  itemType: 'PROTEIN' | 'CARB' | 'VEGGIE';
  itemName: string;
  quantityInGrams: number;
  quantityInOz: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IMealPlanItemsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: IMealPlanItem[];
}

// Base Supplements Types
export interface IBaseSupplement {
  _id: string;
  supplementName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IBaseSupplementsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: IBaseSupplement[];
}

// Workout Types
export interface IWorkout {
  _id: string;
  title: string;
  tagLine: string;
  description: string;
  durationInWeeks: number;
  level: string;
  focusArea: string;
  equipment: string;
  workoutImage: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IWorkoutsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: IWorkout[];
}

export interface IDailyWorkoutDay {
  _id: string;
  workoutId: IWorkout;
  week: number;
  day: string; // e.g., 'MONDAY', 'TUESDAY', etc.
  workoutType: string;
  description: string;
  workoutDescription: string;
  isRestDay: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IDailyWorkoutsResponse {
  success: boolean;
  data: IDailyWorkoutDay[];
}

// Body Metrics Types
export interface IBodyMetricItem {
  type: string; // e.g., 'WEIGHT', 'CHEST', etc.
  value: number;
  unit: string;
}

export interface IDailyBodyMetricsResponse {
  success: boolean;
  data: IBodyMetricItem[];
  code: string;
}

// Custom Workouts Types
export interface ICustomWorkout {
  _id: string;
  userId: string;
  description: string;
  workoutImage: string | null;
  status: string; // e.g., 'PENDING' | 'COMPLETED'
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ICustomWorkoutsResponse {
  success: boolean;
  data: ICustomWorkout[];
}

// User Assets Types (Images/Videos)

export type UserAssetType = 'IMAGE' | 'VIDEO';

export interface IUserAssetItem {
  _id: string;
  userId: string;
  assetType: UserAssetType;
  assetUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IUserAssetGroupByDate {
  _id: string; // date (YYYY-MM-DD)
  assets: IUserAssetItem[];
}

export interface IUserAssetsResponse {
  success: boolean;
  data: IUserAssetGroupByDate[];
  total: number;
  page: number;
  limit: number;
}
