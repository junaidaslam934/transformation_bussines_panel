"use client";

import UserNutritionsMacro from "@/components/users/usernutitionsMacro";

interface UserMacroPageProps {
  params: { id: string };
}

export default function UserMacroPage({ params }: UserMacroPageProps) {
  return <UserNutritionsMacro userId={params.id} />;
}


