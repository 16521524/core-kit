import { CoreUserProfileStore, CoreAuthenticationStore } from "@/store";

export const useChangePassword = () => {
  const profile = CoreUserProfileStore.getProfileSelector();

  const loadingSelector = CoreAuthenticationStore.isChangePasswordLoading();

  return {
    profile,
    loadingSelector,
    changePassword: CoreAuthenticationStore.changePasswordAction,
  };
};
