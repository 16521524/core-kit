import type { ILoginCredentials } from '../authentication.types';
import { CoreUserProfileStore } from '../../store-user-profile';
import { authenticationStore } from '../authentication.store';
import { loginAPI } from '@/api';
import { CONFIGURATION } from '@/constants';
import { CookieService } from '@/cookie-storage';
import { LocalStorageService } from '@/local-storage';

export const loginAction = async (credentials: ILoginCredentials): Promise<boolean> => {
  const setState = authenticationStore.setState;

  try {
    setState({ isFetchingAuthentication: true, fetchingAuthenticationError: null });

    const { email, password } = credentials;

    const data = await loginAPI(email, password);

    const { refresh_token: refreshToken, access_token: accessToken } = data;

    CookieService.setAccessToken(accessToken);

    // setApiAccessToken();

    LocalStorageService.setItem(CONFIGURATION.ACCESS_TOKEN_LS_KEY, accessToken);

    LocalStorageService.setItem(CONFIGURATION.REFRESH_TOKEN_LS_KEY, refreshToken);

    setState({
      isFetchingAuthentication: false,
      isAuthenticated: true,
      accessToken,
      refreshToken,
      fetchingAuthenticationError: null,
    });

    await CoreUserProfileStore.fetchProfileAction();

    return true;
  } catch (err) {
    LocalStorageService.removeItem(CONFIGURATION.ACCESS_TOKEN_LS_KEY);

    LocalStorageService.removeItem(CONFIGURATION.REFRESH_TOKEN_LS_KEY);

    CookieService.removeItem('access_token');

    setState({
      isFetchingAuthentication: false,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      fetchingAuthenticationError: (err as Error).message || 'An error occurred during login',
    });

    return false;
  }
};

export const isLoginLoading = (): boolean => {
  return authenticationStore(state => state.isFetchingAuthentication);
};

export const getLoginError = (): string | null => {
  return authenticationStore(state => state.fetchingAuthenticationError);
};
