import { BaseDailyWorkoutPayload, CompleteDailyWorkoutPayload, ExercisePayload } from '@/types/workoutPayload';

export function htmlToPlainText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export function buildBaseDailyWorkoutPayload(params: {
  workoutId: string;
  week: number;
  day: string;
  workoutType: string;
  description: string;
  isRestDay: boolean;
}): BaseDailyWorkoutPayload {
  const plainDescription = htmlToPlainText(params.description);
  return {
    workoutId: params.workoutId,
    week: params.week,
    day: params.day,
    workoutType: params.workoutType.trim(),
    description: plainDescription,
    workoutDescription: plainDescription,
    isRestDay: params.isRestDay,
  };
}

export function buildExercisesPayload(exercises: Array<{
  name: string;
  description: string;
  sets: number;
  reps: number;
  stepByStepGuide: string;
  alternateMovements: Array<{
    name: string;
    description: string;
    stepByStepGuide: string;
    modificationNotes: string;
  }>;
}>): ExercisePayload[] {
  return exercises.map(exercise => ({
    name: exercise.name,
    description: exercise.description,
    sets: exercise.sets && exercise.sets > 0 ? exercise.sets : 1,
    reps: exercise.reps && exercise.reps > 0 ? exercise.reps : 1,
    stepByStepGuide: htmlToPlainText(exercise.stepByStepGuide),
    alternateMovements: exercise.alternateMovements.map(movement => ({
      name: movement.name,
      description: movement.description,
      stepByStepGuide: htmlToPlainText(movement.stepByStepGuide),
      modificationNotes: htmlToPlainText(movement.modificationNotes),
    })),
  }));
}

export function buildCompleteDailyWorkoutPayload(base: BaseDailyWorkoutPayload, exercises: ExercisePayload[]): CompleteDailyWorkoutPayload {
  return {
    ...base,
    exercises,
  };
}