import BrandedLogo from '#assets/images/branded-logo.png';
import CashbackStats from '#assets/images/cashback-stats.png';
import CashbacKUSA from '#assets/images/cashback-usa.png';
import CostsUSA from '#assets/images/costs-usa.png';
import Costs from '#assets/images/costs.png';
import DefaultAvatar from '#assets/images/default-avatar.png';
import DepositUSA from '#assets/images/deposit-usa.png';
import Deposit from '#assets/images/deposit.png';
import DOCLogo from '#assets/images/docx-icon.png';
import Error from '#assets/images/error.png';
import GoogleAdsLogo from '#assets/images/google-ads-logo.png';
import LogoUSA from '#assets/images/logo-usa.png';
import MyTargetLogo from '#assets/images/myTarget-logo.png';
import MyTargetStep1 from '#assets/images/myTarget-step-1.png';
import MyTargetStep2 from '#assets/images/myTarget-step-2.png';
import MyTargetStep3 from '#assets/images/myTarget-step-3.png';
import NoBusinessAccount from '#assets/images/no-business-account.png';
import PDFLogo from '#assets/images/pdf-icon.png';
import StatisticsChart from '#assets/images/statistics-chart.png';
import Transaction1 from '#assets/images/transaction-1.png';
import Transaction10 from '#assets/images/transaction-10.png';
import Transaction11 from '#assets/images/transaction-11.png';
import Transaction12 from '#assets/images/transaction-12.png';
import Transaction13 from '#assets/images/transaction-13.png';
import Transaction14 from '#assets/images/transaction-14.png';
import Transaction15 from '#assets/images/transaction-15.png';
import Transaction2 from '#assets/images/transaction-2.png';
import Transaction3 from '#assets/images/transaction-3.png';
import Transaction4 from '#assets/images/transaction-4.png';
import Transaction5 from '#assets/images/transaction-5.png';
import Transaction6 from '#assets/images/transaction-6.png';
import Transaction7 from '#assets/images/transaction-7.png';
import Transaction8 from '#assets/images/transaction-8.png';
import Transaction9 from '#assets/images/transaction-9.png';
import VKAdsLogo from '#assets/images/vk-ads-logo.png';
import VKLogo from '#assets/images/vk-logo.png';
import XLSXLogo from '#assets/images/xlsx-icon.png';
import YandexLogo from '#assets/images/yandex-logo.png';

import { REGIONS } from '#config';

const Images = {
  GoogleAdsLogo: GoogleAdsLogo,
  NoBusinessAccount: NoBusinessAccount,
  BrandedLogo: BrandedLogo,
  DefaultAvatar: DefaultAvatar,
  MyTargetLogo: MyTargetLogo,
  LogoUSA: LogoUSA,
  VKLogo: VKLogo,
  VKAdsLogo: VKAdsLogo,
  YandexLogo: YandexLogo,
  MyTargetStep1: MyTargetStep1,
  MyTargetStep2: MyTargetStep2,
  MyTargetStep3: MyTargetStep3,
  DOCLogo: DOCLogo,
  PDFLogo: PDFLogo,
  XLSXLogo: XLSXLogo,
  Error: Error,
  Transaction1: Transaction1,
  Transaction10: Transaction10,
  Transaction11: Transaction11,
  Transaction12: Transaction12,
  Transaction13: Transaction13,
  Transaction14: Transaction14,
  Transaction15: Transaction15,
  Transaction2: Transaction2,
  Transaction3: Transaction3,
  Transaction4: Transaction4,
  Transaction5: Transaction5,
  Transaction6: Transaction6,
  Transaction7: Transaction7,
  Transaction8: Transaction8,
  Transaction9: Transaction9,
  CashbackStatsUSA: CashbacKUSA,
  CashbackStats: CashbackStats,
  CostsUSA: CostsUSA,
  Costs: Costs,
  DepositUSA: DepositUSA,
  Deposit: Deposit,
  StatisticsChart: StatisticsChart,
};

export const LOGO_MAP: { [key in REGIONS]: number } = {
  USA: LogoUSA,
  RU: BrandedLogo,
};

export default Images;
