import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi, retry } from '@reduxjs/toolkit/query/react';

import * as Keychain from 'react-native-keychain';

import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';

import { DEFAULT_API_URL, API_URL_RU, API_URL_USA } from '#env';

import { __DEVELOPER__ } from '#config';

import Debug from '#utils/debug';

import { TagsApiAdvertServices } from './controllers/AdvertServices/types';
import { TagsApiObservers } from './controllers/AdvertServicesObservers/types';
import { TagsApiAuth } from './controllers/Auth/types';
import { TagsApiBusinessAccounts } from './controllers/BusinessAccounts/types';
import { TagsApiTracker } from './controllers/Tracker/types';

export type BEError = {
  data: {
    errors: { [key in string]: string };
    message: string;
  };
  status: number;
};

type FetchArgs = {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  path?: AxiosRequestConfig['path'];
};

const api = axios.create({
  timeout: 10000,
});

const baseQuery = retry(
  async (args: FetchArgs, _api, extraOptions) => {
    const result = await axiosBaseQuery({
      baseUrl: DEFAULT_API_URL,
    })(args, _api, extraOptions);
    if (args.url === '/auth/login') {
      return result;
    }

    if (
      //@ts-ignore TODO proper unauth typing
      [422].includes(result.error?.status)
    ) {
      retry.fail(result.error);
    }

    return result;
  },
  {
    maxRetries: 2,
  },
);

const axiosBaseQuery =
  ({
    baseUrl = DEFAULT_API_URL,
  }: {
    baseUrl: string;
  }): BaseQueryFn<FetchArgs, unknown> =>
  async ({ url, method, data, params, path }, store) => {
    try {
      const credentials = await Keychain.getGenericPassword();

      Object.entries(path || {}).forEach(([k, v]) => {
        url = url.replace(`{${k}}`, encodeURIComponent(v));
      });

      !baseUrl &&
        Debug.error('no base url available, make sure .env file inited');

      const result = await api({
        url:
          (__DEVELOPER__
            ? (store.getState() as any).app.region === 'RU'
              ? API_URL_RU
              : API_URL_USA
            : DEFAULT_API_URL) + url,
        method,
        data,
        params,
        headers: {
          Authorization: credentials ? `Bearer ${credentials.password}` : '',
        },
      });

      return {
        data: result?.data?.data || result?.data || {},
        meta: {
          ...result.data,
          timestamp: new Date().toISOString(),
          data: undefined,
        },
      };
    } catch (axiosError) {
      Debug.requestError('', axiosError);

      let err = axiosError as AxiosError;

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

const Query = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery as BaseQueryFn<FetchArgs, unknown, BEError>,
  endpoints: () => ({}),
  tagTypes: [
    ...Object.values(TagsApiAuth),
    ...Object.values(TagsApiAdvertServices),
    ...Object.values(TagsApiBusinessAccounts),
    ...Object.values(TagsApiTracker),
    ...Object.values(TagsApiObservers),
  ],
  keepUnusedDataFor: 600,
});

export { Query, api };
