import { checkTokenExpiredUtil } from "../util";
import { getAccessTokenSelector } from "./access-token.selector";

export const isLoginSelector = (): boolean => {
  const token = getAccessTokenSelector();
  return !!token && !checkTokenExpiredUtil(token);
};
