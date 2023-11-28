import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  FlatList,
} from 'react-native';

import { useSelector } from '#hooks/redux';

import { useDrawerStatus } from '@react-navigation/drawer';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import FastImage from 'react-native-fast-image';

import { Button, Text, Loader, Icon } from '#ui-kit';
import { H3, H4, H5 } from '#ui-kit/Text';

import { DepositRoutes } from '#navigation/Deposit/types';
import { AppParamList, AppRoutes } from '#navigation/types';

import { ENUMS, STRINGS } from '#localization';

import { useGetBusinessAccountBalanceQuery } from '#api/controllers/BusinessAccounts';

import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import {
  CurrencyMap,
  MapImplementedAdvertisingServicesLogo,
} from '#config/enums';

import { animateLayout } from '#utils';

import { hitSlop } from '#styles';
import { useColors } from '#styles/theme/ColorsContext';

const BusinessAccountBalance: React.FC<{
  containerStyle?: StyleProp<ViewStyle>;
}> = ({ containerStyle }) => {
  const t = STRINGS.DRAWER.BALANCE;
  const navigation = useNavigation<NavigationProp<AppParamList>>();
  const [collapsed, setCollapsed] = useState(false);
  const drawerStatus = useDrawerStatus();
  const colors = useColors();
  const region = useSelector(store => store.app.region);

  const currentBusinessAccountId = useSelector(
    store => store.app.currentBusinessAccountId,
  );

  const businessAccountBalanceQuery = useGetBusinessAccountBalanceQuery(
    {
      path: {
        business_account: currentBusinessAccountId,
      },
    },
    {
      skip: !currentBusinessAccountId,
    },
  );

  useEffect(() => {
    if (drawerStatus === 'open') {
      businessAccountBalanceQuery.refetch();
    } else {
      setCollapsed(true);
    }
  }, [drawerStatus]);

  return (
    <View style={containerStyle}>
      <View style={styles.header}>
        <View>
          <H5 style={styles.title}>{t.balance}</H5>
          <View style={styles.balanceAmount}>
            <Text weight="700">
              {NumberFormatter.formatByCurrency(
                businessAccountBalanceQuery.data?.balance || '0',
                CurrencyMap[APP_CURRENCY_MAP[region]],
              )}{' '}
              {CurrencyMap[APP_CURRENCY_MAP[region]]}
            </Text>

            {businessAccountBalanceQuery.isFetching && <Loader />}
          </View>
        </View>
        <TouchableOpacity
          hitSlop={hitSlop}
          onPress={() => {
            animateLayout();
            setCollapsed(old => !old);
          }}
        >
          <Icon
            color={colors.grayscale.__2}
            name={collapsed ? 'chevron-bottom' : 'chevron-up'}
          />
        </TouchableOpacity>
      </View>

      {!collapsed && (
        <>
          <View style={styles.buttons}>
            <Button
              size="small"
              style={styles.button}
              onPress={() => {
                navigation.navigate(AppRoutes.StackDeposit, {
                  screen: DepositRoutes.BusinessAccount,
                });
              }}
            >
              <H4 color={colors.white}>{t.deposit}</H4>
            </Button>

            <Button
              size="small"
              style={styles.button}
              type="secondary"
              onPress={() => {
                navigation.navigate(AppRoutes.StackDeposit, {
                  screen: DepositRoutes.BusinessAccount,
                });
              }}
            >
              <H4 color={colors.primary.normal}>
                {t.depositAdvertisingAccounts}
              </H4>
            </Button>
          </View>

          {!!businessAccountBalanceQuery.data?.cashback_balance && (
            <>
              <H5 style={styles.title}>{t.cashback}</H5>
              <View style={styles.balanceAmount}>
                <Text weight="700">
                  {NumberFormatter.formatByCurrency(
                    businessAccountBalanceQuery.data?.cashback_balance || '0',
                    CurrencyMap[APP_CURRENCY_MAP[region]],
                  )}{' '}
                  {CurrencyMap[APP_CURRENCY_MAP[region]]}
                </Text>

                {businessAccountBalanceQuery.isFetching && <Loader />}
              </View>
            </>
          )}

          {businessAccountBalanceQuery.data?.services && (
            <FlatList
              contentContainerStyle={styles.servicesList}
              data={Object.entries(businessAccountBalanceQuery.data?.services)}
              renderItem={({ item: [service, stats] }) => (
                <View style={styles.serviceStat}>
                  <View style={styles.serviceInfo}>
                    <FastImage
                      //@ts-expect-error TODO FIX DOCS
                      source={MapImplementedAdvertisingServicesLogo[service]}
                      style={styles.serviceLogo}
                    />
                    {/*//@ts-expect-error TODO FIX DOCS */}
                    <H3 size={16}>{ENUMS.Services[service]}</H3>
                  </View>
                  <H4 size={14}>
                    {NumberFormatter.formatByCurrency(
                      stats.balance?.total_balance,
                      CurrencyMap[APP_CURRENCY_MAP[region]],
                    )}{' '}
                    {CurrencyMap[APP_CURRENCY_MAP[region]]}
                  </H4>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: 2,
  },
  button: {
    marginBottom: 12,
  },
  buttons: {
    paddingVertical: 12,
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceLogo: {
    height: 20,
    width: 20,
  },
  serviceStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  servicesList: {
    marginBottom: 12,
    gap: 10,
  },
});

export default BusinessAccountBalance;
