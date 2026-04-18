// API Types for the application

export interface IAPIParams {
  method: string;
  endpoint?: string;
  payload?: Record<string, unknown>;
  baseURL?: string;
  ContentType?: string;
  isToken?: boolean;
  headers?: Headers;
  isFormData?: boolean;
  file?: string;
  toJSON?: boolean;
  mode?: string;
  emptyDeleteBody?: boolean;
}

// User Types
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

// Certificate Types
export interface ICertificates {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  completedCertificates: string;
}

export interface ICertificatesReports {
  success: boolean;
  data: {
    usersWithCertificates: ICertificates[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  };
}

// Dashboard Types
export interface IDashboardStats {
  totalUsers: number;
  totalAdvisors: number;
  activeSubscriptions: number;
}

export interface IDashboardStatsResponse {
  success: boolean;
  data: IDashboardStats;
}

export interface ITopAdvisor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountStatus: string;
  profileImage: string | null;
  createdAt: string;
  userCount: number;
  lastAssignedDate: string;
}

export interface ITopAdvisorsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: ITopAdvisor[];
}

export interface IRecentUsersResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: IUser[];
}

export interface IChallengeUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IChallengeWinner {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IChallenge {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  users: IChallengeUser[];
  winner: IChallengeWinner | {};
}

export interface IChallengesResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: IChallenge[];
}

export interface IStats {
  totalUsers: {
    status: string;
    value: number;
  };
  totalDeckCrews: {
    status: string;
    value: number;
  };
  totalEngineers: {
    status: string;
    value: number;
  };
  totalCaptains: {
    status: string;
    value: number;
  };
}

export interface IDashboardData {
  success: boolean;
  data: IStats;
}

// Users Types
export interface IUsers {
  _id: number;
  firstName: string;
  email: string;
  lastName: string;
  shipMemberRole: string;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAllUsersData {
  success: boolean;
  message: string;
  data: {
    users: IUsers[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  };
}

export interface IUpdateUser {
  userId: string;
  payload: {
    shipMemberRole: string;
    accountStatus: string;
  };
}

// Document Types
export interface IDocument {
  _id: string;
  captainLicenseUrl?: string;
  endorsementsUrl?: string;
  searfererIdUrl?: string;
  certificationsUrl?: string;
  trainingRecordsUrl?: string;
  engineeringCertificationsUrl?: string;
  technicalCertificatesUrl?: string;
  status: string;
  userDetails: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    shipMemberRole: string;
  };
}

export interface IDocumentVerification {
  success: boolean;
  message: string;
  data: {
    documents: IDocument[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  };
}

export interface IUpdateDocumentStatus {
  documentId: string;
  payload: {
    status: string;
  };
}

// Report Types
export interface IReports {
  user: {
    _id: string;
    firstName: string;
    email: string;
    lastName: string;
    dateOfBirth: string;
    shipMemberRole: string;
  };
  boat: IBoat | null;
  captain: ICaptain | null;
  timeLogs: ITimelog | null;
}

export interface IBoat {
  _id: string;
  boatName: string;
  officialNumber: number;
  vesselTypes: string;
  flagState: string;
}

export interface ICaptain {
  _id: string;
  captainName: string;
  captainSurname: string;
  cocNumber: number;
}

export interface ITimelog {
  monthlyLogs: [
    {
      month: number;
      logs: [
        {
          certificateType: string;
          logtype: string;
          year: string;
          startDate: string;
          endDate: string;
          days: number;
        }
      ];
      totalDays: number
    }
  ];
  summaryByType: [
    {
      totalDays: number;
      seaDays: number;
      shipyardDays: number;
      standbyDays: number;
    }
  ];
  allYears: string[]
}

// Detailed Logs Types
export interface IDetailedLogs {
  success: boolean;
  message: string;
  data: {
    data: any[]
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
} 

// Announcement Types
export interface IAnnouncementUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

export interface IAnnouncementReaction {
  count: number;
  myReaction: boolean;
}

export interface IAnnouncementReactions {
  like: IAnnouncementReaction;
  heart: IAnnouncementReaction;
  fire: IAnnouncementReaction;
  sad: IAnnouncementReaction;
  laugh: IAnnouncementReaction;
  wow: IAnnouncementReaction;
}

export interface IAnnouncement {
  _id: string;
  text: string;
  imageUrl: string | null;
  videoUrl: string | null;
  videoThumbnail: string | null;
  isAdminCreated: boolean;
  createdAt: string;
  updatedAt: string;
  reactionCounts: IAnnouncementReactions;
  totalReactions: number;
  user: IAnnouncementUser;
}

export interface IAnnouncementsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: IAnnouncement[];
}

export interface ICreateAnnouncementRequest {
  text: string;
  userId: string;
}

export interface ICreateAnnouncementResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    text: string;
    imageUrl: string | null;
    videoUrl: string | null;
    videoThumbnail: string | null;
    isAdminCreated: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  code: string;
} 