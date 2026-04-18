import AdvisorDetails from '@/components/advisors/advisorDetails';
import AuthGuard from '@/components/common/AuthGuard';
import React from 'react';

interface PageProps {
  params: {
    advisorId: string;
  };
}

export default function AdvisorDetailsPage({ params }: PageProps) {
  return (
    <AuthGuard>
      <div>
        <AdvisorDetails advisorId={params.advisorId} />
      </div>
    </AuthGuard>
  );
} 