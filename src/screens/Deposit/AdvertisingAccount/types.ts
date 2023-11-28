export enum DepositAdvertisingAccountSources {
  'WALLET' = 'wallet',
  'CASHBACK' = 'cashback',
}

export const DEFAULT_DEPOSIT_AMOUNT = '5000';

export type UIAdvertisingCampaignDeposit = {
  campaign_id: string;
  amount: string;
  selected: boolean;
  error?: string;
};
