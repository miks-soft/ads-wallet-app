import { Query } from '#api';

import { AllAdvertisingServices } from '#config/enums';

import { store } from '#store';
import { AppActions } from '#store/slices/app';

import {
  DTOChartDay,
  DTOChartsService,
  DTOEloquentPaginationMeta,
  DTOStats,
  DTOStatsRaw,
} from '#generated/types';

import { paginationMerge, paginationShouldForceRefetch } from '../utils';
import {
  RequestsBusinessAccounts as Requests,
  TagsApiBusinessAccounts as Tags,
} from './types';

const BusinessAccountsAPI = Query.injectEndpoints({
  endpoints: build => ({
    getBusinessAccounts: build.query<
      DTOEloquentPaginationMeta & {
        data: Requests['getBusinessAccounts']['response'];
      },
      Requests['getBusinessAccounts']['args']
    >({
      query: args => ({
        url: '/business-account',
        method: 'GET',
        //@ts-expect-error todo fix docs
        ...args,
      }),
      serializeQueryArgs: args => {
        return args.endpointName;
      },
      onQueryStarted: async (arg, api) => {
        const result = await api.queryFulfilled;
        const firstAccount = result?.data?.data?.[0];

        //@ts-expect-error
        if (arg.params?.page) {
          store.dispatch(
            AppActions.setStubs({
              noBusinessAccount: !firstAccount?.id,
            }),
          );
        }

        if (
          store.getState().app.currentBusinessAccountId === '' &&
          firstAccount?.id
        ) {
          store.dispatch(
            AppActions.setCurrentBusinessAccountId(firstAccount?.id),
          );
        }
      },
      transformResponse: (
        response: Requests['getBusinessAccounts']['response'],
        meta: { meta: DTOEloquentPaginationMeta; timestamp: string },
      ) => {
        return {
          data: response,
          current_page: meta.meta.current_page,
          last_page: meta.meta.last_page,
          total: meta.meta.total,
        };
      },
      merge: paginationMerge,
      forceRefetch: paginationShouldForceRefetch,
      providesTags: result =>
        result?.data?.length
          ? result?.data.map(el => ({
              type: Tags.ACCOUNT,
              id: el.id,
            }))
          : [Tags.ACCOUNT],
    }),

    getBusinessAccountsTransactions: build.query<
      DTOEloquentPaginationMeta & {
        data: Requests['getBusinessAccountTransactions']['response'];
      } & { sum: number },
      //TODO FIX TYPES
      Requests['getBusinessAccountTransactions']['args'] & {
        params: {
          page: number;
          per_page: number;
        };
      }
    >({
      query: ({ params, path }) => ({
        url: '/business-account/{business_account}/transaction',
        params,
        path,
        method: 'GET',
      }),
      serializeQueryArgs: args => {
        if (!args.queryArgs.params || !args.queryArgs.path) {
          return args.endpointName;
        }
        const { business_account } = args.queryArgs.path!;
        return args.endpointName + business_account;
      },
      merge: paginationMerge,
      forceRefetch: paginationShouldForceRefetch,
      providesTags: [Tags.TRANSACTIONS],
      //TODO MAKE shared INTERFACE FOR PAGINATION
      transformResponse: (
        response: Requests['getBusinessAccountTransactions']['response'],
        meta: { meta: DTOEloquentPaginationMeta; sum: number },
      ) => {
        return {
          data: response,
          current_page: meta.meta.current_page,
          last_page: meta.meta.last_page,
          total: meta.meta.total,
          sum: meta.sum,
        };
      },
    }),

    getBusinessAccount: build.query<
      Requests['getBusinessAccount']['response'],
      Requests['getBusinessAccount']['args']
    >({
      query: ({ params, path }) => ({
        url: '/business-account/{business_account}',
        params,
        path,
        method: 'GET',
      }),
      providesTags: result => [
        {
          type: Tags.ACCOUNT,
          id: result?.id,
        },
        Tags.ACCOUNT_BALANCE,
      ],
    }),

    getStatsBetweenDates: build.query<
      DTOStats,
      Requests['getStatsBetweenDates']['args']
    >({
      query: ({ params, path }) => ({
        url: '/business-account/{business_account}/get-stats-between-dates',
        params,
        path,
        method: 'GET',
      }),
      transformResponse: (response: DTOStatsRaw) => {
        const dynamic_of_spent_transformed = {} as Record<
          AllAdvertisingServices,
          DTOChartsService
        >;

        Object.entries(response.dynamic_of_spent).forEach(([key, value]) => {
          const _key = key as AllAdvertisingServices;

          dynamic_of_spent_transformed[_key] =
            value as unknown as DTOChartsService;

          if (dynamic_of_spent_transformed[_key]?.by_days.length) {
            dynamic_of_spent_transformed[_key].by_days =
              dynamic_of_spent_transformed[_key]?.by_days?.map(el => {
                const _el = el as unknown as DTOChartDay;
                return {
                  ...el,
                  for_date: _el.date,
                  balance: el?.balance,
                  spent: el?.spent,
                };
              });
          }
        });

        return {
          ...response,
          dynamic_of_spent: dynamic_of_spent_transformed,
        };
      },
    }),

    getBusinessAccountBalance: build.query<
      Requests['getBusinessAccountBalance']['response'],
      Requests['getBusinessAccountBalance']['args']
    >({
      query: args => ({
        url: '/business-account/{business_account}/balance',
        ...args,
        method: 'GET',
      }),
      providesTags: [Tags.ACCOUNT_BALANCE],
    }),

    postBusinessAccount: build.mutation<
      Requests['postBusinessAccount']['response'],
      Requests['postBusinessAccount']['args']
    >({
      query: ({ data }) => ({
        url: '/business-account',
        data,
        method: 'POST',
      }),
      invalidatesTags: [Tags.ACCOUNT],
    }),

    patchBusinessAccount: build.mutation<
      Requests['patchBusinessAccount']['response'],
      Requests['patchBusinessAccount']['args']
    >({
      query: ({ data, path }) => ({
        url: '/business-account/{business_account}',
        data,
        path,
        method: 'PATCH',
      }),
      invalidatesTags: [Tags.ACCOUNT],
    }),

    resetClientSecret: build.mutation<
      Requests['resetClientSecret']['response'],
      Requests['resetClientSecret']['args']
    >({
      query: ({ data, path }) => ({
        url: '/business-account/{business_account}/reset-client-secret',
        data,
        path,
        method: 'POST',
        invalidatesTags: [Tags.ACCOUNT],
      }),
      onQueryStarted: async (args, api) => {
        const result = await api.queryFulfilled;

        if (!result.data) {
          return;
        }

        api.dispatch(
          BusinessAccountsAPI.util.updateQueryData(
            'getBusinessAccount',
            {
              path: {
                business_account: args.path!.business_account,
              },
            },
            draft => {
              //@ts-expect-error
              draft.oaut2_data.cilent_secret =
                //@ts-expect-error
                result.data.oaut2_data.cilent_secret;
              //@ts-expect-error
              draft.oaut2_data.client_id = result.data.oaut2_data.client_id;
            },
          ),
        );
      },
    }),

    checkInn: build.mutation<
      Requests['checkInn']['response'],
      Requests['checkInn']['args']
    >({
      query: ({ data }) => ({
        url: '/business-account/check-inn',
        data,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetBusinessAccountBalanceQuery,
  useGetBusinessAccountQuery,
  useGetBusinessAccountsQuery,
  useLazyGetBusinessAccountsQuery,
  useGetBusinessAccountsTransactionsQuery,
  usePostBusinessAccountMutation,
  usePatchBusinessAccountMutation,
  useResetClientSecretMutation,
  useGetStatsBetweenDatesQuery,
  useCheckInnMutation,
} = BusinessAccountsAPI;
