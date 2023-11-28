import { FetchBlobResponse } from 'react-native-blob-util';

import { BEError, Query } from '#api';

import FileManagerService, { UIAttachment } from '#services/FileManagerService';

import {
  DTOChat,
  DTOEloquentPaginationMeta,
  DTOHelpdeskRequest,
  DTOHelpdeskTheme,
} from '#generated/types';

import { paginationMerge, paginationShouldForceRefetch } from '../utils';
import { RequestsTracker as Requests, TagsApiTracker as Tags } from './types';

const TrackerAPI = Query.injectEndpoints({
  endpoints: build => ({
    postCashlessPayment: build.mutation<
      Requests['postCashlessPayment']['response'],
      Requests['postCashlessPayment']['args']
    >({
      query: ({ data }) => ({
        url: '/tracker/cashless-payment-request',
        data,
        method: 'POST',
      }),
    }),

    getIssue: build.query<
      Requests['getIssue']['response'],
      Requests['getIssue']['args']
    >({
      query: ({ data, path }) => ({
        url: '/tracker/issue/{id}',
        data,
        path,
        method: 'GET',
      }),
    }),

    postIssue: build.mutation<
      FetchBlobResponse,
      Requests['postIssue']['args'] & { files: UIAttachment[] }
    >({
      async queryFn(arg) {
        try {
          const result = await FileManagerService.upload(
            '/tracker/issue',
            arg.data!,
            arg.files,
          );
          return { data: result };
        } catch (e) {
          return { error: e as BEError };
        }
      },
    }),

    postIssueMessage: build.mutation<
      FetchBlobResponse,
      Requests['postIssueMessage']['args'] & { files: UIAttachment[] }
    >({
      async queryFn(arg) {
        try {
          const result = await FileManagerService.upload(
            `/tracker/issue/${arg.path?.id}/comments`,
            arg.data!,
            arg.files,
          );
          return { data: result };
        } catch (e) {
          return { error: e as BEError };
        }
      },
      invalidatesTags: [Tags.ISSUE],
    }),

    //TODO FIX DOCS
    getIssues: build.query<DTOChat[], Requests['getIssues']['args']>({
      query: () => ({
        url: '/tracker/issues',
        method: 'GET',
      }),
      providesTags: [Tags.ISSUE],
      keepUnusedDataFor: 120,
    }),

    getHelpdeskRequest: build.query<
      DTOHelpdeskRequest[],
      Requests['getHelpdeskRequest']['args']
    >({
      query: ({ path }) => ({
        url: '/tracker/helpdesk/{id}',
        path,
        method: 'GET',
      }),
    }),

    getNewMessagesCount: build.query<
      Requests['getNewMessagesCount']['response'],
      Requests['getNewMessagesCount']['args']
    >({
      query: () => ({
        url: '/tracker/helpdesk/new-count',
        method: 'GET',
      }),
      providesTags: [Tags.MESSAGES_COUNT],
    }),

    getHelpdeskRequests: build.query<
      DTOEloquentPaginationMeta & { data: DTOHelpdeskRequest[] },
      Requests['getHelpdeskRequests']['args'] & {
        params: {
          page: number;
          per_page: number;
        };
      }
    >({
      query: ({ params }) => ({
        url: '/tracker/helpdesk',
        method: 'GET',
        params,
      }),
      serializeQueryArgs: args => {
        if (!args.queryArgs.params) {
          return args.endpointName;
        }

        const { status, user_id } = args.queryArgs.params!;
        return args.endpointName + status + user_id;
      },
      merge: paginationMerge,
      forceRefetch: paginationShouldForceRefetch,
      providesTags: [Tags.HELPDESK],
    }),

    postHelpdeskRequest: build.mutation<
      FetchBlobResponse,
      Requests['postHelpdeskRequest']['args'] & { files: UIAttachment[] }
    >({
      async queryFn(arg) {
        try {
          const result = await FileManagerService.upload(
            '/tracker/helpdesk',
            arg.data!,
            arg.files,
          );
          return { data: result };
        } catch (e) {
          return { error: e as BEError };
        }
      },
      invalidatesTags: [Tags.HELPDESK],
    }),

    getHelpdeskThemes: build.query<
      //FIX DOCS
      DTOHelpdeskTheme[],
      Requests['getHelpdeskThemes']['args']
    >({
      query: () => ({
        url: '/tracker/helpdesk/theme',
        method: 'GET',
      }),
    }),

    postHelpdeskRequestMessage: build.mutation<
      FetchBlobResponse,
      Requests['postHelpdeskRequestMessage']['args'] & { files: UIAttachment[] }
    >({
      async queryFn(arg) {
        try {
          const result = await FileManagerService.upload(
            `/tracker/helpdesk/${arg.path?.id}/comments`,
            arg.data!,
            arg.files,
          );
          return { data: result };
        } catch (e) {
          return { error: e as BEError };
        }
      },
      invalidatesTags: [Tags.HELPDESK],
    }),
  }),
});

export const {
  usePostCashlessPaymentMutation,
  usePostHelpdeskRequestMutation,
  useGetIssueQuery,
  useGetIssuesQuery,
  useGetHelpdeskRequestQuery,
  useGetHelpdeskThemesQuery,
  useGetHelpdeskRequestsQuery,
  usePostIssueMutation,
  usePostIssueMessageMutation,
  usePostHelpdeskRequestMessageMutation,
  useGetNewMessagesCountQuery,
} = TrackerAPI;
