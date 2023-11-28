import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { DatePicker, Icon, Loader, NoDataError } from '#ui-kit';

import { BrandedHeader } from '#components';

import { STRINGS } from '#localization';

import { MapSortDirectionsIcons, SortDirections } from '#config/enums';

import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';
import Document from './components/Document';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const styles = getStyles(colors);
  const t = STRINGS.SCREEN_DOCUMENTS;

  return (
    <View style={styles.container}>
      <BrandedHeader onPressLeft={props.navigation.openDrawer} />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={props.documents}
        ListEmptyComponent={
          props.filterEndDate || props.filterStartDate ? (
            <NoDataError
              subtitle={t.noSearchResultsErrorSubtitle}
              title={t.noSearchResultsErrorTitle}
            />
          ) : (
            <NoDataError
              subtitle={t.noDocumentsSubtitle}
              title={t.noDocumentsTitle}
            />
          )
        }
        ListFooterComponent={
          <View style={styles.loaderContainer}>
            {props.isLoading && !props.isRefreshing && <Loader />}
          </View>
        }
        ListHeaderComponent={
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
              inputContainerStyle={styles.inputContainer}
              label={t.endDateLabel}
              maximumDate={new Date()}
              minimumDate={props.filterStartDate}
              onSet={props.setFilterEndDate}
            />
            <View style={styles.sortContainer}>
              {props.isLoading ? (
                <Loader />
              ) : (
                <TouchableOpacity
                  disabled={props.isRefreshing}
                  onPress={() =>
                    props.setSortDirection(old =>
                      old === SortDirections.ASC
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
              )}
            </View>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={props.isRefreshing}
            onRefresh={props.onRefresh}
          />
        }
        renderItem={({ item }) => (
          <Document
            containerStyle={styles.document}
            item={item}
          />
        )}
        scrollEventThrottle={16}
        keyExtractor={item => item.id!}
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
    listContent: {
      gap: 12,
    },
    sortContainer: {
      width: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    document: {
      paddingHorizontal: 16,
    },
    dates: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      paddingHorizontal: 16,
      gap: 8,
    },
    dateContainer: {
      flex: 1,
    },
    inputContainer: {
      borderRadius: 8,
    },
    loaderContainer: {
      minHeight: 28,
      paddingVertical: 12,
    },
  });

export default Layout;
