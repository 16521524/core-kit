import { CONFIGURATION } from '@/constants';
import { CookieService } from '@/cookie-storage';
import { LocalStorageService } from '@/local-storage';
import { CoreUserProfileStore } from '../../store-user-profile';
import { authenticationStore } from '../authentication.store';

export const logoutAction = (): void => {
  LocalStorageService.removeItem(CONFIGURATION.ACCESS_TOKEN_LS_KEY);

  LocalStorageService.removeItem(CONFIGURATION.REFRESH_TOKEN_LS_KEY);

  authenticationStore.setState({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    fetchingAuthenticationError: null,
    isFetchingAuthentication: false,
  });

  CoreUserProfileStore.updateProfileAction(undefined);

  CookieService.removeItem('access_token');
};
