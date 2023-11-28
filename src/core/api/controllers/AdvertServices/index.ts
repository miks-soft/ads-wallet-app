import { Query } from '#api';

import {
  AdvertisingAccountStatuses,
  AllAdvertisingServices,
} from '#config/enums';

import { store } from '#store';

import {
  DTOAdvertAccount,
  DTOAdvertAccountCampaign,
  DTOEloquentPaginationMeta,
} from '#generated/types';

import { TagsApiBusinessAccounts } from '../BusinessAccounts/types';
import { paginationMerge, paginationShouldForceRefetch } from '../utils';
import {
  RequestsAdvertServices as Requests,
  TagsApiAdvertServices as Tags,
} from './types';

const AdvertServicesAPI = Query.injectEndpoints({
  endpoints: build => ({
    getAdvertAccountBalance: build.query<
      Requests['getAccountsBalance']['response'],
      Requests['getAccountsBalance']['args']
    >({
      query: ({ params }) => ({
        url: '/advertservice/accounts/total/balance',
        params,
        method: 'GET',
      }),
      providesTags: [Tags.SERVICE_BALANCE],
    }),

    getAvailableServices: build.query<
      Requests['getAvailableServices']['response'],
      Requests['getAvailableServices']['args']
    >({
      query: () => ({
        url: '/advertservice/list',
        method: 'GET',
      }),
    }),

    getServiceAccounts: build.query<
      DTOAdvertAccount[],
      Requests['getServiceAccounts']['args']
    >({
      query: ({ params }) => ({
        url: '/advertservice/accounts/list',
        params,
        method: 'GET',
      }),
    }),

    checkAccount: build.mutation<
      Requests['checkAccount']['response'],
      Requests['checkAccount']['args']
    >({
      query: ({ data }) => ({
        url: '/advertservice/check-account',
        data,
        method: 'POST',
      }),
      onQueryStarted: async (args, api) => {
        const result = await api.queryFulfilled;
        if (!result.data?.status) {
          return;
        }

        api.dispatch(
          AdvertServicesAPI.util.updateQueryData(
            'getAdvertAccounts',
            {
              params: {
                service: args.data?.service!,
                business_account_id: args.data?.business_account_id!,
              },
            },
            draft => {
              const accountIndex = draft.data.findIndex(
                el => el.id === args.data?.account_id,
              );
              if (accountIndex !== -1) {
                draft.data[accountIndex].status = result.data
                  ?.status as AdvertisingAccountStatuses;
              }
            },
          ),
        );
      },
    }),

    addAdvertAccount: build.mutation<
      Requests['addAccount']['response'],
      Requests['addAccount']['args']
    >({
      query: ({ data }) => ({
        url: '/advertservice/add-account',
        data,
        method: 'POST',
      }),
    }),

    changeAccountBalance: build.mutation<
      Requests['changeAccountBalance']['response'],
      Requests['changeAccountBalance']['args']
    >({
      query: ({ data }) => ({
        url: '/advertservice/change-account-balance',
        data,
        method: 'POST',
      }),
    }),

    getAccountCampaigns: build.query<
      DTOAdvertAccountCampaign[],
      Requests['getAccountCampaigns']['args']
    >({
      query: ({ params }) => ({
        url: '/advertservice/campaings',
        params,
        method: 'GET',
      }),
      providesTags: [Tags.ACCOUNT_CAMPAIGNS],
    }),

    getActiveServicesAccounts: build.query<
      Record<AllAdvertisingServices, DTOAdvertAccount[]>,
      Requests['getActiveServicesAccounts']['args']
    >({
      query: ({ params }) => ({
        url: '/advertservice/active-accounts-in-services',
        params,
        method: 'GET',
      }),
      providesTags: [Tags.ACCOUNTS],
    }),

    changeCampaignBudget: build.mutation<
      Requests['changeCampaignBudget']['response'],
      Requests['changeCampaignBudget']['args']
    >({
      query: args => ({
        url: '/advertservice/change-campaign-budget',
        method: 'POST',
        ...args,
      }),
    }),

    getAdvertAccounts: build.query<
      DTOEloquentPaginationMeta & { data: DTOAdvertAccount[] },
      Requests['getAccounts']['args']
    >({
      query: ({ params }) => ({
        url: '/advertservice/get-accounts',
        params,
        method: 'GET',
      }),
      serializeQueryArgs: args => {
        if (!args.queryArgs.params) {
          return args.endpointName;
        }

        const { business_account_id, service } = args.queryArgs.params!;
        return args.endpointName + business_account_id + service;
      },
      merge: paginationMerge,
      forceRefetch: paginationShouldForceRefetch,
      providesTags: [Tags.ACCOUNTS],
    }),

    refund: build.mutation<
      Requests['refund']['response'],
      Requests['refund']['args']
    >({
      query: ({ data }) => ({
        url: '/advertservice/transfer-from-account-to-business-account',
        data,
        method: 'POST',
      }),
      onQueryStarted: async (args, api) => {
        await api.queryFulfilled;
        api.dispatch(
          AdvertServicesAPI.util.updateQueryData(
            'getAdvertAccounts',
            {
              params: {
                service: args.data?.service!,
                business_account_id:
                  store.getState().app.currentBusinessAccountId,
              },
            },
            draft => {
              const accountIndex = draft.data.findIndex(
                el => el.id === args.data?.account_id,
              );
              if (accountIndex !== -1) {
                draft.data[accountIndex].balance = !args.data?.amount
                  ? ''
                  : `${+draft.data[accountIndex].balance - +args.data.amount}`;
              }
            },
          ),
        );

        api.dispatch(
          Query.util.invalidateTags([TagsApiBusinessAccounts.ACCOUNT_BALANCE]),
        );
      },
    }),
  }),
});

export const {
  useGetAdvertAccountBalanceQuery,
  useGetAdvertAccountsQuery,
  useGetActiveServicesAccountsQuery,
  useGetAccountCampaignsQuery,
  useGetServiceAccountsQuery,
  useGetAvailableServicesQuery,
  useCheckAccountMutation,
  useChangeCampaignBudgetMutation,
  useRefundMutation,
  useAddAdvertAccountMutation,
  useChangeAccountBalanceMutation,
} = AdvertServicesAPI;
