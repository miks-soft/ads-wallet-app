import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import { Icon, Loader, NoDataError, Tabs } from '#ui-kit';

import { BrandedHeader } from '#components';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import { STRINGS } from '#localization';

import { Colors } from '#styles/theme';
import { useColors } from '#styles/theme/ColorsContext';

import { ViewProps } from '.';
import HelpdeskRequest from './components/HelpdeskRequest';
import { HelpdeskQueryStatuses } from './types';

const Layout: React.FC<ViewProps> = props => {
  const colors = useColors();
  const styles = getStyles(colors);
  const t = STRINGS.SCREEN_HELPDESK;
  return (
    <View style={styles.container}>
      <BrandedHeader
        rightIcon={
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate(AppRoutes.Modals, {
                screen: ModalsRoutes.CreateHelpdeskRequest,
                params: {
                  onEnd: props.onRefresh,
                },
              })
            }
          >
            <Icon name="plus" />
          </TouchableOpacity>
        }
        onPressLeft={props.navigation.openDrawer}
      />
      <FlatList
        data={props.helpdeskRequests}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListEmptyComponent={
          <NoDataError
            subtitle={t.noDataErrorSubtitle}
            title={t.noDataTitle}
          />
        }
        ListFooterComponent={
          <View style={styles.loaderContainer}>
            {props.isLoading && !props.isRefreshing && <Loader />}
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Tabs
              data={[
                {
                  text: t.openIssues,
                  value: HelpdeskQueryStatuses.open,
                },
                {
                  text: t.archive,
                  value: HelpdeskQueryStatuses.archive,
                },
              ]}
              renderItem={item => (
                <Tabs.Tab
                  displayValue={item.text}
                  isActive={item.value === props.tab}
                  size="small"
                  value={item.value}
                  onChange={props.setTab}
                />
              )}
              keyExtractor={item => item.value}
            />
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={props.isRefreshing}
            onRefresh={props.onRefresh}
          />
        }
        renderItem={({ item }) => (
          <HelpdeskRequest
            item={item}
            onPress={() =>
              props.navigation.navigate(AppRoutes.HelpdeskChat, {
                defaultHelpdeskRequest: item,
                helpdeskRequestId: item.id,
              })
            }
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
      backgroundColor: colors.white,
    },
    divider: {
      borderColor: colors.grayscale.__5,
      borderTopWidth: 1,
    },
    header: {
      padding: 16,
      paddingTop: 16,
      paddingBottom: 0,
      backgroundColor: colors.white,
    },
    loaderContainer: {
      minHeight: 28,
      paddingVertical: 12,
    },
  });

export default Layout;
