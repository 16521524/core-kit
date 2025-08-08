import type { IChangePasswordData } from '../authentication.types';
import { authenticationStore } from '../authentication.store';
import { changePasswordApi } from '@/api';

export const changePasswordAction = async (data: IChangePasswordData): Promise<boolean> => {
  authenticationStore.setState({ isFetchingAuthentication: true, fetchingAuthenticationError: null });

  const { currentPassword, newPassword, confirmPassword } = data;
  try {
    if (newPassword !== confirmPassword) {
      authenticationStore.setState({ isFetchingAuthentication: false, fetchingAuthenticationError: 'New passwords do not match' });
      return false;
    }

    await changePasswordApi(currentPassword, newPassword);

    authenticationStore.setState({ isFetchingAuthentication: false });
    return true;
  } catch {
    authenticationStore.setState({ isFetchingAuthentication: false, fetchingAuthenticationError: 'An error occurred while changing password' });
    return false;
  }
};

export const isChangePasswordLoading = (): boolean => {
  return authenticationStore.getState().isFetchingAuthentication;
};

export const getChangePasswordError = (): string | null => {
  return authenticationStore.getState().fetchingAuthenticationError;
};
