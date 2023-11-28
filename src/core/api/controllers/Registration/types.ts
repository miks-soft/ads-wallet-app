export type RequestsRegistration = {
  register: PickApiData<'/api/v1/auth/register', 'post'>;
  resendEmailVerification: PickApiData<
    '/api/v1/auth/email/verify-resend',
    'post'
  >;
};
