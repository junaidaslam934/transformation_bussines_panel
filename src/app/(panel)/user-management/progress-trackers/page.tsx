"use client";

import { Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import TrackerProgress from "@/components/users/trackerProgress";

function ProgressTrackersContent() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    return <TrackerProgress userId={userId || undefined} />;
}

export default function ProgressTrackersPage() {
    return (
        <Suspense>
            <ProgressTrackersContent />
        </Suspense>
    );
}
   