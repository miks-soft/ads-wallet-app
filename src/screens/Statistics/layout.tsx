/* eslint-disable max-lines */
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';

import { useSelector } from '#hooks/redux';

import FastImage from 'react-native-fast-image';

import { DatePicker, Loader, NoDataError, Tabs } from '#ui-kit';
import { H2, H3, H4 } from '#ui-kit/Text';

import { BrandedHeader } from '#components';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import { ENUMS, STRINGS } from '#localization';

import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import {
  AllAdvertisingServices,
  CurrencyMap,
  MapImplementedAdvertisingServicesLogo,
} from '#config/enums';
import Images from '#config/images';

import { SCREEN_WIDTH, shadow } from '#styles';
import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { DTOChart } from '#generated/types';

import { ViewProps } from '.';
import CategoryStats from './components/CategoryStats';
import DonutChartServicesSpents from './components/DonutChartServicesSpents';
import GroupChartServicesSpents from './components/GroupChartServicesSpents';
import ServiceSpentStat from './components/ServiceSpentStat';
import { GroupChartDisplayOptions } from './types';

type UIServiceDetailed = {
  service: AllAdvertisingServices;
  stats: {
    total_spent: string;
    total_balance: string;
    total_cashback: string;
  };
};

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const region = useSelector(store => store.app.region);
  const styles = getStyles(colors);
  const t = STRINGS.SCREEN_STATISTICS;

  const groupChartData = useMemo(() => {
    const data = {} as Record<AllAdvertisingServices, DTOChart[]>;

    if (props.stats?.dynamic_of_spent) {
      Object.entries(props.stats?.dynamic_of_spent).map(([service, stats]) => {
        let _stats = {} as DTOChart[];

        if (props.tab === GroupChartDisplayOptions.Day) {
          _stats = stats.by_days;
        }

        if (props.tab === GroupChartDisplayOptions.Week) {
          _stats = stats.by_weeks;
        }

        if (props.tab === GroupChartDisplayOptions.Month) {
          _stats = stats.by_months;
        }

        data[service as AllAdvertisingServices] = _stats;
      });
    }

    return data;
  }, [props.stats, props.tab]);

  const isNoDataAvailable = useMemo(() => {
    return !(
      props.stats?.total_balance ||
      props.stats?.total_cashback ||
      props.stats?.total_spent
    );
  }, [props.stats]);

  return (
    <View style={styles.container}>
      <BrandedHeader onPressLeft={props.navigation.openDrawer} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={props.isLoading}
            onRefresh={props.onRefresh}
          />
        }
      >
        <View style={styles.dates}>
          <DatePicker
            clearable={false}
            containerStyle={styles.col}
            date={props.filterStartDate}
            inputContainerStyle={styles.inputContainer}
            label={t.startDateLabel}
            maximumDate={props.filterEndDate}
            onSet={props.setFilterStartDate}
          />
          <DatePicker
            clearable={false}
            containerStyle={styles.col}
            date={props.filterEndDate}
            inputContainerStyle={styles.inputContainer}
            label={t.endDateLabel}
            maximumDate={new Date()}
            minimumDate={props.filterStartDate}
            onSet={props.setFilterEndDate}
          />
        </View>

        <View style={styles.title}>
          <H2>{t.ads}</H2>

          {props.isLoading && <Loader />}
        </View>

        <View style={styles.categoryStats}>
          <CategoryStats
            amount={props.stats?.total_balance}
            categoryName={t.deposits}
            image={Images.Deposit}
            isNoDataAvailable={isNoDataAvailable}
            onPress={() => {
              props.navigation.navigate(AppRoutes.Modals, {
                screen: ModalsRoutes.List,
                params: {
                  //@ts-expect-error todo fix docs
                  data: Object.entries(props.stats?.services).map(
                    ([service, stats]) => ({ service, stats }),
                  ) as UIServiceDetailed,
                  keyExtractor: item => item.service,
                  renderItem: (item: UIServiceDetailed) => (
                    <View style={styles.detailsContainer}>
                      <FastImage
                        source={
                          MapImplementedAdvertisingServicesLogo[item.service]
                        }
                        style={styles.serviceLogo}
                      />
                      <View style={styles.detailsInfo}>
                        <H3>{ENUMS.Services[item.service]}</H3>
                        <H4>
                          {NumberFormatter.formatByCurrency(
                            item?.stats.total_balance || '0',
                            CurrencyMap[APP_CURRENCY_MAP[region]],
                          )}{' '}
                          {CurrencyMap[APP_CURRENCY_MAP[region]]}
                        </H4>
                      </View>
                    </View>
                  ),
                  buttonProps: {
                    children: t.goBack,
                    onPress(navigation) {
                      navigation.goBack();
                    },
                  },
                  title: t.deposits,
                },
              });
            }}
          />

          <CategoryStats
            amount={props.stats?.total_spent}
            categoryName={t.withdraws}
            image={Images.Costs}
            isNoDataAvailable={isNoDataAvailable}
            onPress={() => {
              props.navigation.navigate(AppRoutes.Modals, {
                screen: ModalsRoutes.List,
                params: {
                  //@ts-expect-error todo fix docs
                  data: Object.entries(props.stats?.services).map(
                    ([service, stats]) => ({ service, stats }),
                  ) as UIServiceDetailed,
                  keyExtractor: item => item.service,
                  renderItem: (item: UIServiceDetailed) => (
                    <View style={styles.detailsContainer}>
                      <FastImage
                        source={
                          MapImplementedAdvertisingServicesLogo[item.service]
                        }
                        style={styles.serviceLogo}
                      />
                      <View style={styles.detailsInfo}>
                        <H3>{ENUMS.Services[item.service]}</H3>
                        <H4>
                          {NumberFormatter.formatByCurrency(
                            item?.stats.total_spent || '0',
                            CurrencyMap[APP_CURRENCY_MAP[region]],
                          )}{' '}
                          {CurrencyMap[APP_CURRENCY_MAP[region]]}
                        </H4>
                      </View>
                    </View>
                  ),
                  buttonProps: {
                    children: t.goBack,
                    onPress(navigation) {
                      navigation.goBack();
                    },
                  },
                  title: t.withdraws,
                },
              });
            }}
          />

          <CategoryStats
            amount={props.stats?.total_cashback}
            categoryName={t.cashback}
            image={Images.CashbackStats}
            isNoDataAvailable={isNoDataAvailable}
            onPress={() => {
              props.navigation.navigate(AppRoutes.Modals, {
                screen: ModalsRoutes.List,
                params: {
                  //@ts-expect-error todo fix docs
                  data: Object.entries(props.stats?.services).map(
                    ([service, stats]) => ({ service, stats }),
                  ) as UIServiceDetailed,
                  keyExtractor: item => item.service,
                  renderItem: (item: UIServiceDetailed) => (
                    <View style={styles.detailsContainer}>
                      <FastImage
                        source={
                          MapImplementedAdvertisingServicesLogo[item.service]
                        }
                        style={styles.serviceLogo}
                      />
                      <View style={styles.detailsInfo}>
                        <H3>{ENUMS.Services[item.service]}</H3>
                        <H4>
                          {NumberFormatter.formatByCurrency(
                            item?.stats.total_cashback || '0',
                            CurrencyMap[APP_CURRENCY_MAP[region]],
                          )}{' '}
                          {CurrencyMap[APP_CURRENCY_MAP[region]]}
                        </H4>
                      </View>
                    </View>
                  ),
                  buttonProps: {
                    children: t.goBack,
                    onPress(navigation) {
                      navigation.goBack();
                    },
                  },
                  title: t.cashback,
                },
              });
            }}
          />
        </View>

        <View style={styles.donutTitle}>
          <H2>{t.spentsByAccounts}</H2>

          {props.isLoading && <Loader />}
        </View>

        <View style={styles.donut}>
          <DonutChartServicesSpents
            containerStyle={styles.donutContainer}
            data={props.stats?.spent_percent_per_services}
            isNoDataAvailable={isNoDataAvailable}
          />
          <View style={styles.donutStats}>
            {props.stats &&
              Object.entries(props.stats?.dynamic_of_spent).map(
                ([key, value]) => (
                  <ServiceSpentStat
                    key={key}
                    amount={value.total_spent_in_service}
                    isNoDataAvailable={isNoDataAvailable}
                    service={key as AllAdvertisingServices}
                  />
                ),
              )}
          </View>
        </View>

        {!isNoDataAvailable ? (
          <View style={[styles.groupGraph, shadow.style]}>
            <View style={styles.groupGraphControls}>
              <View style={styles.groupTitle}>
                <H2>{t.spentTrends}</H2>

                {props.isLoading && <Loader />}
              </View>

              <Tabs
                data={Object.values(GroupChartDisplayOptions)}
                renderItem={item => (
                  <Tabs.Tab
                    isActive={item === props.tab}
                    value={t.GroupChartDisplayOptions[item]}
                    onChange={() => props.setTab(item)}
                  />
                )}
              />
            </View>

            <GroupChartServicesSpents data={groupChartData} />
          </View>
        ) : (
          <>
            <NoDataError
              subtitle={t.noDataSubtitle}
              title={t.noDataTitle}
            />
            <FastImage
              resizeMode="cover"
              source={Images.StatisticsChart}
              style={styles.noDataImage}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.grayscale.__6,
    },
    scroll: {
      paddingTop: 4,
      paddingHorizontal: 16,
    },
    noDataImage: {
      width: SCREEN_WIDTH / 1.25,
      aspectRatio: 716 / 266,
      marginBottom: 16,
      marginRight: 'auto',
      marginLeft: 'auto',
      transform: [
        {
          translateY: -20,
        },
      ],
    },
    title: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    donutTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    donut: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    groupTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    groupGraph: {
      marginTop: 12,
      paddingTop: 16,
      borderRadius: 8,
      backgroundColor: colors.white,
    },
    groupGraphControls: {
      marginBottom: 6,
      paddingHorizontal: 16,
    },
    donutContainer: {
      flex: 0.45,
      aspectRatio: 1,
    },
    donutStats: {
      flex: 0.55,
      justifyContent: 'center',
      alignItems: 'center',
      gap: -4,
    },
    dates: {
      flexDirection: 'row',
      marginTop: 12,
      marginBottom: 8,
      gap: 4,
    },
    col: {
      width: '50%',
    },
    categoryStats: {
      marginBottom: 8,
      gap: 8,
    },
    inputContainer: {
      borderRadius: 8,
    },
    serviceLogo: {
      height: 48,
      width: 48,
    },
    detailsContainer: {
      flexDirection: 'row',
      marginBottom: 12,
      marginHorizontal: 16,
      padding: 12,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.primary.light,
      borderRadius: 12,
    },
    detailsInfo: {
      justifyContent: 'space-between',
    },
  });

export default Layout;
