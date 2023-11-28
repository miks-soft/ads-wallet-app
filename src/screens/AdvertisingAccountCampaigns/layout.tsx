import React from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';

import { Header } from '#ui-kit';

import { ListExtender } from '#components';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import { STRINGS } from '#localization';

import { ViewProps } from '.';
import AdvertisingAccountCampaign from './components/AdvertisingAccountCampaign';

const Layout: React.FC<ViewProps> = props => {
  const t = STRINGS.SCREEN_ADVERTISING_ACCOUNT_CAMPAIGNS;
  return (
    <>
      <Header
        hideRightIcon={true}
        paddingHorizontal={16}
        subtitle={props.route.params.accountName}
        title={t.title}
        onPressLeft={props.navigation.goBack}
      />
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={props.campaigns}
        ListFooterComponent={<ListExtender />}
        ListHeaderComponent={<ListExtender />}
        refreshControl={
          <RefreshControl
            refreshing={props.isRefreshing}
            onRefresh={props.onRefresh}
          />
        }
        renderItem={({ item }) => (
          <AdvertisingAccountCampaign
            item={item}
            onPressPriceChange={() =>
              props.navigation.navigate(AppRoutes.Modals, {
                screen: ModalsRoutes.EditAdvertisingCampaignLimit,
                params: {
                  account: item,
                  service: props.route.params.service,
                  advertisingAccountId: props.route.params.advertisingAccountId,
                },
              })
            }
          />
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
});

export default Layout;
