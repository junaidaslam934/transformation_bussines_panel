// Userinfo.ts
export type userData = {
  id: number;
  name: string;
  email: string;
  advisor: string;
  joinDate: string;
  subscription: 'Premium' | 'Standard';
  avatar: string;
}


 export type SortConfig = {
  key: keyof userData | null;
  direction: 'asc' | 'desc';
};
