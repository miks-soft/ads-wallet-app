export type RequestsAuth = {
  login: PickApiData<'/api/v1/auth/login', 'post'>;
  logout: PickApiData<'/api/v1/auth/logout', 'post'>;
  getUserInfo: PickApiData<'/api/v1/auth/userinfo', 'get'>;
  sendResetPasswordCode: PickApiData<
    '/api/v1/auth/send-reset-password-code',
    'post'
  >;
  checkResetPasswordCode: PickApiData<
    '/api/v1/auth/check-reset-password-code',
    'post'
  >;
  resetPassword: PickApiData<'/api/v1/auth/reset-password', 'post'>;
};

export enum TagsApiAuth {
  USER = 'USER',
}
