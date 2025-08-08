'use client';

import { CoreAuthenticationStore } from '../store';

export function useLogin() {
  const isLoading = CoreAuthenticationStore.isLoginLoading();

  const error = CoreAuthenticationStore.getLoginError();

  const handleLogin = async (email: string, password: string, rememberMe = false) => {
    await CoreAuthenticationStore.loginAction({ email, password, rememberMe });
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
}
