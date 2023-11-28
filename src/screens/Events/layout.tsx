import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { useSelector } from '#hooks/redux';

import { DatePicker, Icon, Loader, NoDataError, TextInput } from '#ui-kit';
import Text, { H4 } from '#ui-kit/Text';

import { BrandedHeader, KeyboardAwareFlatList } from '#components';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import { ENUMS, STRINGS } from '#localization';

import NumberFormatter from '#services/formatters/Number';

import { APP_CURRENCY_MAP } from '#config';
import { CurrencyMap } from '#config/enums';

import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';
import Transaction from './components/Transaction';
import { EventIdTypes } from './types';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const styles = getStyles(colors);
  const region = useSelector(store => store.app.region);
  const t = STRINGS.SCREEN_EVENTS;

  return (
    <View style={styles.container}>
      <BrandedHeader onPressLeft={props.navigation.openDrawer} />
      <KeyboardAwareFlatList
        data={props.transactions}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListEmptyComponent={
          props.searchFor ||
          props.filterByEvent ||
          props.filterEndDate ||
          props.filterStartDate ? (
            <NoDataError
              subtitle={t.noSearchResultsErrorSubtitle}
              title={t.noSearchResultsErrorTitle}
            />
          ) : (
            <NoDataError
              subtitle={t.noTransactionsSubtitle}
              title={t.noTransactionsTitle}
            />
          )
        }
        ListFooterComponent={
          <View style={styles.loaderContainer}>
            {props.isLoading && !props.isRefreshing && <Loader />}
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <TextInput
              blurOnSubmit={true}
              containerStyle={styles.inputContainer}
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
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate(AppRoutes.Modals, {
                  screen: ModalsRoutes.RadioSelect,
                  params: {
                    data: Object.values(EventIdTypes),
                    keyExtractor: item => item,
                    checkedExtractor: (item, currentItem) =>
                      item === currentItem,
                    renderItem: (item: EventIdTypes) => (
                      <Text style={styles.selectItem}>
                        {ENUMS.EventIdTypes[item]}
                      </Text>
                    ),
                    onSelectionEnd: item => {
                      props.setFilterByEvent && props.setFilterByEvent(item);
                    },
                    title: t.filterModalTitle,
                    defaultValue: props.filterByEvent,
                  },
                });
              }}
            >
              <TextInput
                blurOnSubmit={true}
                containerStyle={styles.inputContainer}
                IconRight={
                  props.filterByEvent ? (
                    <TouchableOpacity
                      onPress={() => props.setFilterByEvent(undefined)}
                    >
                      <Icon name="close" />
                    </TouchableOpacity>
                  ) : (
                    <Icon
                      color={colors.grayscale.__2}
                      name="chevron-bottom"
                    />
                  )
                }
                label={t.filterInputLabel}
                pointerEvents="none"
                size="small"
                value={
                  props.filterByEvent
                    ? ENUMS.EventIdTypes[props.filterByEvent]
                    : ''
                }
              />
            </TouchableOpacity>
            <View style={styles.dates}>
              <DatePicker
                clearable={props.filterStartDate && !props.filterEndDate}
                containerStyle={styles.dateContainer}
                date={props.filterStartDate}
                inputContainerStyle={styles.inputContainer}
                label={t.startDateLabel}
                maximumDate={props.filterEndDate}
                onSet={props.setFilterStartDate}
              />
              <DatePicker
                clearable={!!props.filterEndDate}
                containerStyle={styles.dateContainer}
                date={props.filterEndDate}
                disabled={!props.filterStartDate}
                inputContainerStyle={styles.inputContainer}
                label={t.endDateLabel}
                maximumDate={new Date()}
                minimumDate={props.filterStartDate}
                onSet={props.setFilterEndDate}
              />
            </View>
            <H4 weight="500">
              {t.transactionSummary}{' '}
              <H4
                color={colors.black}
                weight="500"
              >
                {NumberFormatter.format(props.transactionSum || '0')}{' '}
                {CurrencyMap[APP_CURRENCY_MAP[region]]}
              </H4>
            </H4>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={props.isRefreshing}
            onRefresh={props.onRefresh}
          />
        }
        renderItem={({ item }) => <Transaction item={item} />}
        scrollEventThrottle={16}
        keyExtractor={item => item?.id}
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
    divider: {
      width: '100%',
      borderColor: colors.grayscale.__3,
      borderTopWidth: 1,
    },
    dates: {
      flexDirection: 'row',
      gap: 8,
    },
    dateContainer: {
      flex: 1,
    },
    header: {
      paddingTop: 16,
      paddingHorizontal: 16,
    },
    inputContainer: {
      marginBottom: 12,
      borderRadius: 8,
    },
    selectItem: {
      paddingVertical: 12,
    },
    loaderContainer: {
      minHeight: 28,
      paddingVertical: 12,
    },
  });

export default Layout;
