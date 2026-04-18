import { Suspense } from 'react';
import AddWorkout from "@/components/content-managment/addworkout";
import WorkoutDaysCard from "@/components/content-managment/workoutdayscard";

export default function UsertablePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkoutDaysCard/>
    </Suspense>
  );
}
    