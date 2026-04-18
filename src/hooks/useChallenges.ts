import { useState, useEffect } from 'react';
import ChallengeService from '@/services/challengeService';
import { IActiveChallenge } from '@/types/api';

interface UseChallengesReturn {
  challenges: IActiveChallenge[];
  loading: boolean;
  error: string | null;
}

export const useChallenges = (): UseChallengesReturn => {
  const [challenges, setChallenges] = useState<IActiveChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ChallengeService.getAllChallenges();
        
        if (response.success && response.data) {
          setChallenges(response.data);
        } else {
          setError('Failed to fetch challenges');
        }
      } catch (err) {
        console.error('Error fetching challenges:', err);
        setError('Failed to fetch challenges');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  return { challenges, loading, error };
}; 