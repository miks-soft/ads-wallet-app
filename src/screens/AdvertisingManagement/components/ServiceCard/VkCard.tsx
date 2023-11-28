import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { useSelector } from '#hooks/redux';

import { useNavigation, NavigationProp } from '@react-navigation/native';

import FastImage from 'react-native-fast-image';

import { Text, Icon, Loader } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppParamList, AppRoutes } from '#navigation/types';

import { ENUMS, STRINGS } from '#localization';

import { useGetAdvertAccountBalanceQuery } from '#api/controllers/AdvertServices';

import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import {
  CurrencyMap,
  AllAdvertisingServices,
  MapImplementedAdvertisingServicesLogo,
} from '#config/enums';

import { shadow, hitSlop } from '#styles';

import { cardStyles, ICard } from './config';

const textColor = '#FFF';
const _styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    backgroundColor: '#54729b',
  },
});

const styles = cardStyles;
const service = AllAdvertisingServices.VK;

const VkCard: React.FC<Partial<ICard>> = ({
  containerStyle,
  onRefresh = () => {},
}) => {
  const navigation = useNavigation<NavigationProp<AppParamList>>();

  const currentBusinessAccountId = useSelector(
    state => state.app.currentBusinessAccountId,
  );

  const serviceAccountBalanceQuery = useGetAdvertAccountBalanceQuery({
    params: {
      service,
      business_account_id: currentBusinessAccountId,
    },
  });

  const region = useSelector(store => store.app.region);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={[styles.container, shadow.style, _styles.container]}>
        <FastImage
          source={MapImplementedAdvertisingServicesLogo[service]}
          style={styles.logo}
          tintColor={textColor}
        />
        <View style={styles.main}>
          <H2
            color={textColor}
            style={styles.brand}
          >
            {ENUMS.Services[service]}
          </H2>
          <View style={styles.balance}>
            <Text
              color={textColor}
              weight="500"
            >
              {STRINGS.COMPONENT_SERVICE_CARD.balance}{' '}
              {(serviceAccountBalanceQuery.data?.total_balance ||
                !serviceAccountBalanceQuery.isFetching) && (
                <Text
                  color={textColor}
                  weight="700"
                >
                  {NumberFormatter.formatByCurrency(
                    serviceAccountBalanceQuery.data?.total_balance || '0',
                    CurrencyMap[APP_CURRENCY_MAP[region]],
                  )}{' '}
                  {CurrencyMap[APP_CURRENCY_MAP[region]]}
                </Text>
              )}
            </Text>
            {serviceAccountBalanceQuery.isFetching && <Loader />}
          </View>
        </View>
        <View style={styles.sideMenu}>
          <TouchableOpacity
            hitSlop={hitSlop}
            style={styles.sideMenuAction}
            onPress={() =>
              navigation.navigate(AppRoutes.Modals, {
                screen: ModalsRoutes.CreateVkAccount,
                params: {
                  onEnd: onRefresh,
                },
              })
            }
          >
            <Icon
              color={textColor}
              name="person-add"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VkCard;
