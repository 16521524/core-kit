'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { AuthContext } from './auth.context';
import { useAuthGuard } from './use-auth-guard.hook';

interface AuthProviderProps {
  children?: ReactNode;
  publicRoutes?: string[];
  locale?: string;
  groupPriority?: string[];
  groupAreaMap?: Record<string, string>;
  groupAccessMap?: Record<string, string[]>;
}

export function AuthProvider({ children, publicRoutes, locale, groupPriority, groupAreaMap, groupAccessMap }: AuthProviderProps) {
  const { isInitialized, isPublicRoute } = useAuthGuard({ publicRoutes, locale, groupPriority, groupAreaMap, groupAccessMap });

  const contextValue = useMemo(() => ({
    isInitialized,
    isPublicRoute,
  }), [isInitialized, isPublicRoute]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-y-2 border-[#002147]" />
      </div>
    );
  }

  return (
    <AuthContext value={contextValue}>
      {children}
    </AuthContext>
  );
}
