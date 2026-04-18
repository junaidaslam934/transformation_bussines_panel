import { Suspense } from 'react';
import AddWorkout from "@/components/content-managment/addworkout";
import WorkoutDetails from "@/components/content-managment/workoutdetails";

export default function UsertablePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkoutDetails/>
    </Suspense>
  );
}
    