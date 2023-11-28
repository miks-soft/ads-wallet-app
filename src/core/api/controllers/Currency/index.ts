import { Query } from '#api';

import { RequestsAuth as Requests } from './types';

const CurrencyAPI = Query.injectEndpoints({
  endpoints: build => ({
    getExchangeRates: build.query<
      Requests['getExchangeRates']['response'],
      Requests['getExchangeRates']['args']
    >({
      query: () => ({
        url: '/currency-rates',
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetExchangeRatesQuery } = CurrencyAPI;

export default CurrencyAPI;
