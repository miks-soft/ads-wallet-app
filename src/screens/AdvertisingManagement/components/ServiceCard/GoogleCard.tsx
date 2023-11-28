import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { useSelector } from '#hooks/redux';

import { NavigationProp, useNavigation } from '@react-navigation/native';

import FastImage from 'react-native-fast-image';

import { Text, Icon, Loader } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppParamList, AppRoutes } from '#navigation/types';

import { ENUMS, STRINGS } from '#localization';

import { useGetAdvertAccountBalanceQuery } from '#api/controllers/AdvertServices';

import NumberFormatter from '#services/formatters/Number';

import {
  AllAdvertisingServices,
  MapImplementedAdvertisingServicesLogo,
} from '#config/enums';

import { shadow, hitSlop } from '#styles';

import { cardStyles, ICard } from './config';

const textColor = '#202124';
const _styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    backgroundColor: '#f8f9fa',
  },
});
const styles = cardStyles;
const service = AllAdvertisingServices.Google;

const GoogleCard: React.FC<Partial<ICard>> = ({
  containerStyle,
  onRefresh = () => {},
}) => {
  const navigation = useNavigation<NavigationProp<AppParamList>>();

  const currentBusinessAccountId = useSelector(
    state => state.app.currentBusinessAccountId,
  );

  const serviceAccountBalanceQuery = useGetAdvertAccountBalanceQuery(
    {
      params: {
        service: AllAdvertisingServices.Google,
        business_account_id: currentBusinessAccountId,
      },
    },
    {
      skip: !currentBusinessAccountId,
    },
  );

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={[styles.container, shadow.style, _styles.container]}>
        <FastImage
          source={MapImplementedAdvertisingServicesLogo[service]}
          style={styles.logo}
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
                  {NumberFormatter.formatFloat(
                    serviceAccountBalanceQuery.data?.total_balance || '0',
                  )}{' '}
                  $
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
                screen: ModalsRoutes.CreateGoogleAccount,
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

export default GoogleCard;
