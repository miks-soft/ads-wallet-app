import { Query } from '#api';

import { DTOEloquentPaginationMeta } from '#generated/types';

import { paginationMerge, paginationShouldForceRefetch } from '../utils';
import { RequestsFinance as Requests } from './types';
const FinanceAPI = Query.injectEndpoints({
  endpoints: build => ({
    getDocuments: build.query<
      DTOEloquentPaginationMeta & Requests['getDocuments']['response'],
      Requests['getDocuments']['args'] & {
        params: {
          page: number;
          per_page: number;
        };
      }
    >({
      query: ({ params }) => ({
        url: '/finance/documents',
        method: 'GET',
        params,
      }),
      serializeQueryArgs: args => {
        if (!args.queryArgs.params) {
          return args.endpointName;
        }

        const { business_account_id } = args.queryArgs.params!;
        return args.endpointName + business_account_id;
      },
      merge: paginationMerge,
      forceRefetch: paginationShouldForceRefetch,
    }),

    getTempLink: build.query<
      Requests['getTempLink']['response'],
      Requests['getTempLink']['args']
    >({
      query: ({ params, path }) => ({
        url: '/finance/get-temp-link/{id}',
        method: 'GET',
        params,
        path,
      }),
    }),
  }),
});

export const { useGetDocumentsQuery, useLazyGetTempLinkQuery } = FinanceAPI;
