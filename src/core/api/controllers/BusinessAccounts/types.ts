import { AllAdvertisingServices } from '#config/enums';

export type RequestsBusinessAccounts = {
  getBusinessAccounts: PickApiData<'/api/v1/business-account', 'get'>;
  getBusinessAccount: PickApiData<
    '/api/v1/business-account/{business_account}',
    'get'
  >;

  postBusinessAccount: PickApiData<'/api/v1/business-account', 'post'>;
  patchBusinessAccount: PickApiData<
    '/api/v1/business-account/{business_account}',
    'patch'
  >;
  getBusinessAccountTransactions: PickApiData<
    '/api/v1/business-account/{business_account}/transaction',
    'get'
  >;
  checkInn: PickApiData<'/api/v1/business-account/check-inn', 'post'>;
  resetClientSecret: PickApiData<
    '/api/v1/business-account/{business_account}/reset-client-secret',
    'post'
  >;
  //todo fix api
  getBusinessAccountBalance: {
    args: {
      path: {
        business_account: string;
      };
    };
    response: {
      balance: string;
      business_account_id: string;
      cashback_balance: string;
      services: {
        [key in AllAdvertisingServices]: {
          precalc: {
            cashback: string;
          };
          balance: {
            total_balance: string;
          };
        };
      };
    };
  };
  getStatsBetweenDates: PickApiData<
    '/api/v1/business-account/{business_account}/get-stats-between-dates',
    'get'
  >;
};

export enum TagsApiBusinessAccounts {
  ACCOUNT = 'BUSINESS_ACCOUNT',
  ACCOUNT_BALANCE = 'BUSINESS_ACCOUNT_BALANCE',
  TRANSACTIONS = 'BUSINESS_ACCOUNT_TRANSACTIONS',
}
