import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

class CookieServiceFactory {
  private static _instance: CookieServiceFactory;

  public static instance(): CookieServiceFactory {
    if (!this._instance) {
      this._instance = new CookieServiceFactory();
    }
    return this._instance;
  }

  private constructor() {}

  public getItem = <T = string>(key: string): T | '' => {
    if (typeof window === 'undefined') {
      return '';
    }
    const value = getCookie(key);
    if (!value) {
      return '';
    }
    try {
      return JSON.parse(value as string) as T;
    } catch {
      return value as unknown as T;
    }
  };

  public setItem = <T = any>(key: string, value: T, options: { maxAge?: number } = {}) => {
    if (typeof window === 'undefined') {
      return;
    }
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    setCookie(key, data, {
      path: '/',
      secure: true,
      sameSite: 'lax',
      ...options,
    });
  };

  public removeItem = (key: string) => {
    if (typeof window === 'undefined') {
      return;
    }
    deleteCookie(key);
  };

  public setAccessToken = (token: string) => {
    if (!token) {
      return;
    }

    const decoded = jwtDecode<{ exp?: number }>(token);
    if (!decoded.exp) {
      console.warn('No exp in token');
      return;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const expiresInSeconds = decoded.exp - nowInSeconds;

    if (expiresInSeconds <= 0) {
      console.warn('Token expired already');
      return;
    }

    this.setItem('access_token', token, {
      maxAge: expiresInSeconds + (60 * 60 * 24 * 365),
    });
  };
}

export const CookieService = CookieServiceFactory.instance();

if (typeof window !== 'undefined') {
  (window as any).setCookieItem = CookieService.setItem;
  (window as any).getCookieItem = CookieService.getItem;
  (window as any).removeCookieItem = CookieService.removeItem;
}
