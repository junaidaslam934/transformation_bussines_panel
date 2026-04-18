// User types based on your API response
export interface IUser {
  _id: string;
  cognitoId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "USER" | "ADVISOR";
  accountStatus: "ACTIVE" | "INACTIVE" | "PENDING";
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
  advisorAssignDate: string | null;
  advisorDetails: IAdvisor | null;
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
  trainingLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  restDays: string[];
  isWalkTimer: boolean;
  stepDevice: string | null;
  activity: "SEDENTARY" | "LIGHTLY_ACTIVE" | "MODERATELY_ACTIVE" | "VERY_ACTIVE";
  tasksPreferences: string[];
  fcmTokens: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAdvisor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accountStatus: string;
}

export interface IUserResponse {
  success: boolean;
  data: IUser;
}

export interface IUserError {
  success: false;
  message: string;
  error?: string;
} 