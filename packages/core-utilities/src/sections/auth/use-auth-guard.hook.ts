'use client';

import { CookieService } from '@/cookie-storage';
import { useAuth } from '@/hooks';
import { jwtDecode } from 'jwt-decode';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseAuthGuardOptions {
  publicRoutes?: string[];
  locale?: string;
  groupPriority?: string[];
  groupAreaMap?: Record<string, string>;
  groupAccessMap?: Record<string, string[]>;
}

interface TokenPayload {
  groups?: string[];
  [key: string]: any;
}

export function useAuthGuard({
  publicRoutes = [],
  locale = 'en',
  groupPriority,
  groupAreaMap,
  groupAccessMap,
}: UseAuthGuardOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isHydrated } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  const normalizePath = useCallback((path: string): string => {
    const segments = path.split('/');
    if (segments.length > 1 && segments[1]?.length === 2) {
      return `/${segments.slice(2).join('/')}`.replace(/\/$/, '');
    }
    return path.replace(/\/$/, '');
  }, []);

  const isPublicRoute = useMemo(() => {
    const path = pathname.replace(/\/+$/, '');
    if (!publicRoutes || !locale) {
      return false;
    }

    return publicRoutes.some(route =>
      path === route
      || path === `/${locale}${route}`
      || path.startsWith(`${route}/`)
      || path.startsWith(`/${locale}${route}/`),
    );
  }, [pathname, publicRoutes, locale]);

  // const isInPublicPaths = useMemo(() => {
  //   const path = pathname.replace(/\/+$/, '');
  //
  //   return publicPaths.some(publicPath =>
  //     path === publicPath
  //     || path === `/${locale}${publicPath}`
  //     || path.startsWith(`${publicPath}/`)
  //     || path.startsWith(`/${locale}${publicPath}/`),
  //   );
  // }, [pathname, locale]);

  const safeDecodeToken = useCallback((token?: string): TokenPayload | null => {
    if (!token) {
      return null;
    }
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  }, []);

  const getRedirectArea = useCallback((groups: string[]): string => {
    if (!groupPriority || !groupAreaMap) {
      return '/';
    }
    for (const group of groupPriority) {
      if (groups.includes(group)) {
        return groupAreaMap[group] || '/';
      }
    }
    return '/';
  }, [groupPriority, groupAreaMap]);

  const isAllowedPath = useCallback((groups: string[], currentPath: string): boolean => {
    if (!groupAccessMap) {
      return true;
    }

    const normalized = normalizePath(currentPath);
    for (const group of groups) {
      const allowedPaths = groupAccessMap[group] || [];
      for (const path of allowedPaths) {
        if (
          normalized === path
          || normalized.startsWith(`${path}/`)
          || normalized.startsWith(`${path}-`)
        ) {
          return true;
        }
      }
    }
    return false;
  }, [groupAccessMap, normalizePath]);

  const handleRedirectByGroup = useCallback(() => {
    const accessToken = CookieService.getItem<string>('access_token');
    const decoded = safeDecodeToken(accessToken);
    const groups = decoded?.groups ?? [];

    // if (!groups || groups.length === 0) {
    //   router.push(`/${locale}/no-permission`);
    //   return;
    // }

    const redirectArea = getRedirectArea(groups);
    router.replace(`/${locale}${redirectArea}`.replace(/\/{2,}/g, '/'));
  }, [locale, router, safeDecodeToken, getRedirectArea]);

  useEffect(() => {
    if (!isHydrated || isLoading) {
      return;
    }

    setIsInitialized(true);

    const accessToken = CookieService.getItem<string>('access_token');

    const decoded = safeDecodeToken(accessToken);

    const groups = decoded?.groups ?? [];

    // 🟡 Accessing / or /vi → redirect by role if logged in, otherwise redirect to /sign-in
    if (pathname === '/' || pathname === `/${locale}`) {
      if (!isAuthenticated) {
        router.replace(`/${locale}/sign-in`);
        return;
      }
      handleRedirectByGroup();
      return;
    }

    // 🔴 Not logged in + not a public route → redirect to sign-in
    if (!isAuthenticated && !isPublicRoute) {
      router.replace(`/${locale}/sign-in`);
      return;
    }

    // ✅ Already logged in and on /sign-in → redirect based on role
    if (isAuthenticated && (pathname === '/sign-in' || pathname === `/${locale}/sign-in`)) {
      handleRedirectByGroup();
      return;
    }

    // ✅ Already logged in and accessing public route (e.g. /change-password, /reset-password) → allow
    if (isAuthenticated && isPublicRoute) {
      return;
    }

    // ✅ Logged in + not a public route → check permission
    if (isAuthenticated && groupAccessMap) {
      // Check if user has empty groups and path is not in publicPaths -> redirect to /no-permission
      // if ((!groups || groups?.length === 0) && !isInPublicPaths) {
      // router.push(`/${locale}/no-permission`);
      // return;
      // }

      if (!isAllowedPath(groups, pathname)) {
        const redirectArea = getRedirectArea(groups);
        router.replace(`/${locale}${redirectArea}`.replace(/\/{2,}/g, '/'));
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    isPublicRoute,
    pathname,
    router,
    isHydrated,
    locale,
    groupPriority,
    groupAreaMap,
    groupAccessMap,
    handleRedirectByGroup,
    safeDecodeToken,
    isAllowedPath,
    getRedirectArea,
  ]);

  return { isInitialized, isPublicRoute };
}
