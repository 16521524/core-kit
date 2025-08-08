'use client';

import type { IRegisterData } from '../store/store-authentication/authentication.types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CoreUserProfileStore } from '../store';
import { registerAction } from '../store/store-authentication/actions/register.action';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (data: IRegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await registerAction(data);

      if (success) {
        const user = CoreUserProfileStore.getProfileSelector();

        if (user?.user_type === 2) {
          router.push('/home');
        } else {
          router.push('/transaction');
        }

        return true;
      } else {
        setError('Registration failed');
        return false;
      }
    } catch {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
}
