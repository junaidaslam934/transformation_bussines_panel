"use client";

import { Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import UserWeeklySummary from "@/components/users/userweeklySummary";

function WeeklySummariesContent() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    return <UserWeeklySummary userId={userId || undefined} />;
}

export default function WeeklySummariesPage() {
    return (
        <Suspense>
            <WeeklySummariesContent />
        </Suspense>
    );
}
  