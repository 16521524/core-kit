import type { IUserProfile } from '../../models';
import { API } from '..';

export const fetchUserProfileApi = () => {
  return new Promise<IUserProfile>((resolve, reject) => {
    API.get<{ data: IUserProfile }>('/api/v1/users/me')
      .then((res) => {
        resolve(res?.data?.data);
      })
      .catch(reject);
  });
};
