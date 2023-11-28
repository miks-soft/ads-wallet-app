import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { Icon, Loader, NoDataError, Text, TextInput } from '#ui-kit';

import { BrandedHeader, KeyboardAwareFlatList } from '#components';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import { ENUMS, STRINGS } from '#localization';

import {
  AdvertisingAccountStatuses,
  AllAdvertisingServices,
  ImplementedAdvertisingServices,
  MapSortDirectionsIcons,
  SortDirections,
} from '#config/enums';

import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';
import AccountCard from './components/AccountCard/AccountCard';
import {
  AdvertisingFilteringOptions,
  AdvertisingFilteringOptionsValues,
  ServiceAccountActionsMap,
  ServicesCardsMap,
} from './config';

const AddServiceAccountMap = {
  [AllAdvertisingServices.VK]: ModalsRoutes.CreateVkAccount,
  [AllAdvertisingServices.VKAds]: ModalsRoutes.CreateVkAdsAccount,
  [AllAdvertisingServices.MyTarget]: ModalsRoutes.CreateMyTargetAccount,
  [AllAdvertisingServices.Yandex]: ModalsRoutes.CreateYandexAccount,
  [AllAdvertisingServices.Google]: ModalsRoutes.CreateGoogleAccount,
} as const;

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const styles = getStyles(colors);
  const t = STRINGS.SCREEN_ADVERTISING_MANAGEMENT;

  return (
    <View style={styles.container}>
      <BrandedHeader
        rightIcon={
          <>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => {
                props.navigation.navigate(AppRoutes.Modals, {
                  screen: ModalsRoutes.RadioSelect,
                  params: {
                    data: Object.values(AdvertisingFilteringOptions),
                    keyExtractor: item => item,
                    checkedExtractor: (item, currentItem) =>
                      item === currentItem,
                    renderItem: (item: AdvertisingFilteringOptionsValues) => (
                      <Text style={styles.selectItem}>
                        {ENUMS.AdvertisingFilteringOptions[item]}
                      </Text>
                    ),
                    onSelectionEnd: item =>
                      props.setSortBy && props.setSortBy(item),
                    title: t.sortModal.title,
                    defaultValue: props.sortBy,
                  },
                });
              }}
            >
              <Icon
                color={colors.black}
                name="filter"
              />
              {props.sortBy && <View style={styles.indicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => {
                props.navigation.navigate(AppRoutes.Modals, {
                  screen: ModalsRoutes.RadioSelect,
                  params: {
                    data: Object.values(AdvertisingAccountStatuses),
                    keyExtractor: item => item,
                    checkedExtractor: (item, currentItem) =>
                      item === currentItem,
                    renderItem: (item: AdvertisingAccountStatuses) => (
                      <Text style={styles.selectItem}>
                        {ENUMS.AdvertisingAccountStatuses[item]}
                      </Text>
                    ),
                    onSelectionEnd: item =>
                      props.setFilterByStatus && props.setFilterByStatus(item),
                    title: t.filterModal.title,
                    defaultValue: props.filterByStatus,
                  },
                });
              }}
            >
              <Icon
                color={colors.black}
                name="sort"
              />

              {props.filterByStatus && <View style={styles.indicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() =>
                props.setSortDirection(
                  props.sortDirection === SortDirections.ASC
                    ? SortDirections.DESC
                    : SortDirections.ASC,
                )
              }
            >
              <Icon
                color={colors.black}
                name={MapSortDirectionsIcons[props.sortDirection]}
              />
            </TouchableOpacity>
          </>
        }
        rightIconDisabled={true}
        onPressLeft={props.navigation.openDrawer}
      />
      <KeyboardAwareFlatList
        data={props.accounts}
        initialNumToRender={4}
        ListEmptyComponent={
          props.searchFor || props.filterByStatus ? (
            <NoDataError
              subtitle={t.noSearchResultsErrorSubtitle}
              title={t.noSearchResultsErrorTitle}
            />
          ) : (
            <NoDataError
              subtitle={t.noAccountsErrorSubtitle}
              title={t.noAccountsErrorTitle}
              onPress={() =>
                props.currentService &&
                props.navigation.navigate(AppRoutes.Modals, {
                  screen:
                    AddServiceAccountMap[
                      props.currentService as unknown as ImplementedAdvertisingServices
                    ],
                  params: {
                    onEnd: props.onRefresh,
                  },
                })
              }
            />
          )
        }
        ListFooterComponent={
          <View style={styles.loaderContainer}>
            {props.isLoading && !props.isRefreshing && <Loader />}
          </View>
        }
        ListHeaderComponent={
          <>
            <View style={styles.wrapper}>
              <TextInput
                blurOnSubmit={true}
                containerStyle={styles.searchInputContainer}
                IconLeft={
                  <Icon
                    color={colors.grayscale.__3}
                    name="search"
                  />
                }
                IconRight={props.isLoading && <Loader />}
                label={t.searchInputLabel}
                size="small"
                value={props.searchFor}
                onChange={props.setSearchFor}
              />
            </View>

            <ScrollView
              contentContainerStyle={styles.serviceSliderContentContainer}
              directionalLockEnabled={true}
              horizontal={true}
              pagingEnabled={true}
              scrollEventThrottle={32}
              style={styles.serviceSliderScroll}
              onScroll={props.onServiceScroll}
            >
              {!!props.availableServices?.length &&
                props.availableServices.map(el => {
                  const Card = ServicesCardsMap[el];

                  return Card ? (
                    <Card
                      key={el}
                      onRefresh={props.onRefresh}
                    />
                  ) : null;
                })}
            </ScrollView>
            <View />
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={props.isRefreshing}
            onRefresh={props.onRefresh}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.accountsContainer}>
            <AccountCard
              account={item}
              containerStyle={styles.account}
              withActions={
                ![
                  ImplementedAdvertisingServices.Yandex,
                  ImplementedAdvertisingServices.Google,
                ].includes(item.service)
              }
              onPressActions={() =>
                props.navigation.navigate(AppRoutes.Modals, {
                  screen: ModalsRoutes.Actions,
                  params: {
                    buttons:
                      ServiceAccountActionsMap[
                        item.service as ImplementedAdvertisingServices
                      ](item),
                  },
                })
              }
            />
          </View>
        )}
        scrollEventThrottle={16}
        keyExtractor={item => item.id}
        onScroll={props.onFetchMore}
      />
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.grayscale.__6,
    },
    wrapper: {
      paddingHorizontal: 16,
    },
    loaderContainer: {
      minHeight: 28,
      paddingBottom: 12,
    },
    serviceSliderContentContainer: {
      justifyContent: 'center',
      paddingVertical: 12,
    },
    serviceSliderScroll: {
      maxHeight: 112,
    },
    headerIcon: {
      paddingLeft: 8,
    },
    account: {
      marginBottom: 12,
    },
    accountsContainer: {
      paddingHorizontal: 16,
    },
    indicator: {
      width: 10,
      aspectRatio: 1,
      position: 'absolute',
      right: 2,
      bottom: 2,
      borderRadius: 5,
      backgroundColor: colors.error.light,
    },
    selectItem: {
      paddingVertical: 12,
    },
    searchInputContainer: {
      marginTop: 16,
      borderRadius: 8,
    },
  });

export default Layout;
