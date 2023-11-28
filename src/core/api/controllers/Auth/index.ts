import * as Keychain from 'react-native-keychain';

import { Query } from '#api';

import { store } from '#store';
import { AppActions } from '#store/slices/app';

import { RequestsAuth as Requests, TagsApiAuth as Tags } from './types';

const AuthAPI = Query.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<
      Requests['login']['response'],
      Requests['login']['args']
    >({
      query: ({ data }) => ({
        url: '/auth/login',
        data,
        method: 'POST',
      }),
      invalidatesTags: [Tags.USER],
    }),

    logout: build.mutation<
      Requests['logout']['response'],
      Requests['logout']['args']
    >({
      queryFn: () => ({ data: null }),
      extraOptions: {
        maxRetries: 1,
      },
      onQueryStarted: async (arg, api) => {
        await api.queryFulfilled;

        await Keychain.resetGenericPassword();

        api.dispatch(Query.util.resetApiState());
      },
      invalidatesTags: [Tags.USER],
    }),

    sendResetPasswordCode: build.mutation<
      Requests['sendResetPasswordCode']['response'],
      Requests['sendResetPasswordCode']['args']
    >({
      query: ({ data }) => ({
        url: '/auth/send-reset-password-code',
        method: 'POST',
        data,
      }),
    }),

    checkResetPasswordCode: build.mutation<
      Requests['checkResetPasswordCode']['response'],
      Requests['checkResetPasswordCode']['args']
    >({
      query: ({ data }) => ({
        url: '/auth/check-reset-password-code',
        method: 'POST',
        data,
      }),
    }),

    resetPassword: build.mutation<
      Requests['resetPassword']['response'],
      Requests['resetPassword']['args']
    >({
      query: ({ data }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        data,
      }),
    }),

    getUserInfo: build.query<
      Requests['getUserInfo']['response'],
      Requests['getUserInfo']['args']
    >({
      query: () => ({
        url: '/auth/userinfo',
        method: 'GET',
      }),
      keepUnusedDataFor: Infinity,
      providesTags: [Tags.USER],
      onQueryStarted: async (arg, api) => {
        const result = await api.queryFulfilled;
        if (!result.data) {
          return;
        }

        if (result.data.is_verified) {
          store.dispatch(AppActions.setStubs({ notVerified: false }));
        } else {
          store.dispatch(
            AppActions.setStubs({ notVerified: true, noBusinessAccount: true }),
          );
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useResetPasswordMutation,
  useSendResetPasswordCodeMutation,
  useCheckResetPasswordCodeMutation,
} = AuthAPI;

export default AuthAPI;
