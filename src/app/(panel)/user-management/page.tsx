
"use client" ;
// import ProgressVideos from '@/components/users/progressVid';
import BodyMetrics from '@/components/users/bodymetrics';
import EditPersonalInfoUser from '@/components/users/editPersonlinfouser';
import UserTableIndex from '@/components/users/index'
import ProgressPictures from '@/components/users/progressPIctures';
import TrackerProgress from '@/components/users/trackerProgress';
import UserActivity from '@/components/users/userActivity';
import UserDetailsInfo from '@/components/users/userDetailsinfo';
import UserNutritionsMacro from '@/components/users/usernutitionsMacro';
import UserNutritions from '@/components/users/usernutitionsMacro';
import UserNutritionFood from '@/components/users/usernutritionfood';
import UserPersonalInfo from '@/components/users/usersPersnalinfo';
import UserWaist from '@/components/users/usermetricgraph';
import UserWeeklySummary from '@/components/users/userweeklySummary';
import ProgressVideos from '@/components/users/progressVid';
import Userweight from '@/components/users/userWeight';
import WeeklyNutritionProgress from '@/components/users/weeklynutrionProgress';
import { User2 } from 'lucide-react';
import React from 'react'
import AuthGuard from '@/components/common/AuthGuard';



export default function UsertablePage() {
  return (
    <AuthGuard>
      <UserTableIndex/>
    </AuthGuard>
  );
}
