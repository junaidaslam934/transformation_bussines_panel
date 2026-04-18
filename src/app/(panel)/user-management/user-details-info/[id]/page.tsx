"use client";

import UserDetailsInfo from "@/components/users/userDetailsinfo";

interface UserDetailsPageProps {
  params: {
    id: string;
  };
}

export default function UserDetailsPage({ params }: UserDetailsPageProps) {
  return <UserDetailsInfo userId={params.id} />;
} 