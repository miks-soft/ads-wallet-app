export type RequestsAdvertServices = {
  refund: PickApiData<
    '/api/v1/advertservice/transfer-from-account-to-business-account',
    'post'
  >;
  addAccount: PickApiData<'/api/v1/advertservice/add-account', 'post'>;
  checkAccount: PickApiData<'/api/v1/advertservice/check-account', 'post'>;
  getAccounts: PickApiData<'/api/v1/advertservice/get-accounts', 'get'>;
  getAccountsBalance: PickApiData<
    '/api/v1/advertservice/accounts/total/balance',
    'get'
  >;
  getServiceAccounts: PickApiData<'/api/v1/advertservice/accounts/list', 'get'>;
  getAccountCampaigns: PickApiData<'/api/v1/advertservice/campaings', 'get'>;
  getAvailableServices: PickApiData<'/api/v1/advertservice/list', 'get'>;
  changeCampaignBudget: PickApiData<
    '/api/v1/advertservice/change-campaign-budget',
    'post'
  >;
  changeAccountBalance: PickApiData<
    '/api/v1/advertservice/change-account-balance',
    'post'
  >;
  getActiveServicesAccounts: PickApiData<
    '/api/v1/advertservice/active-accounts-in-services',
    'get'
  >;
};

export enum TagsApiAdvertServices {
  SERVICE_BALANCE = 'ADVERT_ACCOUNT_BALANCE',
  ACCOUNTS = 'ADVERT_SERVICE_ACCOUNTS',
  ACCOUNT_CAMPAIGNS = 'ACCOUNT_CAMPAIGNS',
}
