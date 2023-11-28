import { Query } from '#api';

import { RequestsRegistration as Requests } from './types';

const RegistrationAPI = Query.injectEndpoints({
  endpoints: build => ({
    register: build.mutation<
      Requests['register']['response'],
      Requests['register']['args']
    >({
      query: ({ data }) => ({
        url: '/auth/register',
        data,
        method: 'POST',
      }),
    }),
    resendEmailVerification: build.mutation<
      Requests['resendEmailVerification']['response'],
      Requests['resendEmailVerification']['args']
    >({
      query: ({ data }) => ({
        url: '/auth/email/verify-resend',
        data,
        method: 'POST',
      }),
    }),
  }),
});

export const { useRegisterMutation, useResendEmailVerificationMutation } =
  RegistrationAPI;
