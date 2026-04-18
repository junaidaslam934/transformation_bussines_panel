import { Suspense } from 'react';
import AddWorkout from "@/components/content-managment/addworkout";
import DayWorkout from "@/components/content-managment/dayworkout";
import WorkoutContent from "@/components/content-managment/workout";

export default function UsertablePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DayWorkout/>
    </Suspense>
  );
}
    