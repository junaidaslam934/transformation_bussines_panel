import UserWeight from '@/components/users/userWeight';

interface MetricGraphPageProps {
  params: { metric: string };
}

export default function MetricGraphPage({ params }: MetricGraphPageProps) {
  const { metric } = params;
  return <UserWeight />;
} 