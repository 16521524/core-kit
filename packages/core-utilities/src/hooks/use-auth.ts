'use client';

import { useEffect, useState } from 'react';
import { AuthTokenService } from '../services';
import { CoreAuthenticationStore, CoreUserProfileStore } from '../store';
import { authenticationStore } from '@/store/store-authentication/authentication.store';

export function useAuth() {
  const isLoading = authenticationStore(state => state.isFetchingAuthentication);

  const storeAuthenticated = authenticationStore(state => state.isAuthenticated);

  const error = authenticationStore(state => state.fetchingAuthenticationError);

  const [isHydrated, setIsHydrated] = useState(false);

  const tokenExists = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='));
    return !!token;
  };

  const logout = async () => {
    await CoreAuthenticationStore.logoutAction();
  };

  const hasPermission = (permission: string | string[]) => {
    if (Array.isArray(permission)) {
      return AuthTokenService.hasAnyPermission(permission);
    }
    return AuthTokenService.hasPermission(permission);
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isAuthenticated = isHydrated && storeAuthenticated && tokenExists();

  return {
    user: CoreUserProfileStore.getProfileSelector(),
    isLoading,
    isAuthenticated,
    error,
    logout,
    isHydrated,
    hasPermission,
  };
}
