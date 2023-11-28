import { Query } from '#api';

import { DTOObserver } from '#generated/types';

import {
  RequestsObservers as Requests,
  TagsApiObservers as Tags,
} from './types';

const ObserversAPI = Query.injectEndpoints({
  endpoints: build => ({
    getObservers: build.query<DTOObserver[], Requests['getObservers']['args']>({
      query: ({ params }) => ({
        url: '/advertservice/observers',
        params,
        method: 'GET',
      }),
      providesTags: [Tags.OBSERVERS],
    }),

    postObserver: build.mutation<
      Requests['postObserver']['response'],
      Requests['postObserver']['args']
    >({
      query: ({ data }) => ({
        url: '/advertservice/observers',
        data,
        method: 'POST',
      }),
      invalidatesTags: [Tags.OBSERVERS],
    }),

    deleteObserver: build.mutation<
      Requests['deleteObserver']['response'],
      Requests['deleteObserver']['args']
    >({
      query: ({ data }) => ({
        url: '/advertservice/observers/delete',
        data,
        method: 'POST',
      }),
      invalidatesTags: [Tags.OBSERVERS],
    }),

    attachObserverClient: build.mutation<
      Requests['attachObserverClient']['response'],
      Requests['attachObserverClient']['args']
    >({
      query: ({ data }) => ({
        url: '/advertservice/observers/attach',
        data,
        method: 'POST',
      }),
      invalidatesTags: [Tags.OBSERVERS],
    }),

    detachObserverClient: build.mutation<
      Requests['detachObserverClient']['response'],
      Requests['detachObserverClient']['args']
    >({
      query: ({ data }) => ({
        url: '/advertservice/observers/detach',
        data,
        method: 'POST',
      }),
      invalidatesTags: [Tags.OBSERVERS],
    }),
  }),
});

export const {
  useGetObserversQuery,
  useDeleteObserverMutation,
  useAttachObserverClientMutation,
  useDetachObserverClientMutation,
  usePostObserverMutation,
} = ObserversAPI;
