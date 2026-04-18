import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserInfo {
  // Basic user info
  _id: string;
  cognitoId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "USER" | "ADVISOR";
  accountStatus: "ACTIVE" | "INACTIVE" | "PENDING";
  
  // Fitness/Nutrition data (can be null)
  goal: string | null;
  currentWeight: number | null;
  currentWeightUnit: "KG" | "LB" | null;
  weightGoal: number | null;
  weightUnit: "KG" | "LB" | null;
  sizeUnit: "INCH" | "CM";
  gender: "MALE" | "FEMALE" | "OTHER";
  height: number | null;
  heightUnit: "INCH" | "CM" | null;
  dateOfBirth: string | null;
  
  // Advisor data
  advisorAssignDate: string | null;
  advisorDetails: any | null;
  
  // Nutrition data (can be null)
  targetCalories: number | null;
  suggestedCalories: number | null;
  targetProteins: number | null;
  suggestedProteins: number | null;
  targetCarbs: number | null;
  suggestedCarbs: number | null;
  targetFats: number | null;
  suggestedFats: number | null;
  targetFiber: number | null;
  suggestedFiber: number | null;
  mealsPerDay: number;
  nutritionPlan: "MACRO_TRACKING" | "CALORIE_COUNTING" | "INTUITIVE_EATING";
  
  // Fitness data (can be null)
  trainingLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  restDays: string[];
  isWalkTimer: boolean;
  stepDevice: string | null;
  activity: "SEDENTARY" | "LIGHTLY_ACTIVE" | "MODERATELY_ACTIVE" | "VERY_ACTIVE";
  
  // Technical data
  tasksPreferences: string[];
  fcmTokens: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  idToken: string | null;
  setUser: (user: UserInfo) => void;
  setAuthToken: (token: string) => void;
  logout: () => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      idToken: null,
      setUser: (user: UserInfo) => set({ user, isAuthenticated: true }),
      setAuthToken: (token: string) => set({ idToken: token }),
      logout: () => set({ user: null, isAuthenticated: false, idToken: null }),
      clearUser: () => set({ user: null, isAuthenticated: false, idToken: null }),
    }),
    {
      name: 'user-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        idToken: state.idToken 
      }),
    }
  )
); 