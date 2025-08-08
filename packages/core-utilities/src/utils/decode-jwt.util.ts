import { jwtDecode } from 'jwt-decode';

export const decodePayload = (token: string): { groups?: string[] } => {
  try {
    return jwtDecode(token);
  } catch {
    return {};
  }
};
