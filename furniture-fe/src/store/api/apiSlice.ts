import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {
  localLogout,
  setUserToken,
  setUserData,
} from '../reducers/AuthSlice.ts';
import { apiUrl } from '../../constants.ts';
import {clearToken, getToken, setToken} from '../../utils/localStorage.ts';
import { getUserFromToken } from '../../utils/index.ts';

interface IRefreshResultData {
  access_token: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${apiUrl}`,
  credentials: 'include',
  prepareHeaders: (headers, state) => {
    const getTokenStorage = state.getState() as { auth: { token: string } };
    const storageToken = getTokenStorage.auth.token;
    const localToken = getToken();

    const token = storageToken || localToken;

    try {
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.log(error);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log('sending refresh token');
    //send refresh token to get new access token
    const refreshResult = await baseQuery(
      '/auth/refresh-token',
      api,
      extraOptions
    );
    console.log('refreshResult', refreshResult);

    if (refreshResult?.data) {
      const resultData = { ...(refreshResult.data as object) } as IRefreshResultData;

      const token = resultData['access_token'];
      const user = getUserFromToken(token);

      //store the new token and user
      if (user) {
        api.dispatch(setUserToken(token));
        api.dispatch(setUserData(user));
        setToken(token);
      } else {
        api.dispatch(setUserData({}));
      }

      //retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(localLogout());
      clearToken();
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Category', 'Product', 'Order'],
  endpoints: () => ({}),
});