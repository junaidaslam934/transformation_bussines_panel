export type participant = {
  id: number;
  rank: number;
  name: string;
  email: string;
  avatar: string;
  advisor: string;
  subscription: string;
  progress: number;
};

export type ChallengeFormData = {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
};