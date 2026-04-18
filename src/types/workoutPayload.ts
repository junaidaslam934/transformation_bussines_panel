export interface AlternateMovementPayload {
  name: string;
  description: string;
  stepByStepGuide: string;
  modificationNotes: string;
}

export interface ExercisePayload {
  name: string;
  description: string;
  sets: number;
  reps: number;
  stepByStepGuide: string;
  alternateMovements: AlternateMovementPayload[];
}

export interface BaseDailyWorkoutPayload {
  workoutId: string;
  week: number;
  day: string; // e.g., 'MONDAY', 'TUESDAY', etc.
  workoutType: string;
  description: string;
  workoutDescription: string;
  isRestDay: boolean;
}

export interface CompleteDailyWorkoutPayload extends BaseDailyWorkoutPayload {
  exercises: ExercisePayload[];
}