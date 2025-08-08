import { IRegisterResponseData } from '@/models';
import { API } from '../Api';

export const registerAPI = (username: string, password: string, phoneNumber: string | undefined, shareLink: string) => {
  return API.post<IRegisterResponseData>(
    '/account/signup',
    {
      username,
      password,
      shareLink,
      phone: phoneNumber,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'clean-request': 'no-clean',
      },
    },
  );
};
