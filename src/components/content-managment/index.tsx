"use client";

import React, { useState } from "react";
import Nutrition from "./nutrition";
import AddFood from "./AddFood";
import WorkoutContent from "./workout";
import WorkoutDetails from "./workoutdetails";
import AddWorkout from "./addworkout";
import WorkoutDaysCard from "./workoutdayscard";
import DayWorkout from "./dayworkout";

export default function UserTableIndex() {
  const [tab, setTab] = useState("nutrition");

  return (
   <Nutrition/>
  );
}
