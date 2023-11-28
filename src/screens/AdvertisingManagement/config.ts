import { Linking } from 'react-native';

import { UIActionModalButton } from '#modals/utils/Actions/types';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import { STRINGS } from '#localization';

import { ImplementedAdvertisingServices } from '#config/enums';

import { DTOAdvertAccount } from '#generated/types';

import { ICard } from './components/ServiceCard/config';
import GoogleCard from './components/ServiceCard/GoogleCard';
import MyTargetCard from './components/ServiceCard/MyTargetCard';
import VkAdsCard from './components/ServiceCard/VkAdsCard';
import VkCard from './components/ServiceCard/VkCard';
import YandexCard from './components/ServiceCard/YandexCard';

const ServicesCardsMap: {
  [key in ImplementedAdvertisingServices]: React.FC<Partial<ICard>>;
} = {
  [ImplementedAdvertisingServices.MyTarget]: MyTargetCard,
  [ImplementedAdvertisingServices.VK]: VkCard,
  [ImplementedAdvertisingServices.VKAds]: VkAdsCard,
  [ImplementedAdvertisingServices.Yandex]: YandexCard,
  [ImplementedAdvertisingServices.Google]: GoogleCard,
};

const getMyTargetActions = (account: DTOAdvertAccount) => {
  const buttons: UIActionModalButton[] = [
    {
      type: 'secondary',
      children:
        STRINGS.SCREEN_ADVERTISING_MANAGEMENT.ACCOUNT_ACTIONS.MY_TARGET.open,
      onPress: () => Linking.openURL('https://target.my.com/'),
    },
    {
      type: 'secondary',
      children:
        STRINGS.SCREEN_ADVERTISING_MANAGEMENT.ACCOUNT_ACTIONS.MY_TARGET.refund,
      disabled: +account.balance === 0,
      onPress: (navigation, modal) => {
        navigation.replace(AppRoutes.Modals, {
          screen: ModalsRoutes.CreateRefundAdvertisingAccountBalance,
          params: {
            account,
          },
        });
        modal.closeWithoutGoBack();
      },
    },
  ];

  return buttons;
};

const getVkActions = (account: DTOAdvertAccount) => {
  const buttons: UIActionModalButton[] = [
    {
      type: 'secondary',
      children: STRINGS.SCREEN_ADVERTISING_MANAGEMENT.ACCOUNT_ACTIONS.VK.refund,
      disabled: +account.balance === 0,
      onPress: (navigation, modal) => {
        navigation.replace(AppRoutes.Modals, {
          screen: ModalsRoutes.CreateRefundAdvertisingAccountBalance,
          params: {
            account,
          },
        });
        modal.closeWithoutGoBack();
      },
    },
  ];

  return buttons;
};

const getVkAdsActions = (account: DTOAdvertAccount) => {
  const buttons: UIActionModalButton[] = [
    {
      type: 'secondary',
      children:
        STRINGS.SCREEN_ADVERTISING_MANAGEMENT.ACCOUNT_ACTIONS.VK_ADS.refund,
      disabled: +account.balance === 0,
      onPress: (navigation, modal) => {
        navigation.replace(AppRoutes.Modals, {
          screen: ModalsRoutes.CreateRefundAdvertisingAccountBalance,
          params: {
            account,
          },
        });
        modal.closeWithoutGoBack();
      },
    },
  ];

  return buttons;
};

const ServiceAccountActionsMap: {
  [key in ImplementedAdvertisingServices]: (
    account: DTOAdvertAccount,
  ) => UIActionModalButton[];
} = {
  [ImplementedAdvertisingServices.VK]: getVkActions,
  [ImplementedAdvertisingServices.VKAds]: getVkAdsActions,
  [ImplementedAdvertisingServices.MyTarget]: getMyTargetActions,
  [ImplementedAdvertisingServices.Yandex]: () => [{}],
  [ImplementedAdvertisingServices.Google]: () => [{}],
};

const AdvertisingFilteringOptions: {
  [key in string]: keyof DTOAdvertAccount;
} = {
  NAME: 'account_name',
  CREATED: 'created_at',
  BALANCE: 'balance',
  SPENT: 'spent',
};

export type AdvertisingFilteringOptionsValues =
  (typeof AdvertisingFilteringOptions)[keyof typeof AdvertisingFilteringOptions];

export {
  ServicesCardsMap,
  ServiceAccountActionsMap,
  AdvertisingFilteringOptions,
};
