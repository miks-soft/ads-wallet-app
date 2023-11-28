import { DeepPartial } from '@reduxjs/toolkit';

import {
  AdvertisingAccountStatuses,
  AllAdvertisingServices,
  CurrencyMap,
  ImplementedAdvertisingServices,
} from '#config/enums';

import { components } from './api';

export type DTOCheckInnRequest = components['schemas']['checkInnRequest'];
export type DTOLogin = components['schemas']['login'];
export type DTOUserinfo = components['schemas']['userinfo'];
export type DTOUserAccount = components['schemas']['userAccount'];
export type DTOCheckAccount = components['schemas']['checkAccount'];
export type DTOBusinessAccount = components['schemas']['businessAccount'];
export type DTOCurrencyRate = components['schemas']['CurrencyRateResource'];
export type DTOFieldsValidationError =
  components['schemas']['FieldsValidationError'];
export type DTOOrderPayLink = components['schemas']['OrderPayLink'];
export type DTOPayment = components['schemas']['Payment'];
export type DTOEloquentPaginationLinks =
  components['schemas']['EloquentPaginationLinks'];
export type DTOEloquenPaginationMetaLink =
  components['schemas']['EloquenPaginationMetaLink'];
export type DTOEloquentPaginationMeta =
  components['schemas']['EloquentPaginationMeta'];
export type DTOOrderStatus = components['schemas']['OrderStatus'];
export type DTOCurrency = components['schemas']['Currency'];
export type DTOGateway = components['schemas']['Gateway'];
export type DTOOrder = components['schemas']['Order'];
export type DTOTransaction = components['schemas']['Transaction'];
export type DTOBalance = components['schemas']['Balance'];
export type DTOAdditionalManager = components['schemas']['AdditionalManager'];
export type DTOFinanceDocument = components['schemas']['FinanceDocument'];

const exampleConditionRange = {
  max: '10000000',
  min: '1001',
  percent: '3',
};

export type DTOConditionRange = typeof exampleConditionRange;

const exampleAdvertAccount = {
  id: '070909f2-5659-4bb2-8af2-296b6435f50f',
  business_account_id: '0db5741b-6dbc-4c67-90a5-3fc490861555',
  user_id: 'f5a2c82b-0a5c-41c7-a347-6ab6b18c5f85',
  account_name: 'uogpan@mailto.plus',
  description: 'Test imedia Руслан 14<br />1f03a179bb@agency_client',
  service: ImplementedAdvertisingServices.MyTarget,
  agency_account_type: 'default',
  status: AdvertisingAccountStatuses.ACTIVE,
  decline_reason: null,
  service_currency: CurrencyMap.USD,
  is_exist: 1,
  created_at: '2022-03-14T11:19:02.000000Z',
  updated_at: '2022-10-27T23:00:16.000000Z',
  balance: '43.00',
  spent: '0.00',
  campaings: 0,
};

export type DTOAdvertAccount = typeof exampleAdvertAccount;

const exampleAdvertAccountCampaign = {
  id: '54578782',
  name: 'YD_AON_Performance_SMB_Webinar_MIXED_Product-VCC_SEARCH_RU',
  total_limit: '0.00',
  limit_type: 'daily',
  spent: '33035.81',
  click: 928,
};

export type DTOAdvertAccountCampaign = typeof exampleAdvertAccountCampaign;

const exampleChat = {
  id: 'fbf6615a-8632-4d57-b729-9f444050383b',
  status: null,
  name: '1',
  new_count: 0,
  description: '2222',
  created_at: '2021-12-22T13:18:32.000000Z',
  updated_at: '2021-12-23T08:31:32.000000Z',
  theme: null,
  attachments: [
    {
      id: '80fea5d1-3229-4fa4-8c44-5ee5f0b714b2',
      filename: 'https-avatars-mds-yandex-net-get-pdb-1340633-f74.jpeg',
      src: 'https://api.tracker.yandex.net/v2/attachments/40/https-avatars-mds-yandex-net-get-pdb-1340633-f74.jpeg',
    },
  ],
  comments: [
    {
      id: 'b4c3a4cc-2653-4cc7-a408-b35ab3ce249a',
      text: 'asdasdasd',
      user_id: 'f5a2c82b-0a5c-41c7-a347-6ab6b18c5f85',
      manager: null,
      created_at: '2021-12-23T08:29:13.000000Z',
      attachments: [
        {
          id: '80fea5d1-3229-4fa4-8c44-5ee5f0b714b2',
          filename: 'https-avatars-mds-yandex-net-get-pdb-1340633-f74.jpeg',
          src: 'https://api.tracker.yandex.net/v2/attachments/40/https-avatars-mds-yandex-net-get-pdb-1340633-f74.jpeg',
        },
      ],
    },
    {
      id: '41eb5dc3-f0fe-4bf6-9c28-3bec5615c9eb',
      text: 'xcvxcvxcvxcv',
      user_id: 'f5a2c82b-0a5c-41c7-a347-6ab6b18c5f85',
      created_at: '2021-12-23T08:31:32.000000Z',
      attachments: [],
    },
  ],
};

const exampleAttachment = {
  id: '1b9ba490-8dad-4bc1-a2e2-092b81b8db63',
  filename: '244510069_548453619591095_5346682221689629673_n.jpg',
  src: 'https://api.tracker.yandex.net/v2/attachments/41/244510069_548453619591095_5346682221689629673_n.jpg',
};

export type DTOChat = DeepPartial<typeof exampleChat>;
export type DTOAttachment = typeof exampleAttachment;

const exampleHelpdesk = {
  id: 'e0f5a4ab-eb38-4e8c-90f3-df25290105c7',
  status: 1,
  name: 'файлы',
  description: 'файлы',
  created_at: '2022-10-19T11:36:32.000000Z',
  updated_at: '2022-12-29T11:50:41.000000Z',
  theme: {
    id: '35de8095-e985-4a10-b6ed-1ff3b6cfd3d0',
    name: 'Сформировать счет',
  },
  attachments: [
    {
      id: 'd8d2bb74-132d-428c-8551-616a146f81ae',
      filename: 'capability-slider-img-4.png',
      src: 'https://api.tracker.yandex.net/v2/attachments/74/capability-slider-img-4.png',
    },
    {
      id: 'fbd3ac5d-b70e-4c88-8382-e7cb8c017e2b',
      filename: 'Katalog_paneli_iz_fibrobetona_compressed (1).pdf',
      src: 'https://api.tracker.yandex.net/v2/attachments/73/Katalog_paneli_iz_fibrobetona_compressed%20(1).pdf',
    },
  ],
  comments: [
    {
      id: 'b7272a69-6ef3-4f14-8619-04854454e6d2',
      text: 'ащцощ цуалцущз цуоашцу',
      user_id: 'f5a2c82b-0a5c-41c7-a347-6ab6b18c5f85',
      manager: null,
      is_new: 0,
      created_at: '2022-10-26T11:47:19.000000Z',
      attachments: [
        {
          id: '59854406-7c4f-45c7-b04b-1fae554ec241',
          filename: 'undefined.png',
          src: 'https://api.tracker.yandex.net/v2/attachments/76/undefined.png',
        },
      ],
    },
    {
      id: '9a5d46b2-d207-4d6d-b3c6-99d1e0a20716',
      text: 'ответ мой',
      user_id: null,
      manager: 'Администратор ADSWallet',
      is_new: 0,
      created_at: '2022-12-29T11:50:41.000000Z',
    },
  ],
};

export type DTOHelpdeskRequest = typeof exampleHelpdesk;
export type DTOHelpdeskTheme = { id: string; name: string };

const exampleDayData = {
  date: '2023-01-03',
  balance: '0.0000',
  spent: '0.0000',
};

const exampleWeekData = {
  for_date: '2023-01-02',
  week: 1,
  balance: '49.0000',
  spent: '0.0000',
};

const exampleMonthData = {
  for_date: '2023-01-03',
  month: 1,
  balance: '-39.0000',
  spent: '0.0000',
};

export type DTOChart = {
  for_date: string;
  balance: string;
  spent: string;
};

export type DTOChartDay = typeof exampleDayData;
export type DTOChartWeek = typeof exampleWeekData;
export type DTOChartMonth = typeof exampleMonthData;

type DTOStatsShared = {
  total_balance: string;
  total_spent: string;
  total_cashback: string;
  spent_percent_per_services: Record<AllAdvertisingServices, string | number>;
};

export type DTOChartsServiceRaw = {
  total_spent_in_service: number;
  by_days: DTOChartDay[];
  by_weeks: DTOChartWeek[];
  by_months: DTOChartMonth[];
};

export type DTOStatsRaw = DTOStatsShared & {
  dynamic_of_spent: Record<AllAdvertisingServices, DTOChartsServiceRaw>;
};

export type DTOChartsService = {
  total_spent_in_service: number;
  by_days: DTOChart[];
  by_weeks: DTOChart[];
  by_months: DTOChart[];
};

export type DTOStats = DTOStatsShared & {
  dynamic_of_spent: Record<AllAdvertisingServices, DTOChartsService>;
};

const exampleObserverClient = {
  id: '74f1439e-fe94-4def-a45c-65e43264059e',
  name: 'ImediaTest_5_new',
  account_id: '1f7e3e6a-61fe-4773-9dda-720b7a24cb93',
  account_name: 'https://vk.com/gektor_pro',
};

const exampleObserver = {
  id: '1bf3f356-84a2-4a53-91d7-7610acc47845',
  user_id: '650554120',
  first_name: 'Aleksey',
  last_name: 'Shelkovin',
  clients: [exampleObserverClient],
};

export type DTOObserver = typeof exampleObserver;

export type DTOObserverClient = typeof exampleObserverClient;
