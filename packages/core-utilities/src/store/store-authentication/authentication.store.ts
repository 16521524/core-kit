import { CONFIGURATION } from '@/constants';
import { LocalStorageService } from '@/local-storage';
import type { IAuthenticationStore } from './authentication.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const authenticationStore = create<
  IAuthenticationStore
>()(
  persist(
    _ => ({
      isFetchingAuthentication: false,
      isAuthenticated: false,
      accessToken: LocalStorageService.getItem(CONFIGURATION.ACCESS_TOKEN_LS_KEY) || null,
      refreshToken: LocalStorageService.getItem(CONFIGURATION.REFRESH_TOKEN_LS_KEY) || null,
      fetchingAuthenticationError: null,
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
