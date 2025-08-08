import { ILoginResponseData } from '@/models';
import { API } from '../Api';

export const loginAPI = (username: string, password: string): Promise<ILoginResponseData> => {
  return new Promise((resolve, reject) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    API.post<{ data: ILoginResponseData }>('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'clean-request': 'no-clean',
      },
    })
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
