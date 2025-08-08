import { ILoginResponseData } from '@/models';
import { pureAxios } from '../pureAxios';

export const refreshTokenAPI = (refreshToken: string): Promise<ILoginResponseData> => {
  return pureAxios
    .post<{ data: ILoginResponseData }>(
      '/api/v1/users/refresh-token',
      { refresh_token: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
          'clean-request': 'no-clean',
        },
      },
    )
    .then(res => res.data.data);
};
